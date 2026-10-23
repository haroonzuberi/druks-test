import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { LOGIN_ROUTE, USER_ROLE_OWNER } from "./server/lib/constants";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

type Payload = {
    sub?: string;
    role?: string
}

async function readToken(req: NextRequest): Promise<Payload | null > {
    const token = req.cookies.get("session")?.value;
    if(!token){
        return null;
    }
    try {
        const {payload} = await jwtVerify(token, secret);
        return payload as Payload;
    } catch {
        return null;
    }
}

export async function proxy(req: NextRequest) {
    const {pathname} = req.nextUrl;
    const payload = await readToken(req);
    const isAuthPage = pathname.startsWith("/auth");

    if(!payload) {
        if(isAuthPage)
            return NextResponse.next();

        const url = req.nextUrl.clone();
        url.pathname = LOGIN_ROUTE;

        url.searchParams.set("next", pathname);

        return NextResponse.redirect(url);
    }

    if(isAuthPage) {
        const home = "/";
        return NextResponse.redirect(new URL(home, req.url));
    }

    if(pathname.startsWith('/user') && payload.role !== USER_ROLE_OWNER) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/restaurants/:path*",
        "/user/:path*",
        "/auth/:path*"
    ]
}
