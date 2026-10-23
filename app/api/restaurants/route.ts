import { handleRoute } from "@/server/lib/http";
import { listRestaurants } from "@/server/services/restaurant.service";

export const GET = handleRoute(async (req: Request) => {
    const params = Object.fromEntries(new URL(req.url).searchParams);
    const restaurants = await listRestaurants(params);
    return {body: {restaurants}};
});



