"use client";

import { useEffect, useState } from 'react'
import SubmitReviewForm from '../SubmitReviewForm/SubmitReviewForm'
import { Review } from '@/server/lib/restaurant'
import RestaurantReviewComponent from '../RestaurantReview/RestaurantReview'

const RestaurantReviewsList = ({
  reviews,
  restaurantId,
  isOwnerPage = false,
  currentUserId,
}: {
  reviews: Review[]
  restaurantId: number
  isOwnerPage?: boolean
  currentUserId?: number
}) => {
  const [editingReview, setEditingReview] = useState<Review | null>(null)

  const ownReview = currentUserId
    ? reviews.find((review) => review.author.id === currentUserId)
    : undefined

  const showForm = !isOwnerPage && (!ownReview || editingReview !== null)

  useEffect(() => {
    if (!editingReview) return
    document.getElementById("submit-review")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [editingReview])

  return (
    <>
      <div className="mx-auto my-6 max-w-6xl px-4">
        <h2 className="font-semibold text-2xl text-gray-700 mb-4">Reviews</h2>
        {showForm && (
          <div id="submit-review">
            <SubmitReviewForm
              key={editingReview?.id ?? "new"}
              restaurantId={restaurantId}
              review={editingReview ?? undefined}
              onCancel={editingReview ? () => setEditingReview(null) : undefined}
              onSaved={() => setEditingReview(null)}
            />
          </div>
        )}
        <div className="my-6">
          {reviews && reviews.length > 0 ? <>
            {reviews.map((review) => (
              <RestaurantReviewComponent
                key={review.id}
                review={review}
                isOwn={review.author.id === currentUserId}
                onEdit={() => setEditingReview(review)}
                onDeleted={() => setEditingReview(null)}
              />
            ))}
          </> : <div className="text-center text-gray-500">No reviews yet. Be the first to review this restaurant.</div>}

        </div>
      </div>

    </>
  )
}

export default RestaurantReviewsList
