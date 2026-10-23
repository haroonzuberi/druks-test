import "server-only"
import { HttpError } from "../lib/http";
import { prisma } from "../lib/db";
import { Review } from "../lib/restaurant";
import { reviewSchema } from "../validation/review.schema";

import { requireReviewer } from "../lib/permissions";
import { recalculateRating } from "../lib/rating";


export async function createReview(input: unknown, restaurantId: number): Promise<Review> {
    const parsed = reviewSchema.safeParse(input);
    const user = await requireReviewer();
    if (!user) {
        throw new HttpError(401, "Unauthorized");
    }

    if (!parsed.success) {
        throw new HttpError(400, "Please check the form", parsed.error.flatten().fieldErrors)
    }

    const existingReview = await prisma.review.findUnique({
        where: {
            restaurantId_reviewerId: {
                restaurantId: restaurantId,
                reviewerId: user.id
            }

        },
        select: {
            id: true
        }
    })
    if (existingReview) {
        throw new HttpError(409, "You have already submit review to this restaurant", { comment: ['You have already submit review to this restaurant'] });
    }

    const { rating, comment } = parsed.data;

    return prisma.$transaction(async (tx) => {

        const review = await prisma.review.create({
            data: {
                rating,
                comment,
                reviewerId: user?.id,
                restaurantId: restaurantId
            },
            select: {
                id: true,
                comment: true,
                rating: true,
                author: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        await recalculateRating(tx, restaurantId);

        return review as Review;
    });
}
export async function updateReview(input: unknown, reviewId: number): Promise<Review> {
    const parsed = reviewSchema.safeParse(input);
    const reviewer = await requireReviewer();


    if (!parsed.success) {
        throw new HttpError(400, "Please check the form", parsed.error.flatten().fieldErrors)
    }

    const { rating, comment } = parsed.data;

    const review = await prisma.review.update({
        where: { id: reviewId, reviewerId: reviewer.id },
        data: {
            rating,
            comment,
        },
        select: {
            id: true,
            comment: true,
            rating: true,
            author: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    });
    return review as Review;
}



export async function deleteReview(id: number) {
    const reviewer = await requireReviewer();

    const existing = await prisma.review.findFirst({
        where: { id, reviewerId: reviewer.id },
        select: { id: true, restaurantId: true },
    });

    if (!existing) {
        throw new HttpError(404, "Review not found");
    }
    return prisma.$transaction(async (tx) => {

        await prisma.review.delete({
            where: { id: existing.id },
        });
        await recalculateRating(tx, existing.restaurantId);

        return { ok: true };
    });
}