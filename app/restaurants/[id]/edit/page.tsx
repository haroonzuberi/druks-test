import AddRestaurantForm from '@/app/components/Restaurant/AddRestaurantForm/AddRestaurantForm'
import { getSession } from '@/server/lib/auth'
import { getPageMetadata, USER_ROLE_OWNER } from '@/server/lib/constants'
import { orNotFound } from '@/server/lib/http'
import { getRestaurant, parseId } from '@/server/services/restaurant.service'
import { redirect } from 'next/navigation'

export const metadata = getPageMetadata('editRestaurant')

const RestaurantEdit = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const user = await getSession()

  if (!user || user.role !== USER_ROLE_OWNER) {
    redirect("/")
  }

  const restaurant = await orNotFound(() => getRestaurant(parseId(id)))

  if (restaurant.ownerId !== user.id) {
    redirect("/")
  }

  return (
    <AddRestaurantForm restaurant={restaurant} />
  )
}

export default RestaurantEdit
