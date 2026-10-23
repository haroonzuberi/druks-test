import "server-only";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./db";
import { UserRole } from "./constants";


const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
const COOKIE_NAME = "session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 Days


export type SessionUser = {
    id: number;
    name: string;
    email: string;
    role: UserRole
};

export function hashPassword(plain: string): Promise<string> {
    return bcrypt.hash(plain, 10);
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
}

export async function createSession(userId: number, role: string): Promise<void> {

    const token = await new SignJWT({ role })
        .setProtectedHeader({ alg: "HS256" })
        .setSubject(userId.toString())
        .setIssuedAt() // Default now
        .setExpirationTime("7d")
        .sign(secret);

    const store = await cookies();

    store.set(COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: MAX_AGE_SECONDS
    })
}

export async function destroySession(): Promise<void> {
    const store = await cookies();
    store.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionUser | null> {
    const token = (await cookies()).get(COOKIE_NAME)?.value;
    if (!token)
        return null;

    try {
        const { payload } = await jwtVerify(token, secret);
        if (!payload.sub)
            return null;

        const user = await prisma.user.findUnique({
            where: { id: parseInt(payload.sub) },
            select: { id: true, name: true, email: true, role: true }
        });

        return user as SessionUser | null;
    } catch {
        return null;
    }
}