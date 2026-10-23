import RestaurantManageButtons from '@/app/components/Restaurant/RestaurantManageButtons/RestaurantManageButtons'
import RestaurantReviewsList from '@/app/components/Restaurant/RestaurantReviewsList/RestaurantReviewsList'
import StarRating from '@/app/components/Restaurant/StarRating/StarRating'
import { labelize } from '@/server/lib/constants'
import { RestaurantDetail } from '@/server/lib/restaurant'
import Link from 'next/link'


const RestaurantDetailsComponent = ({restaurant, isOwnerPage = false, currentUserId}: {restaurant: RestaurantDetail, isOwnerPage: boolean, currentUserId?: number}) => {
  const canManage = isOwnerPage && currentUserId === restaurant.ownerId

  return (
    <>
    <div className="mx-auto mt-8 max-w-6xl px-4">
      <Link
        href="/"
        className="inline-flex items-center rounded-md px-3 py-2 text-xs font-semibold uppercase text-gray-700 ring-1 ring-gray-300 hover:bg-gray-100"
      >
        Back
      </Link>
    </div>
    <div className="details-title mx-auto mt-4 flex max-w-6xl items-center justify-between gap-4 px-4">
      <div className="flex items-center gap-4">
        <h2 className="font-bold text-3xl text-gray-800">{restaurant.name}</h2>

        <div>
          <StarRating value={restaurant.averageRating ?? 0} size={28} />
          <span className="text-l text-gray-500">({restaurant.reviewCount})</span>
        </div>
      </div>
      {canManage && (
        <RestaurantManageButtons restaurantId={restaurant.id} afterDelete="home" />
      )}
    </div>

    <div className="mx-auto mb-4 max-w-6xl px-4 text-sm font-semibold text-gray-500">
      {restaurant.location}
    </div>

    <div className="details-split mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4">
      <div>
        <p className="whitespace-pre-line text-justify text-gray-800">
          {restaurant.description}
        </p>
      </div>
      <div className="relative">
          <img src={restaurant.image ?? '/uploads/restaurant1.jpg'} alt={restaurant.name} className="h-48 w-full object-cover" />
          <span className="absolute top-2 left-2 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-gray-700 shadow-sm">
              {restaurant.city}
          </span>
          <span className="absolute top-2 right-2 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-gray-700 shadow-sm">
              {labelize(restaurant.cuisine)}
          </span>
      </div>
    </div>
    <RestaurantReviewsList reviews={restaurant.reviews ?? []} restaurantId={restaurant.id} isOwnerPage={isOwnerPage} currentUserId={currentUserId} />
    </>
  )
}

export default RestaurantDetailsComponent;
