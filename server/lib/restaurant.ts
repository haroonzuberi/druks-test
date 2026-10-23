import z from "zod";
import { CUISINES } from "./constants";

export type ReviewAuthor = {
  id: number;
  name: string;
};

export type Review = {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  author: ReviewAuthor;
};

export type RestaurantOwner = {
  id: number;
  name: string;
};

/** What the listing endpoint returns. */
export type Restaurant = {
  id: number;
  name: string;
  description: string;
  location: string;
  city: string;
  cuisine: string;
  image: string | null;
  ownerId: number;
  owner: RestaurantOwner;
  averageRating: number | null;
  reviewCount: number;
  website: string | null;
};

/** What the detail endpoint returns — the listing shape plus reviews. */
export type RestaurantDetail = Restaurant & {
  reviews: Review[];
};

export type RestaurantFilterValues = {
  cuisine: string;
  city: string;
  minRating: string;
  maxRating: string;
  sortOrder: string;
};

export const RESTAURANT_SELECT = {
    id: true,
    name: true,
    description: true,
    location: true,
    city: true,
    cuisine: true,
    image: true,
    ownerId: true,
    averageRating: true,
    reviewCount: true,  
    website: true,
    owner: { select: { id: true, name: true } }
} as const;
/* Restaurant constants END */
