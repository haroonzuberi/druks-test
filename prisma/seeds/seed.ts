import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { Cuisine, PrismaClient, Role } from "../../src/generated/prisma/client";

const PASSWORD = "abcd1234";

const OWNERS = [
  { name: "Maya Chen", email: "owner1@example.com" },
  { name: "James Okonkwo", email: "owner2@example.com" },
  { name: "Sofia Alvarez", email: "owner3@example.com" },
  { name: "Liam Patel", email: "owner4@example.com" },
  { name: "Nora Berg", email: "owner5@example.com" },
];

const REVIEWERS = [
  { name: "Ava Brooks", email: "reviewer1@example.com" },
  { name: "Noah Kim", email: "reviewer2@example.com" },
  { name: "Emma Rossi", email: "reviewer3@example.com" },
  { name: "Ethan Walsh", email: "reviewer4@example.com" },
  { name: "Mia Hassan", email: "reviewer5@example.com" },
  { name: "Lucas Nguyen", email: "reviewer6@example.com" },
  { name: "Olivia Grant", email: "reviewer7@example.com" },
  { name: "Henry Cole", email: "reviewer8@example.com" },
  { name: "Isla Moreno", email: "reviewer9@example.com" },
  { name: "Jack Rivera", email: "reviewer10@example.com" },
  { name: "Chloe Bennett", email: "reviewer11@example.com" },
  { name: "Owen Hughes", email: "reviewer12@example.com" },
  { name: "Amelia Shah", email: "reviewer13@example.com" },
  { name: "Leo Fischer", email: "reviewer14@example.com" },
  { name: "Grace Adler", email: "reviewer15@example.com" },
  { name: "Daniel Cho", email: "reviewer16@example.com" },
  { name: "Hannah Price", email: "reviewer17@example.com" },
  { name: "Benjamin Cruz", email: "reviewer18@example.com" },
  { name: "Lily Nakamura", email: "reviewer19@example.com" },
  { name: "Samuel Ortiz", email: "reviewer20@example.com" },
];

const RESTAURANTS: {
  name: string;
  description: string;
  location: string;
  city: string;
  cuisine: Cuisine;
  image: string;
}[] = [
  {
    name: "Harbor & Rye",
    description: "Wood-fired steaks, local seafood, and a long whiskey list in a brick dining room.",
    location: "18 Atlantic Ave",
    city: "Boston",
    cuisine: Cuisine.AMERICAN,
    image: "/assets/uploads/restaurant1.jpg",
  },
  {
    name: "Luna Trattoria",
    description: "Handmade pasta, wood-oven pizza, and a short list of Italian wines.",
    location: "240 Mulberry St",
    city: "New York",
    cuisine: Cuisine.ITALIAN,
    image: "/assets/uploads/restaurant1.jpg",
  },
  {
    name: "Golden Wok",
    description: "Family-style Cantonese plates, dim sum on weekends, and hot pot in the evening.",
    location: "88 Grant Ave",
    city: "San Francisco",
    cuisine: Cuisine.CHINESE,
    image: "/assets/uploads/restaurant1.jpg",
  },
  {
    name: "Spice Route",
    description: "North Indian curries, tandoor breads, and a lunch thali that changes daily.",
    location: "512 Devon Ave",
    city: "Chicago",
    cuisine: Cuisine.INDIAN,
    image: "/assets/uploads/restaurant1.jpg",
  },
  {
    name: "Casa Verde",
    description: "Oaxacan moles, grilled meats, and fresh salsas in a bright courtyard room.",
    location: "901 E 6th St",
    city: "Austin",
    cuisine: Cuisine.MEXICAN,
    image: "/assets/uploads/restaurant1.jpg",
  },
  {
    name: "Sakura House",
    description: "Omakase counter in the back and a casual izakaya menu up front.",
    location: "1401 E Pine St",
    city: "Seattle",
    cuisine: Cuisine.JAPANESE,
    image: "/assets/uploads/restaurant1.jpg",
  },
  {
    name: "Bangkok Garden",
    description: "Thai curries, grilled fish, and a patio shaded by string lights.",
    location: "733 Sunset Blvd",
    city: "Los Angeles",
    cuisine: Cuisine.THAI,
    image: "/assets/uploads/restaurant1.jpg",
  },
  {
    name: "Le Petit Four",
    description: "Classic French bistro cooking: steak frites, onion soup, and a quiet wine bar.",
    location: "41 Ocean Dr",
    city: "Miami",
    cuisine: Cuisine.FRENCH,
    image: "/assets/uploads/restaurant1.jpg",
  },
  {
    name: "Olive & Stone",
    description: "Mezze, grilled lamb, and citrus salads served family style.",
    location: "220 Walnut St",
    city: "Philadelphia",
    cuisine: Cuisine.MEDITERRANEAN,
    image: "/assets/uploads/restaurant1.jpg",
  },
  {
    name: "The Copper Pan",
    description: "Seasonal American plates, a raw bar, and weekend brunch.",
    location: "1600 Larimer St",
    city: "Denver",
    cuisine: Cuisine.AMERICAN,
    image: "/assets/uploads/restaurant1.jpg",
  },
  {
    name: "Nonna's Table",
    description: "Slow Sunday ragù, fresh mozzarella, and tiramisu made in house.",
    location: "77 Taylor St",
    city: "Chicago",
    cuisine: Cuisine.ITALIAN,
    image: "/assets/uploads/restaurant1.jpg",
  },
  {
    name: "Dragon Pearl",
    description: "Sichuan heat, hand-pulled noodles, and a late-night dumpling menu.",
    location: "4300 Bellaire Blvd",
    city: "Houston",
    cuisine: Cuisine.CHINESE,
    image: "/assets/uploads/restaurant1.jpg",
  },
  {
    name: "Tandoor Lane",
    description: "Clay-oven kebabs, butter chicken, and cardamom chai.",
    location: "1919 Greenville Ave",
    city: "Dallas",
    cuisine: Cuisine.INDIAN,
    image: "/assets/uploads/restaurant1.jpg",
  },
  {
    name: "El Mercado",
    description: "Baja tacos, ceviche, and agua frescas from a walk-up counter.",
    location: "3050 India St",
    city: "San Diego",
    cuisine: Cuisine.MEXICAN,
    image: "/assets/uploads/restaurant1.jpg",
  },
  {
    name: "Nori Bar",
    description: "Nigiri, hand rolls, and a small sake list at a twelve-seat counter.",
    location: "215 NW 10th Ave",
    city: "Portland",
    cuisine: Cuisine.JAPANESE,
    image: "/assets/uploads/restaurant1.jpg",
  },
];

