-- Khalaj Amani Carpets - Supabase Schema
-- Run this in Supabase SQL Editor

-- Enable UUID
create extension if not exists "uuid-ossp";

-- Site settings (logo, hero, contact)
create table if not exists site_settings (
  id uuid primary key default uuid_generate_v4(),
  logo_url text,
  hero_image_url text,
  hero_video_url text,
  company_name text default 'Khalaj Amani Carpets',
  email text default 'khalajamani.ltd@hotmail.com',
  phone text default '+93 787 567 967',
  whatsapp text default '93787567967',
  address text default 'ACMEG 1st, Second Floor, Room #24, Jada e Maiwand, Chaman Huzori, Kabul, Afghanistan',
  instagram_url text default 'https://www.instagram.com/khalajamanicarpets',
  facebook_url text default 'https://www.facebook.com/share/1C4gJ47quX/',
  updated_at timestamptz default now()
);

-- About page content
create table if not exists about_content (
  id uuid primary key default uuid_generate_v4(),
  title text,
  subtitle text,
  body text, -- markdown or HTML
  updated_at timestamptz default now()
);

-- Services content
create table if not exists services_content (
  id uuid primary key default uuid_generate_v4(),
  title text,
  body text,
  updated_at timestamptz default now()
);

-- Craftsmanship content
create table if not exists craftsmanship_content (
  id uuid primary key default uuid_generate_v4(),
  title text,
  body text,
  updated_at timestamptz default now()
);

-- FAQ
create table if not exists faqs (
  id uuid primary key default uuid_generate_v4(),
  question text not null,
  answer text not null,
  sort_order int default 0,
  is_published boolean default true,
  created_at timestamptz default now()
);

-- Products
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  size text,
  quality text,
  materials text,
  description text,
  washing_type text,
  collection text,
  price_note text default 'Price on Enquiry',
  image_front text,
  image_back text,
  image_detail text,
  is_published boolean default true,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Realtime
alter publication supabase_realtime add table site_settings;
alter publication supabase_realtime add table about_content;
alter publication supabase_realtime add table services_content;
alter publication supabase_realtime add table craftsmanship_content;
alter publication supabase_realtime add table faqs;
alter publication supabase_realtime add table products;

-- Storage buckets (run in Storage or via dashboard)
-- Create buckets: logos, products, heroes with public read

-- RLS policies (basic - tighten for production)
alter table site_settings enable row level security;
alter table about_content enable row level security;
alter table services_content enable row level security;
alter table craftsmanship_content enable row level security;
alter table faqs enable row level security;
alter table products enable row level security;

-- Public read
create policy "Public read site_settings" on site_settings for select using (true);
create policy "Public read about" on about_content for select using (true);
create policy "Public read services" on services_content for select using (true);
create policy "Public read craftsmanship" on craftsmanship_content for select using (true);
create policy "Public read faqs" on faqs for select using (is_published = true);
create policy "Public read products" on products for select using (is_published = true);

-- Authenticated full access (for admin)
create policy "Admin all site_settings" on site_settings for all using (auth.role() = 'authenticated');
create policy "Admin all about" on about_content for all using (auth.role() = 'authenticated');
create policy "Admin all services" on services_content for all using (auth.role() = 'authenticated');
create policy "Admin all craftsmanship" on craftsmanship_content for all using (auth.role() = 'authenticated');
create policy "Admin all faqs" on faqs for all using (auth.role() = 'authenticated');
create policy "Admin all products" on products for all using (auth.role() = 'authenticated');
