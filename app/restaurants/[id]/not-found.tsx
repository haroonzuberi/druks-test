import Link from "next/link";

export default function RestaurantNotFound() {
    return (
        <div className="mx-auto mt-16 max-w-6xl px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-800">Restaurant not found</h2>
            <p className="mt-3 text-gray-500">
                That restaurant does not exist, or the link is invalid.
            </p>
            <Link
                href="/"
                className="mt-6 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
            >
                Back to restaurants
            </Link>
        </div>
    );
}
