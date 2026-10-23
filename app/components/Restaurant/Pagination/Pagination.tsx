"use client";

import Link from "next/link";

export default function Pagination({
  current, totalPages, params,
}: {
  current: number;
  totalPages: number;
  params: Record<string, string | undefined>;
}) {
  const href = (p: number) => {
    const qs = new URLSearchParams(
      Object.entries({ ...params, page: String(p) })
        .filter(([, v]) => v) as [string, string][]
    );
    return `/?${qs}`;
  };

  return (
    <nav className="mt-8 flex items-center justify-center gap-4">
      {current > 1 ? (
        <Link href={href(current - 1)} className="text-sm font-semibold text-blue-600">
          Previous
        </Link>
      ) : (
        <span className="text-sm text-gray-300">← Previous</span>
      )}

      <span className="text-sm text-gray-600">
        Page {current} of {totalPages}
      </span>

      {current < totalPages ? (
        <Link href={href(current + 1)} className="text-sm font-semibold text-blue-600">
          Next
        </Link>
      ) : (
        <span className="text-sm text-gray-300">Next →</span>
      )}
    </nav>
  );
}