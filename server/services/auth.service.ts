import "server-only";
import { createSession, destroySession, getSession, hashPassword, SessionUser, verifyPassword } from "../lib/auth";
import { loginSchema, registerSchema } from "../validation/auth.schema";
import { HttpError } from "../lib/http";
import { prisma } from "../lib/db";


export async function registerUser(input: unknown): Promise<SessionUser> {
    const parsed = registerSchema.safeParse(input);
    if (!parsed.success) {
        throw new HttpError(400, "Please check the form", parsed.error.flatten().fieldErrors)
    }

    const { name, email, password, role } = parsed.data;

    const existing = await prisma.user.findUnique({
        where: { email },
        select: { id: true }
    });

    if (existing) {
        throw new HttpError(409, "Email Already Exists", { email: ['Email Already Exists'] });
    }

    const user = await prisma.user.create({
        data: {
            email, role, name, passwordHash: await hashPassword(password)
        },
        select: { id: true, name: true, email: true, role: true }
    });

    await createSession(user.id, user.role);
    return user as SessionUser;
}

export async function loginUser(input: unknown): Promise<SessionUser> {
    const parsed = loginSchema.safeParse(input);
    if (!parsed.success) {
        throw new HttpError(400, "Please check the form", parsed.error.flatten().fieldErrors)
    }

    const { email, password } = parsed.data;
    const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, name: true, email: true, role: true, passwordHash: true }
    });

    const invalidData = new HttpError(401, "invalid Email or Password");

    if (!user) {
        throw invalidData;
    }

    if (await verifyPassword(password, user.passwordHash)) {

        await createSession(user.id, user.role);

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        } as SessionUser;

    } else {
        throw invalidData;
    }

}

export async function logoutUser(): Promise<void> {
    await destroySession();
}

export async function getCurrentUser(): Promise<SessionUser | null> {
    return getSession();
}