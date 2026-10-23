import "server-only";
import { redirect } from "next/navigation";
import { getSession, type SessionUser } from "./auth";
import { HttpError } from "./http";
import { getApiUrl, USER_ROLE_OWNER, USER_ROLE_REVIEWER } from "./constants";
import { prisma } from "./db";

export async function requireUser(): Promise<SessionUser> {
    const user = await getSession();
    if (!user) {
        redirect(getApiUrl("logout"));
    }

    return user;
}

export async function requireOwner(): Promise<SessionUser> {
    const user = await requireUser();

    if (user.role !== USER_ROLE_OWNER)
        throw new HttpError(403, "Only restaurant owners can do this");

    return user;
}

export async function requireReviewer(): Promise<SessionUser> {
    const user = await requireUser();

    if (user.role !== USER_ROLE_REVIEWER)
        throw new HttpError(403, "Only revieweres can do this")

    return user;
}

export async function assertOwnRestaurant(userId: number, restaurantId: number) {

    const restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId, ownerId: userId },
        select: { ownerId: true }
    });

    if (!restaurant) {
        throw new HttpError(404, "Restaurant not found");
    }

}