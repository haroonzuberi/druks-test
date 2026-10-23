"use client";

import { Review } from "@/server/lib/restaurant";
import { postRequest } from "@/server/services/http.service";
import { reviewSchema } from "@/server/validation/review.schema";
import { useRouter } from "next/navigation";
import { useState } from "react";

type FieldErrors = Record<string, string[]> | undefined;
const label = (v: string) => v.charAt(0) + v.slice(1).toLowerCase();


const SubmitReviewForm = ({
  review,
  restaurantId,
  onCancel,
  onSaved,
}: {
  review?: Review
  restaurantId: number
  onCancel?: () => void
  onSaved?: () => void
}) => {

  const router = useRouter();
  const isEdit = Boolean(review?.id);
  const [values, setValues] = useState({
    comment: review?.comment ?? "",
    rating: String(review?.rating ?? 5)
  });

  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const set =
    (key: keyof typeof values) =>
      (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) =>
        setValues((v) => ({ ...v, [key]: e.target.value }));

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");
    setErrors({});
    setLoading(true);

    const parsed = reviewSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors);
      setLoading(false);
      return;
    }
    try {
      let response;
      if(review && review.id){
        response = await postRequest("updateReview", parsed.data, "PATCH", { reviewId: review.id });

      }else {
        response = await postRequest("createReview", parsed.data, "POST", { restaurantId });

      }
      const data = await response.json();

      if (!response.ok) {
        if (data.fields) setErrors(data.fields);
        else setFormError(data.error ?? "Something went wrong. Please try again.");
        return;
      } else {
        
        alert(isEdit ? "Review updated" : "Review added");
        onSaved?.();
        router.refresh();
        
      }
    } catch (error) {

      
      console.log(error);
    } finally {
      setLoading(false);
    }

  }
  return (
    <>
      <form className="shadow-md px-4 py-6 rounded-lg space-y-3" onSubmit={handleSubmit}>
        {formError && (
          <div role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">
            {formError}
          </div>
        )}
        <div>
          <label className="text-gray-800 text-sm font-semibold"
          >{isEdit ? "Update your review" : "Have you been here? How did you find it?"}</label>
          <textarea
            id="comment"
            name="comment"
            className={
              `w-full rounded-lg border-0 shadow-sm p-2 h-36 resize-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600
              ${errors?.comment ? "ring-red-500 focus:ring-red-600" : "ring-gray-300 focus:ring-blue-600"}
              `
            }
            placeholder="Write your review..."
            value={values.comment} onChange={set("comment")}

          ></textarea>
        </div>
        {errors?.comment?.[0] && (
          <p className="mt-1 text-sm text-red-600">{errors.comment[0]}</p>
        )}
        <div>
          <label className="text-gray-800 text-sm font-semibold" >Rating</label>
          <select
            className="ms-1 w-20 border-gray-300 border rounded-md p-1"
            id="rating"
            name="rating"
            value={values.rating} onChange={set("rating")}
          >
            <option value="5">5</option>
            <option value="4">4</option>
            <option value="3">3</option>
            <option value="2">2</option>
            <option value="1">1</option>
          </select>
        </div>
        {errors?.rating?.[0] && (
          <p className="mt-1 text-sm text-red-600">{errors.rating[0]}</p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="mt-4 flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white disabled:bg-blue-300"
          >
            {loading ? "Saving…" : isEdit ? "Update review" : "Submit review"}
          </button>
          {isEdit && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="mt-4 rounded-md px-4 py-1.5 text-sm font-semibold text-gray-700 ring-1 ring-gray-300"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </>
  )
}

export default SubmitReviewForm
