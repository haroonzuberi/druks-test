import { redirect } from "next/navigation";
import { handleRoute, RouteResult } from "@/server/lib/http";
import { LOGIN_ROUTE } from "@/server/lib/constants";
import { logoutUser } from "@/server/services/auth.service";

export const POST = handleRoute(
    async () => {
        await logoutUser();
        return { status: 201, body: { ok: true } } as RouteResult;
    }
);

export async function GET() {
    await logoutUser();
    redirect(LOGIN_ROUTE);
}
