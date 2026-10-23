import { prisma } from "../lib/db";
import { HttpError } from "../lib/http";
import { requireUser } from "../lib/permissions";
import { RestaurantFilterValues } from "../lib/restaurant";
import { listQuerySchema } from "../validation/restaurant.schema";

// server/services/preference.service.ts
export async function savePreferences(input: RestaurantFilterValues) {
  const user = await requireUser();

  const payload = Object.fromEntries(
    Object.entries(input).filter(([, v]) => v !== "")
  );

  const parsed = listQuerySchema.safeParse(payload);

  if (!parsed.success) throw new HttpError(400, "Invalid filters");


  const { cuisine, city, minRating, maxRating, sortOrder } = parsed.data;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      cuisineFilter: cuisine ?? null,
      cityFilter: city ?? null,
      minRating: minRating ?? null,
      maxRating: maxRating ?? null,
      sortOrder: sortOrder ?? "rating_desc"
    },
  });

  return { ok: true };
}

export async function getPreferences(): Promise<Record<string, string>> {
  const user = await requireUser();

  const prefs = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      cuisineFilter: true,
      cityFilter: true,
      minRating: true,
      maxRating: true,
      sortOrder: true,
    },
  });

  if (!prefs) return {};

  return {
    ...(prefs.cuisineFilter && { cuisine: prefs.cuisineFilter }),
    ...(prefs.cityFilter && { city: prefs.cityFilter }),
    ...(prefs.minRating && { minRating: String(prefs.minRating) }),
    ...(prefs.maxRating && { maxRating: String(prefs.maxRating) }),
    ...(prefs.sortOrder && { sortOrder: prefs.sortOrder }),
  };
}