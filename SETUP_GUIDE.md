# Setup guide (for Claude to walk Jason through)

## Instructions for Claude

You are guiding Jason through setting up this portfolio site: running it locally, pushing it to GitHub, and deploying it on Vercel. He already has Vercel and Supabase accounts. He is an experienced front-end developer, so skip basic explanations, but don't assume he knows Supabase or Vercel settings by heart.

How to guide:
- Go **one step at a time**. Give the step, then wait for him to say it worked (or paste an error) before moving on.
- Before starting, ask where he is (fresh start, or partway through) and skip what's done.
- When you can run commands yourself (for example, in Claude Code), offer to run the terminal steps for him, but let him do anything in a browser (Supabase, GitHub, Vercel dashboards) and tell him exactly what to click.
- **Never ask him to paste his Supabase keys into the chat.** He should paste them into `.env.local` himself. If you are editing files for him, only write the placeholders and have him fill in the values.
- If a dashboard label doesn't match what's written here, help him find the current equivalent. These dashboards change.
- When something fails, use the Troubleshooting section at the end before guessing.

Project facts you need:
- Next.js (App Router) + Supabase via `@supabase/supabase-js`. No other services.
- Personal details, links, experience and skills: `src/config/site.ts`.
- Styles and color tokens: `src/app/globals.css`.
- Database, storage and security setup: `supabase/schema.sql`. The security rules allow only `jason.s.hornbuckle@gmail.com` to edit projects.
- The admin editor is at `/admin`. It uses email and password sign-in.
- Environment variables (in `.env.local` locally, and in Vercel): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- The resume files are in `public/`.

---

## Phase 1: Run it locally

### Step 1. Check tools
Run `node -v` (needs 20 or newer) and `git --version`. If Node is missing or old, have him install the LTS version from nodejs.org.

### Step 2. Install dependencies
In the `portfolio` folder, run `npm install`.

### Step 3. Create the Supabase project
In the Supabase dashboard, have him create a new project (any name, for example `portfolio`). Wait until it finishes provisioning.

### Step 4. Run the database script
1. Ask which email he'll use to sign in to `/admin`. If it isn't `jason.s.hornbuckle@gmail.com`, replace every occurrence in `supabase/schema.sql` first.
2. In Supabase, go to **SQL Editor → New query**. He pastes in the whole `supabase/schema.sql` and clicks **Run**.
3. The result should be "Success. No rows returned."
4. To confirm: **Table Editor** should show a `projects` table, and **Storage** should show a `screenshots` bucket.

### Step 5. Create his admin login
1. Go to **Authentication → Users → Add user → Create new user**.
2. He enters the same email as in step 4, plus a password, and ticks **Auto confirm user**.
3. Then, in the **Authentication** settings (sign-in or providers page), turn off **Allow new users to sign up**.

### Step 6. Add the environment variables
1. Run `cp .env.local.example .env.local`.
2. In Supabase, go to **Project Settings → API** (or **API Keys**). He copies the **Project URL** and the **anon public** key into `.env.local`.
   - Newer projects may show a "publishable" key (`sb_publishable_...`). That works too.
   - He must **not** use the `service_role` or secret key.

### Step 7. Start the site
1. Run `npm run dev`, then have him open http://localhost:3000.
2. He should see the site with an empty-state message in the Work section. That's expected, because there are no projects yet.

### Step 8. Test the admin page
1. Have him open http://localhost:3000/admin, sign in, and add a test project with at least one screenshot.
2. Back on the home page, refresh. In dev mode, the project should appear right away.
3. He can delete the test project afterwards, or keep it hidden by unticking **Show on the site**.

### Step 9. Personalize
In `src/config/site.ts`, have him set `links.github` to his real GitHub profile URL, and review the intro text and experience entries. Changes appear on save while dev mode is running.

---

## Phase 2: Put it on GitHub

### Step 10. Create the repository
On github.com, he creates a new repository (for example `portfolio`). It can be public or private. He must leave it **empty**: no README, no .gitignore and no license, or the first push will conflict.

### Step 11. Push the code
From the `portfolio` folder, replacing `YOUR-USERNAME`:
```bash
git init
git add .
git commit -m "Initial portfolio site"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/portfolio.git
git push -u origin main
```
Before he pushes, confirm `.env.local` is not staged: `git status` should not list it. It's covered by `.gitignore`.

---

## Phase 3: Deploy on Vercel

### Step 12. Import the project
1. In Vercel, go to **Add New → Project**. He imports the `portfolio` repo. If it isn't listed, he needs to give Vercel's GitHub app access to that repo.
2. The framework should be detected as **Next.js**. Leave the build settings at their defaults.

### Step 13. Add the environment variables
Under **Environment Variables**, he adds `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`, with the same values as in `.env.local`.

### Step 14. Deploy and check
1. He clicks **Deploy** and waits for it to finish.
2. Then he opens the live URL and checks three things:
   - the home page loads,
   - the resume downloads,
   - `/admin` sign-in works.
3. A project added on the live `/admin` page appears on the home page within about a minute, because the page refreshes every 60 seconds.

### Step 15. Wrap up
- From now on, every `git push` to `main` redeploys automatically.
- Optional: add a custom domain under **Vercel project → Settings → Domains**.
- Optional: in Supabase, go to **Authentication → URL Configuration** and set **Site URL** to the live address. Password sign-in doesn't need this, but it keeps any Supabase emails pointing at the right place.

---

## Troubleshooting

- **Admin says "Supabase isn't connected yet":** `.env.local` is missing or misnamed, or the dev server wasn't restarted after editing it. On Vercel, the environment variables are missing; add them, then redeploy.
- **Sign-in fails with "Invalid login credentials":** the user wasn't created, wasn't auto-confirmed, or the password is wrong. Check **Authentication → Users**.
- **Save fails with "new row violates row-level security policy":** the signed-in email doesn't match the email in `schema.sql`. Fix the email in the script and run it again (it's safe to re-run).
- **Screenshot upload fails:** the `screenshots` bucket is missing, or the email doesn't match. Re-run `schema.sql`.
- **Error mentioning relation `projects` does not exist:** the SQL script wasn't run against this project.
- **Vercel build fails:** read the build log. Run `npm run build` locally to reproduce the error, and fix it there first.
- **A new project doesn't show on the live site:** wait 60 seconds and refresh. Also check that **Show on the site** is ticked.
- **The first `git push` is rejected:** the GitHub repo wasn't empty. Run `git pull origin main --allow-unrelated-histories`, then push again.
