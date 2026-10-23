"use client";
import React, { useState } from 'react'
import TextInput from '../../Global/TextInput/TextInput'
import { useRouter } from 'next/navigation';
import { Restaurant } from '@/server/lib/restaurant';
import { CITIES, CUISINES, labelize } from '@/server/lib/constants';
import { postRequest } from '@/server/services/http.service';

type FieldErrors = Record<string, string[]> | undefined;


const AddRestaurantForm = ({ restaurant }: { restaurant?: Restaurant }) => {
  const router = useRouter();
  const isEdit = Boolean(restaurant);

  const [values, setValues] = useState({
    name: restaurant?.name ?? "",
    description: restaurant?.description ?? "",
    location: restaurant?.location ?? "",
    city: restaurant?.city ?? "",
    cuisine: restaurant?.cuisine ?? "",
    website: restaurant?.website ??""
  });
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const set =
    (key: keyof typeof values) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
        setValues((v) => ({ ...v, [key]: e.target.value }));

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");
    setErrors({});
    setLoading(true);

    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => fd.append(k, v));

    if (file) fd.append("image", file);

    try {
      let res: Response;
      if (isEdit) {
        res = await postRequest("updateRestaurant", fd, "PATCH", { id: restaurant!.id });
      } else {
        res = await postRequest("createRestaurant", fd, "POST");
      }

      const data = await res.json();

      if (!res.ok) {
        if (data.fields) setErrors(data.fields);
        else setFormError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setFormError("Could not reach the server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-10 max-w-2xl mx-auto w-full shadow-2xl p-6 rounded-lg mb-48">
      <form onSubmit={handleSubmit} noValidate className="space-y-6" encType="multipart/form-data">
        {formError && (
          <div role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">
            {formError}
          </div>
        )}

        <TextInput
          id="name" label="Restaurant name" type="text"
          value={values.name} onChange={set("name")} error={errors?.name?.[0]}
        />

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-800">
            Description
          </label>
          <textarea
            id="description" rows={4}
            value={values.description} onChange={set("description")}
            className={`mt-2 block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset
            focus:ring-2 focus:ring-inset
            ${errors?.description ? "ring-red-500 focus:ring-red-600" : "ring-gray-300 focus:ring-blue-600"}`}
          />
          {errors?.description?.[0] && (
            <p className="mt-1 text-sm text-red-600">{errors.description[0]}</p>
          )}
        </div>

        <TextInput
          id="location" label="Address" type="text"
          value={values.location} onChange={set("location")} error={errors?.location?.[0]}
        />


        <TextInput
          id="location" label="Website" type="url"
          value={values.website} onChange={set("website")} error={errors?.website?.[0]}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-semibold text-gray-800">City</label>
            <select
              id="city" value={values.city} onChange={set("city")}
              className="mt-2 block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Choose a city</option>
              {CITIES.map((city) => <option key={city} value={city}>{city}</option>)}
            </select>
            {errors?.city?.[0] && <p className="mt-1 text-sm text-red-600">{errors.city[0]}</p>}
          </div>

          <div>
            <label htmlFor="cuisine" className="block text-sm font-semibold text-gray-800">Cuisine</label>
            <select
              id="cuisine" value={values.cuisine} onChange={set("cuisine")}
              className="mt-2 block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Choose a cuisine</option>
              {CUISINES.map((c) => <option key={c} value={c}>{labelize(c)}</option>)}
            </select>
            {errors?.cuisine?.[0] && <p className="mt-1 text-sm text-red-600">{errors.cuisine[0]}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-semibold text-gray-800">
            Preview image
          </label>
          {isEdit && restaurant?.image && !file && (
            <img src={restaurant.image} alt="" className="mt-2 h-32 w-48 rounded-md object-cover" />
          )}
          <input
            id="image" type="file" accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="mt-2 block w-full text-sm text-gray-600 file:mr-4 file:rounded-md file:border-0
            file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700"
          />
          <p className="mt-1 text-sm text-gray-500">
            {isEdit ? "Leave empty to keep the current image. " : ""}JPEG, PNG or WebP, up to 5 MB.
          </p>
          {errors?.image?.[0] && <p className="mt-1 text-sm text-red-600">{errors.image[0]}</p>}
        </div>

        <div className="flex gap-3">
          <button
            type="submit" disabled={loading}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white
            hover:bg-blue-500 disabled:bg-blue-300"
          >
            {loading ? "Saving…" : isEdit ? "Save changes" : "Create restaurant"}
          </button>
          <button
            type="button" onClick={() => router.back()}
            className="rounded-md px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddRestaurantForm