# Khalaj Amani Carpets

**Authentic Handmade Afghan Carpets** — Enterprise multi-page website ready for Cloudflare Pages.

## Live Features
- Home, About, Products (15 detailed items + detail pages), Services, Craftsmanship, FAQ, Contact, Privacy, Terms
- Responsive design with logo-derived brand colors (#AB2225 red, #F6EBAA gold, #2F318F navy)
- Floating WhatsApp button + full contact links
- SEO metadata on every page
- Admin panel skeleton at `/admin` (Supabase Auth ready)
- Supabase schema with Realtime support for content management

## 1. Add Your Logo
Place your logo file at:
```
public/logo.jpg
```
(or update all Image `src` references). You will later be able to change it from the Admin panel once Storage is wired.

## 2. Local Development
```bash
npm install
cp .env.example .env.local
# Fill NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

## 3. Supabase Setup
1. Create a project at https://supabase.com
2. Open SQL Editor → paste and run the entire contents of `supabase/schema.sql`
3. Create Storage buckets: `logos`, `heroes`, `products` (public read)
4. Create an admin user under Authentication → Users
5. Copy Project URL + anon key into `.env.local` (and into Cloudflare environment variables)

## 4. Deploy to Cloudflare Pages
1. Go to Cloudflare Dashboard → Pages → Create project → Connect to Git
2. Select the repository `haqaziz-12/amani`
3. Build settings:
   - Framework preset: **Next.js**
   - Build command: `npx @cloudflare/next-on-pages@1` (or the current recommended adapter)
   - Build output directory: `.vercel/output/static` (follow latest Cloudflare Next.js docs)
   - Root directory: `/`
4. Environment variables (add both):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy

> Tip: Check the official Cloudflare docs for “Next.js on Pages” for the exact adapter command at the time you deploy, as it evolves.

## 5. Admin Panel
Visit `/admin` after deployment.  
Replace the placeholder login with real Supabase Auth (`supabase.auth.signInWithPassword`).  
Then implement the CRUD + Storage upload flows using the tables in `supabase/schema.sql`. Changes will appear in real time thanks to Supabase Realtime.

## Contact (seeded)
- Email: khalajamani.ltd@hotmail.com
- Phone / WhatsApp: +93 787 567 967
- Address: ACMEG 1st, Second Floor, Room #24, Jada e Maiwand, Chaman Huzori, Kabul, Afghanistan
- Instagram: https://www.instagram.com/khalajamanicarpets
- Facebook: https://www.facebook.com/share/1C4gJ47quX/

Built for performance, SEO, responsiveness and real-time content control via Supabase.
