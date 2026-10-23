import AddRestaurantForm from '@/app/components/Restaurant/AddRestaurantForm/AddRestaurantForm'
import { getPageMetadata } from '@/server/lib/constants'

export const metadata = getPageMetadata('addRestaurant')

const NewRestaurant = () => {
  return (
    <>
    <AddRestaurantForm />
    </>
  )
}

export default NewRestaurant