const COMMENTS = [
  "Portions were generous and the kitchen sent everything out hot.",
  "Service was friendly without hovering. I would come back for the same dish.",
  "The room was loud, but the food made up for the wait.",
  "Flavors were balanced and nothing tasted overly salty.",
  "A solid neighborhood spot. Nothing fancy, just well cooked.",
  "We waited a bit for a table and it was worth it.",
  "The staff remembered our order from last time, which was a nice touch.",
  "Good for a weeknight. I left full and the bill was fair.",
  "A few dishes were excellent and one was only average.",
  "I would bring friends here again, especially for the mains.",
  "Clean dining room, quick seating, and a menu that is easy to share.",
  "The highlight was the starter. The dessert was fine, not memorable.",
  "Cooking was consistent from the first bite to the last.",
  "Nice pacing between courses and the server checked in at the right times.",
  "I came in hungry and left happy. Simple as that.",
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sample<T>(items: T[], count: number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy.slice(0, count);
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set.");
  }

  const prisma = new PrismaClient({
    adapter: new PrismaMariaDb(connectionString),
  });

  try {
    const passwordHash = await bcrypt.hash(PASSWORD, 10);

    await prisma.review.deleteMany();
    await prisma.restaurant.deleteMany();
    await prisma.user.deleteMany();

    await prisma.user.createMany({
      data: [
        ...OWNERS.map((owner) => ({
          ...owner,
          passwordHash,
          role: Role.OWNER,
        })),
        ...REVIEWERS.map((reviewer) => ({
          ...reviewer,
          passwordHash,
          role: Role.REVIEWER,
        })),
      ],
    });

    const owners = await prisma.user.findMany({
      where: { role: Role.OWNER },
      orderBy: { email: "asc" },
    });
    const reviewers = await prisma.user.findMany({
      where: { role: Role.REVIEWER },
      orderBy: { email: "asc" },
    });

    await prisma.restaurant.createMany({
      data: RESTAURANTS.map((restaurant, index) => ({
        ...restaurant,
        ownerId: owners[index % owners.length]!.id,
      })),
    });

    const restaurants = await prisma.restaurant.findMany({
      orderBy: { id: "asc" },
    });

    const reviews = restaurants.flatMap((restaurant) => {
      const count = randomInt(10, 15);
      return sample(reviewers, count).map((reviewer) => ({
        rating: randomInt(1, 5),
        comment: COMMENTS[randomInt(0, COMMENTS.length - 1)]!,
        reviewerId: reviewer.id,
        restaurantId: restaurant.id,
      }));
    });

    await prisma.review.createMany({ data: reviews });

    const ratingsByRestaurant = new Map<number, number[]>();
    for (const review of reviews) {
      const ratings = ratingsByRestaurant.get(review.restaurantId) ?? [];
      ratings.push(review.rating);
      ratingsByRestaurant.set(review.restaurantId, ratings);
    }

    await Promise.all(
      restaurants.map((restaurant) => {
        const ratings = ratingsByRestaurant.get(restaurant.id) ?? [];
        const averageRating = ratings.length
          ? Math.round((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length) * 10) / 10
          : 0;

        return prisma.restaurant.update({
          where: { id: restaurant.id },
          data: {
            averageRating,
            reviewCount: ratings.length,
          },
        });
      })
    );

    console.log(`Seeded ${owners.length} owners and ${reviewers.length} reviewers.`);
    console.log(`Seeded ${restaurants.length} restaurants and ${reviews.length} reviews.`);
    console.log(`Password for every user: ${PASSWORD}`);
    console.log("Owner logins: owner1@example.com … owner5@example.com");
    console.log("Reviewer logins: reviewer1@example.com … reviewer20@example.com");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
