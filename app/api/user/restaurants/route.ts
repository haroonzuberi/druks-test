import { handleRoute } from "@/server/lib/http";
import { createRestaurant } from "@/server/services/userRestaurant.service";

export const POST = handleRoute(async (req: Request) => {
    
    const form = await req.formData();
    const restaurant = await createRestaurant(form);
    return {
        status: 201,
        body: {
            restaurant
        }
    }
});