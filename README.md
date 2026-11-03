# Jason Hornbuckle — portfolio

> Want Claude to walk you through setup? Tell it: "Read SETUP_GUIDE.md and guide me through it."

Next.js (App Router) + Supabase. Public site at `/`, project pages at `/projects/<slug>`, and a private editor at `/admin` for adding projects and screenshots.

## Where things live

| Want to change… | Edit |
|---|---|
| Name, intro, email, LinkedIn/GitHub links | `src/config/site.ts` (`site`) |
| Experience timeline and roles | `src/config/site.ts` (`experience`) |
| Skills list | `src/config/site.ts` (`skills`) |
| Colors, fonts, spacing | tokens at the top of `src/app/globals.css` |
| Resume | replace the files in `public/` (keep the same names, or update `site.resume`) |
| Portfolio projects | the `/admin` page — no code needed |

**First thing to do:** put your real GitHub URL in `src/config/site.ts` (`links.github`).

## 1. Set up Supabase (about 10 minutes, free tier is fine)

1. Create a project at https://supabase.com.
2. **SQL Editor → New query**, paste all of `supabase/schema.sql`, click **Run**. This creates the `projects` table, a public `screenshots` storage bucket, and security rules so only your email can make changes.
3. **Authentication → Users → Add user → Create new user**: enter `jason.s.hornbuckle@gmail.com` and a password, and tick *Auto confirm user*. This is your admin login.
4. **Authentication → Sign In / Providers**: turn **off** *Allow new users to sign up*, so nobody else can create an account.
5. **Project Settings → API**: copy the *Project URL* and the *anon public* key.

## 2. Run it locally

```bash
cp .env.local.example .env.local   # paste the URL and anon key into it
npm install
npm run dev
```

Open http://localhost:3000, then http://localhost:3000/admin to sign in and add your first project.

## 3. Deploy (Vercel, free)

1. Push this folder to a GitHub repo.
2. At https://vercel.com, **Add New → Project**, import the repo.
3. Add the two environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) and deploy.
4. Optional: add your own domain under **Settings → Domains**.

## Adding a project

Go to `/admin` → **Add project**, then fill in:

- **Title** and **Short summary**, shown on the home page card.
- **Full description**, shown on the project's own page. Leave a blank line between paragraphs.
- **Live app link**: the screenshots and the "Open the app" button link here.
- **Code link** (optional), **Built with** tags, and **Order** (lower numbers show first).
- **Screenshots**: upload one or more. The first screenshot is the card cover, and you can reorder them with Earlier/Later. Wide screenshots (16:10, e.g. 1600×1000) look best.

Untick **Show on the site** to keep a project as a hidden draft. New projects appear on the live site within about a minute.
