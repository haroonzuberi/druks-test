import { handleRoute } from "@/server/lib/http";
import { parseId } from "@/server/services/restaurant.service";
import { deleteRestaurant, updateRestaurant } from "@/server/services/userRestaurant.service";

type Ctx = { params: Promise<{ id: string }> };

export const PATCH = handleRoute(async (req: Request, ctx: Ctx) => {

    const { id } = await ctx.params;
    // const body = await req.json().catch(() => { });
    const form = await req.formData();
    return {
        body: {
            restaurant: await updateRestaurant(parseId(id), form)
        }
    }
});

export const DELETE = handleRoute(async (_req: Request, ctx: Ctx) => {
    const { id } = await ctx.params;
    return {
        body: await deleteRestaurant(parseId(id))
    }
});
