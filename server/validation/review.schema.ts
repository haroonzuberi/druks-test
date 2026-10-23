import { z } from "zod";


export const reviewSchema = z.object({

    comment: z.string()
        .trim()
        .min(10, "Please write at least 10 characters")
        .max(2000),

    rating: z.coerce.number()
            .int()
            .min(1, "Choose a rating")
            .max(5),

});
