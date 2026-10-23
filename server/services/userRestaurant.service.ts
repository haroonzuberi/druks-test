import { RESTAURANT_SELECT } from "../lib/restaurant";
import { prisma } from "../lib/db";
import { HttpError } from "../lib/http";
import { assertOwnRestaurant, requireOwner } from "../lib/permissions";
import { Restaurant } from "../lib/restaurant";
import { saveImage } from "../lib/upload";
import { restaurantSchema } from "../validation/restaurant.schema";


export async function createRestaurant(form: FormData): Promise<Restaurant> {

    const owner = await requireOwner();

    const parsed = restaurantSchema.safeParse({
        name: form.get('name'),
        description: form.get('description'),
        location: form.get('location'),
        city: form.get('city'),
        cuisine: form.get('cuisine'),
        website: form.get('website')
    });

    if (!parsed.success) {
        throw new HttpError(400, 'Please check the form', parsed.error.flatten().fieldErrors)
    }
    const file = form.get('image');
    const imageUrl = file instanceof File && file.size > 0 ? await saveImage(file) : null;


    const restaurant = await prisma.restaurant.create({
        data: {
            ...parsed.data,
            image: imageUrl,
            ownerId: owner.id
        },

        select: RESTAURANT_SELECT
    });

    return restaurant;
}

export async function updateRestaurant(id: number, form: FormData): Promise<Restaurant> {

    const owner = await requireOwner();
    await assertOwnRestaurant(owner.id, id);

    const parsed = restaurantSchema.safeParse({
        name: form.get('name'),
        description: form.get('description'),
        location: form.get('location'),
        city: form.get('city'),
        cuisine: form.get('cuisine'),
        website: form.get('website')

    });

    if (!parsed.success) {
        throw new HttpError(400, 'Please check the form', parsed.error.flatten().fieldErrors)
    }

    const file = form.get('image');
    const hasNewImage = file instanceof File && file.size > 0;
    const imageUrl = hasNewImage ? await saveImage(file) : undefined
    // const { image, ...rest } = parsed.data;

    const restaurant = await prisma.restaurant.update({
        where: { id },
        data: {
            ...parsed.data,
            ...(imageUrl !== undefined && { image: imageUrl || null })
        },
        select: RESTAURANT_SELECT
    });

    return restaurant;
}

export async function deleteRestaurant(id: number) {
    const owner = await requireOwner();

    await assertOwnRestaurant(owner.id, id);

    await prisma.restaurant.delete({
        where: { id },
    });

    return { ok: true };
}