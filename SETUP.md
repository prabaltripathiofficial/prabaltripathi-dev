# prabaltripathi.dev — setup

Personal site (design mirrors mitchellh.com). Next.js 14 + Tailwind.

## Sections

- **About / Writing / Updates / Misc** — public.
- **/login** + **/admin** — private. Only the owner (who knows `ADMIN_PASSWORD`) can post.
  - `/admin/editor` — write articles (GitHub-flavored markdown editor + live preview).
  - `/admin/updates` — post daily updates (mood + text).

## Storage

A single storage layer (`lib/store.ts`) with two drivers, chosen automatically:

- **Production (Vercel):** Postgres — used when `POSTGRES_URL` is set.
- **Local dev:** files — `content/writing/*.md` and `content/updates.json`.

Tables (`articles`, `updates`) are created automatically on first query.

## Local development

```bash
npm install
npm run dev          # http://localhost:3001  (PORT=3001 npm run dev)
```

`.env.local` (gitignored) holds local secrets:

```
ADMIN_PASSWORD=prabal
AUTH_SECRET=<random hex>
```

Log in at `/login` with that password.

## Deploying to Vercel

1. **Provision Postgres:** Vercel dashboard → your project → **Storage** → create a
   Postgres database and connect it. This injects `POSTGRES_URL` automatically.
2. **Add environment variables** (Settings → Environment Variables):
   - `ADMIN_PASSWORD` — the password you'll use to log in.
   - `AUTH_SECRET` — any long random string (e.g. `openssl rand -hex 32`).
3. **Deploy.** Tables auto-create on first use. Visit `/login`, sign in, and post.

> Production starts with an empty database — the local `content/` seed files
> (hello-world article, sample updates) are dev-only. Post your real content
> from `/admin` once deployed.
