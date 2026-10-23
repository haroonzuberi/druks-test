import "server-only"
import { HttpError } from "../lib/http";
import { prisma } from "../lib/db";
import { requireUser } from "../lib/permissions";
import { listQuerySchema } from "../validation/restaurant.schema";
import { RESTAURANT_SELECT } from "../lib/restaurant";
import { Restaurant, RestaurantDetail, RestaurantFilterValues, Review } from "../lib/restaurant";



/** Parses and validates an id from a URL param. */
export function parseId(raw: string): number {
    const id = Number(raw);
    if (!Number.isInteger(id) || id < 1) throw new HttpError(404, "Restaurant not found");
    return id;
}

const PAGE_SIZE = 12;

export async function listRestaurants(
    query: unknown,
    options: { ownerId?: number } = {}
): Promise<{
    restaurants: Restaurant[],
    total: number;
    page: number;
    totalPages: number
}> {
    await requireUser();

    const parsedQuery = listQuerySchema.safeParse(query);
    if (!parsedQuery.success) {
        throw new HttpError(400, "Invalid Filters", parsedQuery.error.flatten().fieldErrors);
    }
    const { city, cuisine, minRating, maxRating, sortOrder, page } = parsedQuery.data;

    const queryWhere = {
        ...(options.ownerId && { ownerId: options.ownerId }),
        ...(cuisine && { cuisine }),
        ...(city && { city }),
        ...((minRating !== undefined || maxRating !== undefined) && {
            averageRating: {
                ...(minRating !== undefined && { gte: minRating }),
                ...(maxRating !== undefined && { lte: maxRating }),
            },
        }),
    };

    const [restaurants, total] = await prisma.$transaction([
        prisma.restaurant.findMany({
            where: queryWhere,
            orderBy: sortOrder === "created_at"
                ? { createdAt: "desc" }
                : [
                    { averageRating: { sort: sortOrder === "rating_desc" ? "desc" : "asc" } },
                    { createdAt: "desc" },
                ],
            select: RESTAURANT_SELECT,
            skip: (page - 1) * PAGE_SIZE,
            take: PAGE_SIZE,
        }),
        prisma.restaurant.count({ where: queryWhere }),
    ]);



    return {
        restaurants,
        total,
        page,
        totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    };;
}

export async function getRestaurant(id: number): Promise<RestaurantDetail> {
    await requireUser();

    const restaurant = await prisma.restaurant.findUnique({
        where: { id },
        select: {
            ...RESTAURANT_SELECT,
            reviews: {
                select: {
                    id: true,
                    rating: true,
                    comment: true,
                    createdAt: true,
                    author: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            }
        }
    });

    if (!restaurant) {
        throw new HttpError(404, "Restaurant not found");
    }

    const reviews: Review[] = restaurant.reviews.map((review) => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt.toISOString(),
        author: review.author
    }));

    const ratings = reviews.map((review) => review.rating);
    const averageRating = ratings.length
        ? Math.round((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length) * 10) / 10
        : null;

    return {
        ...restaurant,
        reviews,
        averageRating,
        reviewCount: ratings.length
    };
}

