# ARX Stories 2.0 — free hosting + accounts

This is a mobile-first static website with Supabase Auth and a Postgres database. The website is deployable on GitHub Pages; accounts and bookmarks require a free Supabase project. The included sample cards are local demo content until you add published rows to Supabase.

## 1. Publish on GitHub Pages
1. Open your `ArxStories/arx-stories` repository.
2. Upload/replace `index.html`, `style.css`, `app.js`, `config.js`, `schema.sql`, `SETUP.md`, `mascot.png`, and `favicon.svg` at the repository root. Keep filenames exactly as written.
3. Commit changes to the `main` branch.
4. Repository **Settings → Pages**: choose **Deploy from a branch**, `main`, `/(root)`, then Save.
5. Wait for the Pages deployment and open `https://arxstories.github.io/`.

## 2. Create the free database and login system
1. Create a project at https://supabase.com/ (free plan; project may sleep after inactivity depending on current plan rules).
2. In the project, open **Project Settings → API** (or **Connect**) and copy the **Project URL** and **anon/public/publishable key**. Never use the `service_role` or any secret key in website files.
3. Open `config.js` in GitHub, tap the pencil/edit icon, replace:
   - `https://YOUR-PROJECT.supabase.co` with your Project URL
   - `YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY` with the public/anon/publishable key
   Save/commit.
4. Supabase → **SQL Editor → New query**. Paste all of `schema.sql` and run it.
5. Supabase → **Authentication → URL Configuration**:
   - Site URL: `https://arxstories.github.io`
   - Add Redirect URL: `https://arxstories.github.io/**`
6. Under **Authentication → Providers → Email**, keep email/password enabled. For testing, you can turn email confirmation off; for a public site, leave confirmation enabled. With confirmation enabled, users must verify their email before logging in.
7. Reload the website. Sign-up/login should now use Supabase; bookmarks are private per account and sync across devices.

## 3. Make yourself the site owner / admin
1. Sign up on your website with the email you want to use as owner and confirm the email if confirmation is enabled.
2. Supabase → **Authentication → Users**. Copy your user's UUID.
3. Supabase → **SQL Editor**, run this query after replacing the UUID:
   ```sql
   insert into public.site_admins (user_id)
   values ('PASTE-YOUR-USER-UUID-HERE')
   on conflict (user_id) do nothing;
   ```
4. **Publish/edit stories securely:** use Supabase **Table Editor → public.stories**. Add a row and set `published = true` only when it is ready. For `sections`, use JSON like:
   ```json
   [["What happened","First section text."],["What the evidence says","Second section text."]]
   ```
   Use exactly one category: `Real Paranormal Cases`, `Nightmare Fuel`, or `Conspiracy Theories`.
5. The public site only queries published rows. RLS intentionally blocks member accounts from creating or editing stories. The `site_admins` table records the owner role for future server-side admin tools; this static version does not expose a web admin editor because a secure publishing dashboard needs server-side authorization/Edge Functions. Do not fake security by hiding admin buttons in JavaScript.

## 4. Story content and demo mode
- Until Supabase is configured and at least one published story exists, the site shows clearly mixed demo cards so you can preview the design.
- The sample cards are starter/demo copy, not fully researched case files. Verify every real-world claim and add reliable sources before publishing.
- Published database stories replace the demo cards. Add images via public HTTPS image URLs.
- Keep real paranormal claims, allegations, and conspiracy theories clearly attributed and distinguish evidence from speculation. Label fictional horror as fiction.

## Free tier / limitations
- GitHub Pages hosts the static front end for free for a public repository.
- Supabase free tier includes authentication and a database subject to its current quotas, limits, and inactivity policies. Check Supabase's current plan page before launch.
- No paid domain is included; the site uses `arxstories.github.io`.
- This version includes sign-up/login, profile modal, private bookmarks and a database-backed published-story feed. It does not yet include a browser-based admin publishing UI, comments, passwordless login, newsletter, or analytics. The secure no-code owner workflow is Supabase Table Editor. A proper admin editor can be added later with a Supabase Edge Function or other server-side authorization.
- Keep the Supabase public/anon key in `config.js` only with the provided RLS policies enabled. Never publish a service-role key.

## Files
- `index.html` — page structure and account modals
- `style.css` — responsive premium dark design
- `app.js` — filters, story reader, authentication and bookmarks
- `config.js` — public Supabase connection settings
- `schema.sql` — tables and row-level security
- `mascot.png` — provided ARX mascot
- `favicon.svg` — browser tab icon
