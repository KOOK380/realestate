# Deploying to Vercel

Luxe Estates is Vercel-ready out of the box. It builds clean and deploys with
**zero environment variables required** (runs on seeded mock data by default).

---

## Option A — GitHub (recommended)

1. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/<you>/luxe-estates.git
   git push -u origin main
   ```

2. **Import on Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Pick the `luxe-estates` repo
   - Framework is auto-detected as **Next.js**
   - **Leave all env vars empty** for a zero-config deploy → click **Deploy**

3. Done. Vercel runs `npm install` (which triggers `postinstall` → `prisma generate`)
   then `npm run build`. First deploy is live in ~2–3 minutes.

## Option B — Vercel CLI

```bash
npm i -g vercel
vercel          # preview deploy
vercel --prod   # production deploy
```

---

## What's already configured for Vercel

| Concern | Handled by |
|---|---|
| Prisma client generation | `postinstall: "prisma generate"` + `build: "prisma generate && next build"` |
| Build command | `vercel.json` → `npm run build` |
| Image domains | `next.config.mjs` `remotePatterns` (Unsplash, Pexels, Cloudinary, pravatar) |
| Static asset caching | `vercel.json` headers (immutable for `/_next/static`) |
| Security headers | `vercel.json` (X-Frame-Options, etc.) |
| Secrets | `.gitignore` excludes `.env`; no secrets in the repo |

---

## Optional environment variables

The app runs **without any of these**. Add them only when wiring real services:

| Variable | When you need it |
|---|---|
| `DATA_SOURCE=db` | To read from Prisma instead of mock data |
| `DATABASE_URL` | A Postgres connection string (e.g. Neon, Supabase, Vercel Postgres) |
| `NEXTAUTH_SECRET`, `NEXTAUTH_URL` | Real NextAuth login |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth |
| `CLOUDINARY_*` or `S3_*` | Real image/video uploads |

> **Note on SQLite:** the local dev DB (`file:./dev.db`) does **not** work on
> Vercel (read-only filesystem). For a live database, use Vercel Postgres, Neon,
> or Supabase — set `DATABASE_URL` and change the provider in `prisma/schema.prisma`
> to `postgresql`.

---

## Postgres swap (when you want a real DB)

1. Create a free DB on [Neon](https://neon.tech) or Vercel Postgres
2. In Vercel → Project → Settings → Environment Variables, add:
   ```
   DATA_SOURCE=db
   DATABASE_URL=postgresql://...
   ```
3. In `prisma/schema.prisma` change `provider = "sqlite"` → `"postgresql"`
4. Push + seed:
   ```bash
   npx prisma db push
   npx tsx prisma/seed.ts
   ```
5. Redeploy
