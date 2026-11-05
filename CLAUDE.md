# Portfolio site

Next.js + Supabase portfolio for Jason Hornbuckle.

## Status (setup finished November 2026)

- Live at https://www.jasonhornbuckle.com (`jasonhornbuckle.com` redirects to `www`). The domain is registered at Squarespace, and its DNS points to Vercel.
- Code: https://github.com/ORIGINALUSRNM/portfolio. Every push to `main` auto-deploys on Vercel in about 30 seconds.
- Supabase (free plan) holds projects and screenshots. The admin editor is at `/admin`. The free plan pauses after about 7 days without visits.
- Supabase variables are in `.env.local` locally and in Vercel. The code accepts `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Run locally with `npm run dev`, then open http://localhost:3000.

`SETUP_GUIDE.md` covers first-time setup and troubleshooting. Use it only if something needs to be set up again.

Possible next steps: use `next/image` for the hero photo, and add a daily Vercel cron that queries Supabase so it never pauses.

## Key files

- `src/config/site.ts`: personal content.
- `src/app/globals.css`: design tokens.
- `src/components/Hero.tsx`: intro section, including the photo in `public/jason-hornbuckle.jpg`.
- `supabase/schema.sql`: database.
- `src/app/admin/page.tsx`: project editor.
