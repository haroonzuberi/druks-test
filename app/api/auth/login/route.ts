import { handleRoute, RouteResult } from "@/server/lib/http";
import { loginUser } from "@/server/services/auth.service";

export const POST = handleRoute(
    async (req: Request) => {
        const body = await req.json().catch(() => ({}));
        const user = await loginUser(body);
        return { status: 201, body: { user } } as RouteResult;
    }
);