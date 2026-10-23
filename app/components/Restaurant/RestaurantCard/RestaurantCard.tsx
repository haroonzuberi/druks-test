import Link from 'next/link'
import React from 'react'
import StarRating from '../StarRating/StarRating'
import { Restaurant } from '@/server/lib/restaurant'
import RestaurantManageButtons from '../RestaurantManageButtons/RestaurantManageButtons'
import { labelize } from '@/server/lib/constants'

const RestaurantCard = ({
    restaurant,
    isOwnerPage = false,
    currentUserId,
}: {
    restaurant: Restaurant
    isOwnerPage?: boolean
    currentUserId?: number
}) => {
    const canManage = isOwnerPage && currentUserId === restaurant.ownerId

    return (
        <>
            {restaurant && restaurant.id &&

                <div
                    className="bg-base-100 shadow-xl rounded-lg overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
                >
                    <div className="relative">
                        <img src={restaurant.image ?? '/uploads/restaurant1.jpg'} alt={restaurant.name} className="max-h-48 w-full object-cover" />
                        <span className="absolute top-2 left-2 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-gray-700 shadow-sm">
                            {restaurant.city}
                        </span>
                        <span className="absolute top-2 right-2 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-gray-700 shadow-sm">
                            {labelize(restaurant.cuisine)}
                        </span>
                    </div>
                    <div className="p-2">
                        <div className="mt-1 flex items-center justify-between gap-3 px-2">
                            <h2 className="leading-none text-lg font-semibold text-gray-600">
                                {/* {JSON.stringify(rest)} */}
                                {restaurant.name} - {restaurant.website ?? ""}
                            </h2>
                            <div className="flex shrink-0 items-center gap-1">
                                <StarRating value={restaurant.averageRating ?? 0} size={16} />
                                <span className="text-sm text-gray-500">({restaurant.reviewCount})</span>
                            </div>
                        </div>
                        <p className="px-2 mt-1 leading-none text-sm text-gray-500">
                            {restaurant.description.slice(0, 100)}...
                        </p>
                        <div className="mt-5 px-2 pb-2">
                            {canManage ? (
                                <RestaurantManageButtons restaurantId={restaurant.id} showDetails />
                            ) : (
                                <Link
                                    href={`/restaurants/${restaurant.id}`}
                                    className="inline-flex w-full items-center justify-center rounded-md px-3 py-2 text-xs font-semibold uppercase text-blue-700 ring-1 ring-blue-200 hover:bg-blue-500 hover:text-white! hover:ring-blue-500"
                                >
                                    Details
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            }
        </>

    )
}

export default RestaurantCard
