# Ajuni Foundation — Royal Palms Street Animal Network

A production-ready full-stack web platform for Ajuni Foundation, a street animal welfare trust operating in Royal Palms, Aarey Colony, Mumbai.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS + shadcn/ui primitives |
| Animations | Framer Motion |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth.js (Google OAuth + Credentials) |
| Maps | React-Leaflet (CartoDB Dark Matter tiles) |
| Payments | Razorpay |
| Images | Cloudinary |

## Design System

- **Background:** `#0a0a0a`
- **Card background:** `#0f172a`/70 with `backdrop-blur-xl`
- **Primary accent:** `#0047AB` (logo blue)
- **Secondary accent:** `#3B82F6`
- **Warm accent:** `#F5E6C8`
- **Status colors:** teal (healthy), blue (adoptable), rose (urgent), amber (watching), purple (recovering)
- **Fonts:** `Poppins` (headings), `Inter` (body)

## Getting Started

### 1. Prerequisites

- Node.js 18+
- PostgreSQL database (local or cloud e.g. Neon, Supabase)
- Google OAuth credentials (optional, for resident sign-in)
- Razorpay account (optional, for real payments)
- Cloudinary account (optional, for image uploads)

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

```env
DATABASE_URL="postgresql://username:password@localhost:5432/ajuni_foundation?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
RAZORPAY_KEY_ID=""
RAZORPAY_KEY_SECRET=""
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

### 4. Set up the database

```bash
npx prisma migrate dev --name init
npm run db:seed
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 6. Admin access

Use the credentials login (Google OAuth can be configured separately):

- **Email:** `admin@ajunifoundation.in`
- **Password:** `admin123`

## Project Structure

```
ajuni-foundation/
├── app/                 # Next.js App Router
│   ├── api/             # API routes
│   ├── admin/           # Admin dashboard (protected)
│   ├── feeders/         # Feeder dashboard (protected)
│   ├── animal/[id]/     # Animal profile page
│   ├── page.tsx         # Homepage
│   └── layout.tsx       # Root layout
├── components/          # React components
├── hooks/               # Custom hooks
├── lib/                 # Utilities, Prisma, Auth
├── prisma/              # Prisma schema & seed
├── types/               # TypeScript types
└── public/              # Static assets
```

## Key Features

- **Homepage:** Hero, live map, animal residents, rescue missions, adoption quiz, feeder leaderboard.
- **Animal Profiles:** Full bio, health timeline, care team, sponsor/adopt CTAs.
- **Feeder Dashboard:** Route schedule, feeding log with photo upload and geolocation.
- **Admin Dashboard:** Animal/mission management, feeder verification, financial CSV export.
- **Payments:** Razorpay integration for one-time and monthly donations.
- **Maps:** Free dark-themed Leaflet map with zone markers and popups.

## Demo Deployment

You can deploy the site to Vercel immediately without setting up PostgreSQL by enabling demo mode.

1. Fork / clone the repository and import it into Vercel.
2. In the Vercel project settings, add these environment variables:

```env
DEMO_MODE=true
NEXTAUTH_URL=https://your-vercel-url.vercel.app
NEXTAUTH_SECRET=any-random-string-for-demo-preview
```

3. You do **not** need `DATABASE_URL`, `GOOGLE_CLIENT_ID`, `RAZORPAY_KEY_ID`, or `CLOUDINARY_*` keys for the demo.
4. Deploy. The site will load with realistic mock animals, missions, feeder logs, and leaderboard data.

Use the admin credentials to preview the trust dashboard:

- **Email:** `admin@ajunifoundation.in`
- **Password:** `admin123`

> **Note:** Demo mode is for client previews only. Data changes (create, update, delete, donations, adoptions) return success responses but are not persisted.

## Deployment

Recommended platforms:

- **Frontend:** Vercel
- **Database:** Neon PostgreSQL
- **Images:** Cloudinary
- **Payments:** Razorpay (live keys for production)

## Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # Run ESLint
npm run db:migrate   # Run Prisma migrations
npm run db:seed      # Seed the database
npm run db:studio    # Open Prisma Studio
```

## Notes

- The app uses **dark mode only**.
- Maps work without API keys using free CartoDB tiles.
- Razorpay and Cloudinary are optional for local development; the app degrades gracefully with mock data when keys are missing.
