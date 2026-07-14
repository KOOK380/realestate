# 🏛️ Luxe Estates

> **Instagram × Airbnb × Apple × Property Finder** — a premium real estate platform where users discover homes through beautiful video, immersive tours and curated collections.

A production-ready Next.js 15 application built with a luxury design system, a flagship vertical **Reels** experience, advanced filtering, investment tooling, and a full admin dashboard shell.

---

## ✨ Highlights

- 🎥 **Property Reels** — Instagram-style full-screen vertical feed with autoplay-on-view, swipe gestures, like/comment/share/save/report, follow builder, and instant property deep-links.
- 🏠 **Home** — video hero, animated multi-tab search, trending, villas, apartments, plots, investment opportunities, featured, builders, cities, testimonials, blogs.
- 🔍 **Buy / Rent / Invest** — listing grids with an advanced filter sidebar (location, budget slider, beds/baths, furnishing, verified, luxury, trending, ready-to-move), sort, grid/list layouts, skeletons & empty states.
- 📄 **Property Details** — luxury gallery + video + 360° tour, OpenStreetMap embed & nearby places, amenities, floor plans, investment score, EMI calculator, brochure, site-visit booking, WhatsApp/Call/Share/Save.
- 💰 **Invest Hub** — ROI calculator modelling rental yield + appreciation over time.
- 🔎 **Command-K Search** — autocomplete, recent & popular searches, voice-search UI, quick links to cities & types.
- 👤 **Account** — profile, saved, recently-viewed, appointments, messages, notifications, settings (dark mode, notifications) — all client-persisted.
- 🛠️ **Admin** — dashboard with charts (recharts), full sidebar nav, properties table; remaining CRM modules scaffolded.
- 📱 **Mobile-first** — glassmorphic bottom navigation with a **floating Reels button**, large touch targets, safe-area aware.
- 🎨 **Design system** — Poppins + Inter, luxury palette (`#2563EB` / `#0F172A` / `#14B8A6` / `#F59E0B`), glassmorphism, soft shadows, Framer Motion throughout, dark mode.
- ⚡ **Performance** — static prerendering, image optimization, code-splitting.

---

## 🚀 Quick start

```bash
npm install
npm run dev          # → http://localhost:3000
```

That's it. **No database, no API keys required** — the app runs on a rich seeded in-memory dataset.

### Optional: real database

```bash
npm run db:setup     # prisma generate + db push + seed (SQLite)
```

Then set `DATA_SOURCE=db` in `.env` to read from Prisma instead of mock data.

---

## 🧱 Tech stack

| Layer | Tech |
|------|------|
| Framework | **Next.js 15** (App Router) + **React 19** + **TypeScript** (strict) |
| Styling | **Tailwind CSS** + custom design tokens, **shadcn/ui**-style primitives |
| Motion | **Framer Motion** + **GSAP** |
| Forms | **react-hook-form** + **zod** |
| State | **zustand** (persisted client store for saved/recently-viewed/session) |
| Data | **Prisma** + **SQLite** (PostgreSQL-ready schema) |
| Charts | **recharts** |
| Fonts | **Poppins** (display) + **Inter** (body) via `next/font` |

---

## 📁 Project structure

```
src/
├── app/
│   ├── (public pages)/   home, buy, rent, invest, property/[slug], reels, search, blog/[slug]
│   ├── account/          profile, saved, recently-viewed, appointments, settings…
│   ├── admin/            dashboard + 16 modules
│   ├── layout.tsx        root layout (fonts, providers, chrome)
│   └── globals.css
├── components/
│   ├── layout/           site-header, mobile-nav, site-footer, public-chrome
│   ├── home/             hero + all home sections
│   ├── property/         card, gallery, emi-calculator, listing, invest-hero, actions, book-visit
│   ├── reels/            reel-feed (flagship)
│   ├── search/           command palette
│   ├── account/          saved/recently-viewed grids
│   ├── admin/            properties-table, coming-soon
│   ├── shared/           section-heading, card-carousel, empty-state
│   └── ui/               button, card, dialog, sheet, select, slider, tabs, badge…
├── lib/
│   ├── data/             types + mock dataset + Prisma swap-point (index.ts)
│   ├── store/            zustand user + session stores
│   ├── constants.ts
│   └── utils.ts
prisma/
├── schema.prisma         full schema (SQLite-compatible, Postgres-ready)
└── seed.ts
```

### 🔌 Data layer — the swap point

`src/lib/data/index.ts` exposes async accessors (`getProperties`, `getPropertyBySlug`, `getReels`, …) that read from the **mock dataset by default**. Set `DATA_SOURCE=db` and run `npm run db:setup` to read identical data from Prisma. Components never import mock data directly (except the client account grids, which resolve saved IDs), so swapping sources touches one file.

---

## 🔐 Environment

Copy `.env.example` → `.env`. The app runs **without any of these**; they unlock real integrations later:

- `DATA_SOURCE` — `mock` (default) | `db`
- `DATABASE_URL` — SQLite path or Postgres URL
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GOOGLE_CLIENT_ID/SECRET`
- `STORAGE_PROVIDER` — `local` | `cloudinary` | `s3` (+ keys)
- `TWILIO_*`, `RESEND_API_KEY` — WhatsApp/SMS/email

Auth currently uses a **mock session provider** (localStorage) so login state works with zero keys — the Google/OTP/email UI is fully built and the NextAuth config is documented for the backend phase.

---

## 🗺️ Roadmap (next phase)

This build is the **polished frontend MVP** with a complete schema and admin shell. Explicitly deferred:

- Real backend persistence wiring for every entity (schema + seed are ready)
- Admin CRUD forms, lead CRM, appointment workflow
- Real Google OAuth, Cloudinary/S3 uploads, WhatsApp/email/SMS, payments

Every deferred piece has an env-ready seam so nothing blocks running today.

---

## 📄 License

MIT — built as a demonstration of a premium, production-grade real estate UX.
