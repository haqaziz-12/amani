# Khalaj Amani Carpets

**Authentic Handmade Afghan Carpets** — Enterprise multi-page website.

## Tech Stack
- Next.js 15 (App Router) + TypeScript + Tailwind CSS v4
- Supabase (Auth + Database + Storage + Realtime) for Admin CMS
- Deploy target: **Cloudflare Pages**
- Icons: Lucide React

## Quick Start

1. Clone the repo
2. `npm install`
3. Create a Supabase project at https://supabase.com
4. Copy `.env.example` → `.env.local` and fill keys
5. Run the SQL in `supabase/schema.sql` in Supabase SQL Editor
6. `npm run dev`

## Cloudflare Pages Deploy

1. Connect this GitHub repo to Cloudflare Pages
2. Build command: `npx @cloudflare/next-on-pages` or use the official Next.js on Pages adapter
3. Framework preset: Next.js
4. Environment variables: add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. For full Admin + image uploads you will also need the service role key (server-side only)

## Features Implemented / Planned
- Fully responsive design using logo-derived colors (#AB2225 red, #F6EBAA gold, #2F318F navy)
- Pages: Home, About, Products (15 items), Services, Craftsmanship, FAQ, Contact, Privacy, Terms
- Admin panel (password protected via Supabase Auth) for real-time content editing
- Product management with 3 images each (front / back / detail)
- SEO optimized metadata, Open Graph, structured data ready
- WhatsApp floating button + all contact links

## Admin Access
After setting up Supabase Auth, create an admin user in Authentication → Users.
Then visit `/admin`.

## Contact Info (seeded)
- Email: khalajamani.ltd@hotmail.com
- Phone / WhatsApp: +93 787 567 967
- Address: ACMEG 1st, Second Floor, Room #24, Jada e Maiwand, Chaman Huzori, Kabul, Afghanistan
- Instagram: https://www.instagram.com/khalajamanicarpets
- Facebook: https://www.facebook.com/share/1C4gJ47quX/

Built for performance, SEO and real-time content control.
