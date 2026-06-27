# KL TRADERS

Next.js 16 website for KL TRADERS with Supabase-backed inquiries, admin dashboard, quote uploads, invoice uploads, and Netlify deployment configuration.

## Stack

- Next.js 16.2.9
- React 19
- TypeScript
- Tailwind CSS v4
- Supabase Database, Storage, and Auth
- Netlify with `@netlify/plugin-nextjs`

## Security

Admin pages and admin API routes are protected by Supabase Auth:

- `/admin`
- `/admin/inquiries`
- `/admin/inquiries/[id]`
- `/admin/quotes`
- `/admin/invoices`
- `/api/admin/*`

Unauthenticated users are redirected to `/admin/login`. Admin API requests without a valid Supabase Auth session return `401`.

`SUPABASE_SERVICE_ROLE_KEY` is used only by server-side code in Next.js Server Components and Route Handlers. Never prefix it with `NEXT_PUBLIC_`.

## Environment Variables

Create `.env.local` for local development and add the same keys in Netlify:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Supabase Setup

1. Create a Supabase project.
2. Open SQL Editor.
3. Run the full contents of `supabase/schema.sql`.
4. Confirm these tables exist:
   - `customers`
   - `inquiries`
   - `quotes`
   - `invoices`
5. Confirm these storage buckets exist:
   - `invoices`
   - `quotes`
   - `product-images`
   - `certificates`
6. In Authentication > Providers, keep Email enabled.
7. In Authentication > Users, create the first admin user manually:
   - Click Add user.
   - Enter the admin email and a strong password.
   - Confirm the user if your project requires confirmation.
8. Disable public signups unless you intentionally want more Auth users. The app does not expose a signup page.

## Local Development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000/admin/login` and sign in with the Supabase Auth user created above.

## Build

```bash
npm run build
```

## Netlify Deployment

`netlify.toml` is configured with:

- Build command: `npm run build`
- Publish directory: `.next`
- Plugin: `@netlify/plugin-nextjs`
- Node version: `20`

Before deploying, add these environment variables in Netlify Site configuration:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

After deployment:

1. Visit `/admin`.
2. Confirm you are redirected to `/admin/login`.
3. Sign in with the Supabase Auth admin user.
4. Confirm `/admin`, inquiries, quotes, invoices, upload, and download flows work.

## Project Structure

```text
app/
  admin/
    login/page.tsx
    (protected)/
      layout.tsx
      page.tsx
      inquiries/
      quotes/
      invoices/
  api/
    inquiries/route.ts
    admin/
components/
  admin/
lib/
  supabase/
    admin.ts
    client.ts
    server.ts
supabase/
  schema.sql
proxy.ts
netlify.toml
```
