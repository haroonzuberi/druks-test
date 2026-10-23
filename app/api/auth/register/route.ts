import { handleRoute, RouteResult } from "@/server/lib/http";
import { registerUser } from "@/server/services/auth.service";

export const POST = handleRoute(
    async (req: Request) => {
        const body = await req.json().catch(() => ({}));
        const user = await registerUser(body);
        return { status: 201, body: { user } } as RouteResult;
    }
);
