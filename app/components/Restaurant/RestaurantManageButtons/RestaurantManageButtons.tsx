"use client";

import { postRequest } from "@/server/services/http.service";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const buttonClass =
  "inline-flex w-full items-center justify-center rounded-md px-3 py-2 text-xs font-semibold uppercase text-blue-700 ring-1 ring-blue-200 hover:bg-blue-500 hover:text-white! hover:ring-blue-500";

const deleteButtonClass =
  "inline-flex w-full items-center justify-center rounded-md px-3 py-2 text-xs font-semibold uppercase text-red-700! ring-1 ring-red-500! hover:bg-red-500! hover:text-white! hover:ring-red-500 disabled:opacity-50";

const RestaurantManageButtons = ({
  restaurantId,
  afterDelete = "refresh",
  showDetails = false,
}: {
  restaurantId: number
  afterDelete?: "refresh" | "home"
  showDetails?: boolean
}) => {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this restaurant?")) return;

    setDeleting(true);
    try {
      const response = await postRequest("deleteRestaurant", {}, "DELETE", { id: restaurantId });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        alert(data.error ?? "Could not delete this restaurant.");
        return;
      }

      if (afterDelete === "home") {
        router.push("/");
      }
      router.refresh();
    } catch {
      alert("Could not delete this restaurant.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className={`grid gap-2 ${showDetails ? "w-full grid-cols-3" : "w-56 shrink-0 grid-cols-2"}`}>
      {showDetails && (
        <Link href={`/restaurants/${restaurantId}`} className={buttonClass}>
          Details
        </Link>
      )}
      <Link href={`/restaurants/${restaurantId}/edit`} className={buttonClass}>
        Edit
      </Link>
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className={deleteButtonClass}
      >
        {deleting ? "Deleting…" : "Delete"}
      </button>
    </div>
  );
};

export default RestaurantManageButtons;
