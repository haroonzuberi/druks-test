import { z } from "zod";
import { CITIES, CUISINES } from "../lib/constants";

export const restaurantSchema = z.object({
    name: z.string()
        .toLowerCase()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(150, "Name too Long"),

    description: z.string()
        .trim()
        .min(10, "Please write at least 10 characters")
        .max(2000),

    location: z.string()
        .trim()
        .min(3, "Location is Required")
        .max(255),

    city: z.enum(CITIES, {
        errorMap: () => ({ message: "Choose a city" }),
    }),

    cuisine: z.enum(CUISINES, {
        errorMap: () => ({ message: "Choose a cuisine" })
    }),

    website: z.string()
        .toLowerCase()
        .trim()
        .url()
        .min(10, "Website must be at least 10 characters")
        .max(150, "website too Long"),

    image: z.string()
        .trim()
        .max(500)
        .optional()
        .or(z.literal(""))
});

export const restaurantUpdateSchema = restaurantSchema.partial();

export const listQuerySchema = z.object({
    cuisine: z.enum(CUISINES).optional(),
    city: z.enum(CITIES).optional(),
    minRating: z.coerce.number().int().min(1).max(5).optional(),
    maxRating: z.coerce.number().int().min(1).max(5).optional(),
    sortOrder: z.enum(["rating_desc", "rating_asc", "created_at"]).default("rating_desc"),
    page: z.coerce.number().int().min(1).default(1),

}).refine(
  (v) => v.minRating === undefined || v.maxRating === undefined || v.minRating <= v.maxRating,
  { message: "Minimum rating cannot be higher than maximum", path: ["minRating"] }
);