# Restaurant Reviewer

A Next.js app for browsing restaurants, leaving ratings and reviews, and letting restaurant owners manage their listings. Signed-in users have one of two roles:

- **Owner** — create, edit, and delete their own restaurants. The home page shows only their listings.
- **Reviewer** — browse every restaurant, filter the list, and leave one review per restaurant.

Filters (city, cuisine, rating range, sort) are saved on the user and restored the next time they open the home page with no query string.

## Technologies

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, React Server Components) |
| UI | React 19, Tailwind CSS 4 |
| Language | TypeScript 5 |
| Database | MySQL, accessed with Prisma 7 and the MariaDB driver adapter |
| Auth | JWT session cookie (`jose`, HS256, 7 days) and `bcryptjs` password hashes |
| Validation | Zod |
| Route guard | `proxy.ts` redirects unauthenticated visits to sign-in |

Pages live under `app/`. Data access, auth, and validation live under `server/` and are marked `server-only`. The browser talks to Route Handlers in `app/api/`.

## Dependencies

Runtime (`dependencies`):

| Package | Role |
| --- | --- |
| `next` | App framework and routing |
| `react`, `react-dom` | UI |
| `@prisma/client`, `@prisma/adapter-mariadb` | Database client and MySQL/MariaDB adapter |
| `bcryptjs` | Password hashing |
| `jose` | Sign and verify the session JWT |
| `zod` | Request and form validation |
| `dotenv` | Load `DATABASE_URL` for Prisma config and the seed script |
| `react-simple-star-rating` | Star rating control |

Development (`devDependencies`):

| Package | Role |
| --- | --- |
| `typescript` | Type checking |
| `tailwindcss`, `@tailwindcss/postcss` | Styling |
| `prisma` | Schema, migrations, and Prisma Studio |
| `tsx` | Run the seed script |
| `eslint`, `eslint-config-next` | Linting |
| `@types/node`, `@types/react`, `@types/react-dom`, `@types/bcryptjs` | Type definitions |

## Scripts

```bash
npm run dev        # development server
npm run build      # production build
npm run start      # serve the production build
npm run lint       # ESLint
npm run db:seed    # seed users, restaurants, and reviews
npm run db:studio  # Prisma Studio
npm run db:reset   # drop, migrate, and seed
```

## Setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and set:
   - `DATABASE_URL` — MySQL connection string
   - `AUTH_SECRET` — random string, for example `openssl rand -base64 32`
3. Apply migrations: `npx prisma migrate dev`
4. Seed sample data: `npm run db:seed`
5. Start the app: `npm run dev`

The seed creates owners `owner1@example.com` through `owner5@example.com` and reviewers `reviewer1@example.com` through `reviewer20@example.com`. Every seeded account uses the password `abcd1234`.

## Pages

| Path | Purpose |
| --- | --- |
| `/` | Restaurant list, filters, and pagination |
| `/restaurants` | Redirects to `/` |
| `/restaurants/new` | Add a restaurant (owner) |
| `/restaurants/[id]` | Restaurant details and reviews |
| `/restaurants/[id]/edit` | Edit a restaurant (owner) |
| `/auth/signin` | Sign in |
| `/auth/register` | Register as owner or reviewer |

`proxy.ts` requires a session for `/restaurants` and `/user`, and sends guests to `/auth/signin`. Signed-in users are sent home if they open an auth page.

## API

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Sign in and set the session cookie |
| GET, POST | `/api/auth/logout` | Clear the session |
| GET | `/api/auth/me` | Current user |
| GET | `/api/restaurants` | List restaurants |
| POST | `/api/user/restaurants` | Create a restaurant |
| PATCH, DELETE | `/api/user/restaurants/[id]` | Update or delete an owned restaurant |
| POST, PATCH, DELETE | `/api/reviews/[id]` | Create, update, or delete a review |
| GET, PATCH | `/api/preferences` | Read or save listing filters |

## Data model

Defined in `prisma/schema.prisma`:

- **User** — email, password hash, name, role (`OWNER` or `REVIEWER`), and saved filter fields.
- **Restaurant** — name, description, location, city, cuisine, optional image, owner, cached `averageRating` and `reviewCount`.
- **Review** — rating, optional comment, reviewer, and restaurant. One review per user per restaurant.

Cuisines are `ITALIAN`, `CHINESE`, `INDIAN`, `MEXICAN`, `JAPANESE`, `THAI`, `FRENCH`, `AMERICAN`, `MEDITERRANEAN`, and `OTHER`. Cities are a fixed list in `server/lib/constants.ts`.

## Directory structure

```
.
├── app/                          # Next.js App Router
│   ├── api/                      # Route Handlers
│   │   ├── auth/                 # register, login, logout, me
│   │   ├── preferences/
│   │   ├── restaurants/
│   │   ├── reviews/[id]/
│   │   └── user/restaurants/     # owner create, update, delete
│   ├── auth/                     # sign-in and register pages
│   ├── components/
│   │   ├── Auth/                 # LoginForm, RegisterForm
│   │   ├── Global/               # Header, Footer, TextInput
│   │   └── Restaurant/           # cards, filters, details, reviews, forms
│   ├── restaurants/              # list redirect, details, new, edit
│   ├── globals.css
│   ├── layout.tsx                # shell: header, main, footer
│   └── page.tsx                  # home listing
├── prisma/
│   ├── migrations/
│   ├── seeds/seed.ts
│   └── schema.prisma
├── public/                       # static assets and uploaded images
├── server/
│   ├── lib/                      # db, auth, permissions, constants, upload
│   ├── services/                 # restaurant, review, auth, preference
│   └── validation/               # Zod schemas
├── src/generated/prisma/         # Prisma client (generated, not committed)
├── tests/permissions.test.ts
├── proxy.ts                      # auth redirects
├── prisma7.config.ts             # Prisma config and seed command
├── next.config.ts
├── tsconfig.json                 # @/* and @server/* path aliases
└── package.json
```

Path aliases: `@/*` is the project root, `@server/*` is `server/`.
