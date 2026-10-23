import { Prisma } from "@/src/generated/prisma/client";
import "server-only";


/**
 * Recomputes averageRating and reviewCount for a restaurant from its reviews.
 * Takes a transaction client so it runs atomically with the review write.
 *
 * Always recomputed from scratch rather than adjusted incrementally:
 * incremental maths drifts with floating point and breaks on deletes.
 */
export async function recalculateRating(
    tx: Prisma.TransactionClient,
    restaurantId: number
): Promise<void> {
    const stats = await tx.review.aggregate({
        where: { restaurantId },
        _avg: { rating: true },
        _count: true,
    });

    await tx.restaurant.update({
        where: { id: restaurantId },
        data: {
            averageRating: stats._avg.rating
                ? Math.round(stats._avg.rating * 10) / 10
                : 0,
            reviewCount: stats._count,
        },
    });
}