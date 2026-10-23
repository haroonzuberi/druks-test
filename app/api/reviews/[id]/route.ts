import { handleRoute } from "@/server/lib/http";
import { parseId } from "@/server/services/restaurant.service";
import { createReview, deleteReview, updateReview } from "@/server/services/review.service";

type Ctx = { params: Promise<{ id: string }> };

export const POST = handleRoute(async (req: Request, ctx: Ctx) => {

    const { id } = await ctx.params;
    // const body = await req.json().catch(() => { });
    const data = await req.json().catch(() => {});
    return {
        body: {
            restaurant: await createReview(data, parseId(id))
        }
    }
});

export const PATCH = handleRoute(async (req: Request, ctx: Ctx) => {

    const { id } = await ctx.params;
    // const body = await req.json().catch(() => { });
    const data = await req.json().catch(() => {});
    return {
        body: {
            restaurant: await updateReview(data, parseId(id))
        }
    }
});


export const DELETE = handleRoute(async (_req: Request, ctx: Ctx) => {
    const { id } = await ctx.params;
    return {
        body: await deleteReview(parseId(id))
    }
});
