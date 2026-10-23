"use client";

import { useState } from 'react'
import StarRating from '../StarRating/StarRating'
import { Review } from '@/server/lib/restaurant';
import { postRequest } from '@/server/services/http.service';
import { useRouter } from 'next/navigation';

function formatReviewDate(iso: string) {
  const [year, month, day] = iso.slice(0, 10).split("-");
  return `${day}/${month}/${year}`;
}

const RestaurantReviewComponent = ({
  review,
  isOwn = false,
  onEdit,
  onDeleted,
}: {
  review: Review
  isOwn?: boolean
  onEdit?: () => void
  onDeleted?: () => void
}) => {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this review?")) return;

    setDeleting(true);
    try {
      const response = await postRequest("deleteReview", {}, "DELETE", { reviewId: review.id });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        alert(data.error ?? "Could not delete this review.");
        return;
      }

      onDeleted?.();
      router.refresh();
    } catch {
      alert("Could not delete this review.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
    <div className="p-4 my-3 shadow-sm">
            <div className="review-meta">
              <div className="grid w-full grid-cols-2 items-center">
                <div className="leading-none">
                  <StarRating value={review.rating} size={20} />
                </div>

                <div className="text-right text-sm text-gray-600">
                  By <strong>{isOwn ? "you" : review.author.name}</strong> on {formatReviewDate(review.createdAt)}
                </div>
              </div>

            </div>

            <div className="mt-2 grid w-full grid-cols-2 items-start">
              <div>
                {review.comment}
              </div>
              {isOwn && (
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={onEdit}
                    className="inline-flex w-28 items-center justify-center rounded-md px-3 py-2 text-xs font-semibold uppercase text-blue-700! ring-1 ring-blue-200 hover:bg-blue-500! hover:text-white! hover:ring-blue-500"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="inline-flex w-28 items-center justify-center rounded-md px-3 py-2 text-xs font-semibold uppercase text-red-700! ring-1 ring-red-500! hover:bg-red-500! hover:text-white! hover:ring-red-500 disabled:opacity-50"
                  >
                    {deleting ? "Deleting…" : "Delete"}
                  </button>
                </div>
              )}
            </div>
          </div>
    </>
  )
}

export default RestaurantReviewComponent;
