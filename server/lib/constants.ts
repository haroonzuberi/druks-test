export const USER_ROLE_OWNER = "OWNER" as const;
export const USER_ROLE_REVIEWER = "REVIEWER" as const;


export const USER_ROLES_DATA = [
    {
        value: "OWNER",
        title: "Restaurant owner",
        description: "List and manage your restaurants"
    },
    {
        value: "REVIEWER",
        title: "Reviewer",
        description: "Browse and review restaurants",
    }
];
// defined enum for user role
export type UserRole = typeof USER_ROLE_OWNER | typeof USER_ROLE_REVIEWER;

/* Restaurant Constants START */
export const CUISINES = [
  "ITALIAN", "CHINESE", "INDIAN", "MEXICAN", "JAPANESE",
  "THAI", "FRENCH", "AMERICAN", "MEDITERRANEAN", "OTHER",
] as const;


export type Cuisine = (typeof CUISINES)[number];

export const CITIES = [
  "Albuquerque",        "Atlanta",            "Austin",             "Baltimore",          "Boston",
  "Charlotte",          "Chicago",            "Colorado Springs",   "Columbus",           "Dallas",
  "Denver",             "Detroit",            "El Paso",            "Fort Worth",         "Fresno",
  "Houston",            "Indianapolis",       "Jacksonville",       "Kansas City",        "Las Vegas",
  "Long Beach",         "Los Angeles",        "Louisville",         "Memphis",            "Mesa",
  "Miami",              "Milwaukee",          "Minneapolis",        "Nashville",          "New Orleans",
  "New York",           "Oakland",            "Oklahoma City",      "Omaha",              "Philadelphia",
  "Phoenix",            "Portland",           "Raleigh",            "Sacramento",         "San Antonio",
  "San Diego",          "San Francisco",      "San Jose",           "Seattle",            "Tampa",
  "Tucson",             "Tulsa",              "Virginia Beach",     "Washington",         "Wichita",
] as const;

export type City = (typeof CITIES)[number];

/* Route constants and functions START */
export const LOGIN_ROUTE = "/auth/signin";

const API_PREFIX = '/api';

export const API_ROUTES = {
    register: '/auth/register',
    login: '/auth/login',
    logout: '/auth/logout',
    me: '/auth/me',
    updateRestaurant: '/user/restaurants/{id}',
    deleteRestaurant: '/user/restaurants/{id}',
    createRestaurant: '/user/restaurants',
    createReview: "/reviews/{restaurantId}",
    updateReview: "/reviews/{reviewId}",
    deleteReview: "/reviews/{reviewId}",
    savePreferences: "/preferences",
} as const;

export type ApiRouteKey = keyof typeof API_ROUTES;

export function getApiUrl(urlKey: ApiRouteKey): string {
   
    return API_PREFIX + API_ROUTES[urlKey] 
}
/* Route constants and functions END */

/* Page meta START */
export const WEBSITE_BASE_NAME = "Restaurant Reviewer";

export const PAGE_META = {
    home: {
        title: "Home",
        description: "Browse restaurants",
    },
    signin: {
        title: "Signin",
        description: "Sign in",
    },
    register: {
        title: "Register",
        description: "Register",
    },
    restaurants: {
        title: "Restaurants",
        description: "Browse restaurants",
    },
    restaurantDetails: {
        title: "Restaurant Details",
        description: "Restaurant details and reviews",
    },
    addRestaurant: {
        title: "Add Restaurant",
        description: "Add a new restaurant",
    },
    editRestaurant: {
        title: "Edit Restaurant",
        description: "Edit restaurant details",
    },
} as const;

export type PageMetaKey = keyof typeof PAGE_META;

export function getPageMetadata(key: PageMetaKey) {
    return PAGE_META[key];
    
}
/* Page meta END */
export const labelize = (value: string) => value.charAt(0) + value.slice(1).toLowerCase();