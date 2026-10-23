import { listRestaurants } from "@/server/services/restaurant.service";
import RestaurantCard from "./components/Restaurant/RestaurantCard/RestaurantCard";
import RestaurantFilters from "./components/Restaurant/RestaurantFilters/RestaurantFilters";
import { Restaurant, RestaurantFilterValues } from "@/server/lib/restaurant";
import { getCurrentUser } from "@/server/services/auth.service";
import { getPageMetadata, USER_ROLE_OWNER } from "@/server/lib/constants";
import { getPreferences } from "@/server/services/preference.service";
import Pagination from "./components/Restaurant/Pagination/Pagination";
import { HttpError } from "@/server/lib/http";

export const metadata = getPageMetadata('restaurants')

export default async function Home(
  { searchParams }: { searchParams: Promise<Record<string, string | undefined>> }

) {
  const params = await searchParams;

  const user = await getCurrentUser();
  const isOwnerPage = user?.role === USER_ROLE_OWNER;

  const effective =
    Object.keys(params).length === 0 ? await getPreferences() : params;

  let restaurants, page, totalPages
  let filterError: string | null = null

  try {
    (
      { restaurants, page, totalPages } = isOwnerPage
        ? await listRestaurants(effective, { ownerId: user!.id })
        : await listRestaurants(effective)
    )
  } catch (err) {
    if (err instanceof HttpError && err.status === 400) {
      filterError = "Some filters were invalid and have been ignored."
        ; ({ restaurants, page, totalPages } = isOwnerPage
          ? await listRestaurants({}, { ownerId: user!.id })
          : await listRestaurants({}))
    } else {
      throw err
    }
  }
  return (
    <>
      <RestaurantFilters initial={effective} error={filterError} />
      <div className="mx-auto max-w-6xl w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">

        {restaurants.length > 0 ? restaurants.map((restaurant: Restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} isOwnerPage={isOwnerPage} currentUserId={user?.id} />
        ))
          : <>
            <p className="mt-10 text-center text-gray-500 col-span-full">
              No restaurants available.
            </p>
          </>
        }
      </div>
      {totalPages > 1 && (
        <Pagination current={page} totalPages={totalPages} params={effective} />
      )}
    </>
  );
}
