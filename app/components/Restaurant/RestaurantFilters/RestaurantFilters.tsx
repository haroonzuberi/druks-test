"use client";
import { CITIES, CUISINES, labelize } from '@/server/lib/constants'
import { RestaurantFilterValues } from '@/server/lib/restaurant';
import { postRequest } from '@/server/services/http.service';
import { useRouter } from 'next/navigation';
import { useState } from 'react';



const RestaurantFilters = ({
    initial,
    error,
}: {
    initial: Record<string, string | undefined>
    error?: string | null
}) => {
    const [filterValues, setFilterValues] = useState<RestaurantFilterValues>({
        cuisine: initial.cuisine ?? "",
        city: initial.city ?? "",
        minRating: initial.minRating ?? "",
        maxRating: initial.maxRating ?? "",
        sortOrder: initial.sortOrder ?? "rating_desc",
    });

    const router = useRouter();

    const set =
        (key: keyof RestaurantFilterValues) =>
            (e: React.ChangeEvent<HTMLSelectElement>) => {
                const next = { ...filterValues, [key]: e.target.value };
                setFilterValues(next);

                const qs = new URLSearchParams(
                    Object.entries(next).filter(([, v]) => v !== "") as [string, string][]
                );
                router.push(`/?${qs}`);

                postRequest("savePreferences", next, "PATCH").catch(() => { });
            };

    return (
        <>
            <div className="mx-auto max-w-6xl w-full px-4 py-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <div className="flex flex-col gap-1">
                        <label htmlFor='cuisineFilter' className="text-sm text-gray-500">Cuisine</label>
                        <select id="cuisineFilter" className="w-full border-gray-300 border rounded-md p-2"
                            value={filterValues.cuisine}
                            onChange={set("cuisine")}
                        >
                            <option value="">Any</option>

                            {CUISINES.map((cuisine: string) => (
                                <option key={cuisine} value={cuisine}>{labelize(cuisine)}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="minRatingFilter" className="text-sm text-gray-500">Minimum rating</label>
                        <select id="minRatingFilter" className="w-full border-gray-300 border rounded-md p-2"
                            value={filterValues.minRating}
                            onChange={set("minRating")}

                        >
                            <option value="">Any</option>
                            {[1, 2, 3, 4, 5].map((n) => (
                                <option
                                    key={n}
                                    value={n}
                                    disabled={Boolean(filterValues.maxRating) && n > Number(filterValues.maxRating)}
                                >
                                    {n}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor='maxRatingFilter' className="text-sm text-gray-500">Maximum rating</label>
                        <select id="maxRatingFilter" className="w-full border-gray-300 border rounded-md p-2"
                            value={filterValues.maxRating}
                            onChange={set("maxRating")}
                        >
                            <option value="">Any</option>

                            {[1, 2, 3, 4, 5].map((n) => (
                                <option
                                    key={n}
                                    value={n}
                                    disabled={Boolean(filterValues.minRating) && n < Number(filterValues.minRating)}
                                >
                                    {n}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor='citiesFilter' className="text-sm text-gray-500">City</label>
                        <select id="citiesFilter" className="w-full border-gray-300 border rounded-md p-2"
                            value={filterValues.city}
                            onChange={set("city")}
                        >
                            <option value="">Any</option>
                            {CITIES.map((city: string) => (
                                <option key={city} value={city}>{labelize(city)}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-500">Sort By</label>
                        <select className="w-full border-gray-300 border rounded-md p-2"
                            value={filterValues.sortOrder}
                            onChange={set("sortOrder")}
                        >
                            <option value="rating_desc">Best Rated First</option>
                            <option value="rating_asc">Worst Rated First</option>
                            <option value="created_at">Newly Added</option>
                        </select>
                    </div>
                </div>
                {error && (
                    <p role="alert" className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
                        {error}
                    </p>
                )}
            </div>

        </>
    )
}

export default RestaurantFilters
