import RestaurantDetailsComponent from '@/app/components/Restaurant/RestaurantDetails/RestaurantDetails';
import { getSession } from '@/server/lib/auth';
import { getPageMetadata, USER_ROLE_OWNER } from '@/server/lib/constants';
import { orNotFound } from '@/server/lib/http';
import { RestaurantDetail } from '@/server/lib/restaurant';
import { getRestaurant, parseId } from '@/server/services/restaurant.service';

export const metadata = getPageMetadata('restaurantDetails')

const RestaurantDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const user = await getSession();
    const isOwnerPage = user?.role === USER_ROLE_OWNER;

    const restaurant: RestaurantDetail = await orNotFound(() => getRestaurant(parseId(id)));

    return (
        <RestaurantDetailsComponent restaurant={restaurant} isOwnerPage={isOwnerPage} currentUserId={user?.id} />
    )
}

export default RestaurantDetails
