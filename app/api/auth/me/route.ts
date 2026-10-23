import { handleRoute, RouteResult } from "@/server/lib/http";
import { getCurrentUser } from "@/server/services/auth.service";

export const GET = handleRoute(
    async () => {
        const user = getCurrentUser();
        return { status: 201, body: { user } } as RouteResult;
    }
);
