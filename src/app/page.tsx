"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Award, Hand, Globe, Heart, Loader2 } from "lucide-react";
import { products as staticProducts } from "@/data/products";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { supabase } from "@/lib/supabase";

type FeaturedProduct = {
  id: string;
  slug: string;
  name: string;
  size: string | null;
  collection: string | null;
  price_note: string | null;
  image_front: string | null;
};

export default function HomePage() {
  const { logo_url, hero_image_url } = useSiteSettings();
  const logoSrc = logo_url || "/logo.svg";
  const [featured, setFeatured] = useState<FeaturedProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("products")
        .select("id, slug, name, size, collection, price_note, image_front")
        .eq("is_published", true)
        .order("sort_order", { ascending: true })
        .limit(6);

      if (data && data.length > 0) {
        setFeatured(data as FeaturedProduct[]);
      } else {
        setFeatured(
          staticProducts.slice(0, 6).map((p) => ({
            id: p.id,
            slug: p.slug,
            name: p.name,
            size: p.size,
            collection: p.collection,
            price_note: p.priceNote,
            image_front: null,
          }))
        );
      }
      setLoadingProducts(false);
    };
    load();
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-brand-dark">
        <div className="absolute inset-0">
          {hero_image_url ? (
            <Image
              src={hero_image_url}
              alt=""
              fill
              className="object-cover opacity-40"
              priority
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 opacity-20">
              <Image src="/logo.svg" alt="" fill className="object-cover scale-150 blur-sm" priority />
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/80 via-brand-dark/60 to-brand-dark/90" />

        <div className="relative z-10 container-wide text-center px-4 py-20">
          <div className="inline-flex items-center justify-center mb-8">
            <Image
              src={logoSrc}
              alt="Khalaj Amani Carpets Logo"
              width={140}
              height={140}
              className="rounded-full border-4 border-brand-gold shadow-2xl bg-white"
              priority
              unoptimized={!!logo_url}
            />
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-4">
            Khalaj Amani
            <span className="block text-brand-gold text-3xl sm:text-4xl md:text-5xl mt-2 font-medium">
              Carpets
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/85 mb-10 leading-relaxed">
            Authentic handmade Afghan carpets from the heart of Kabul.
            Generations of craftsmanship woven into every knot.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products/"
              className="inline-flex items-center justify-center gap-2 bg-brand-red text-white font-semibold px-8 py-4 rounded-full hover:bg-brand-red-dark transition-colors text-lg"
            >
              Explore Collection
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact/"
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-brand-gold text-brand-gold font-semibold px-8 py-4 rounded-full hover:bg-brand-gold hover:text-brand-dark transition-colors text-lg"
            >
              Request Enquiry
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-brand-gold/30 border-y border-brand-gold/50">
        <div className="container-wide py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: Hand, label: "100% Handmade", sub: "In Kabul Workshops" },
            { icon: Award, label: "Master Weavers", sub: "Generational Skill" },
            { icon: Globe, label: "Worldwide Shipping", sub: "Secure & Insured" },
            { icon: Heart, label: "Natural Materials", sub: "Wool • Silk • Dyes" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-2">
              <item.icon className="w-8 h-8 text-brand-red" />
              <span className="font-semibold text-brand-dark">{item.label}</span>
              <span className="text-sm text-brand-muted">{item.sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="section-padding bg-background">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark mb-3">
              Featured Carpets
            </h2>
            <p className="text-brand-muted max-w-2xl mx-auto">
              A selection of our finest hand-knotted pieces. Every carpet is unique –
              enquire for current availability, exact measurements and pricing.
            </p>
          </div>

          {loadingProducts ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featured.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}/`}
                  className="group bg-white rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="aspect-[4/3] relative bg-muted overflow-hidden flex items-center justify-center">
                    {product.image_front ? (
                      <Image
                        src={product.image_front}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        unoptimized
                      />
                    ) : (
                      <Image
                        src="/logo.svg"
                        alt=""
                        width={80}
                        height={80}
                        className="opacity-30 group-hover:scale-110 transition-transform duration-500"
                      />
                    )}
                    {product.collection && (
                      <span className="absolute top-3 left-3 bg-brand-red text-white text-xs font-medium px-3 py-1 rounded-full">
                        {product.collection}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-lg font-semibold text-brand-dark group-hover:text-brand-red transition-colors mb-1">
                      {product.name}
                    </h3>
                    {product.size && <p className="text-sm text-brand-muted mb-2">{product.size}</p>}
                    <p className="text-sm text-brand-red font-medium">{product.price_note || "Price on Enquiry"}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/products/" className="inline-flex items-center gap-2 text-brand-red font-semibold hover:underline">
              View All Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* About Teaser */}
      <section className="section-padding bg-brand-dark text-white">
        <div className="container-wide grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
              Crafted in Kabul,<br />
              <span className="text-brand-gold">Cherished Worldwide</span>
            </h2>
            <p className="text-white/80 leading-relaxed mb-6">
              Khalaj Amani Carpets is a family-rooted handmade carpet production house based in
              the historic Chaman Huzori district of Kabul. We specialize in authentic Afghan
              hand-knotted carpets using traditional techniques, natural materials, and designs
              that honor centuries of weaving heritage.
            </p>
            <Link
              href="/about/"
              className="inline-flex items-center gap-2 bg-brand-gold text-brand-dark font-semibold px-6 py-3 rounded-full hover:bg-brand-gold/90 transition-colors"
            >
              Our Story
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="relative aspect-square max-w-md mx-auto">
            <div className="absolute inset-4 rounded-full border-2 border-brand-gold/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src={logoSrc}
                alt="Khalaj Amani Carpets"
                width={280}
                height={280}
                className="rounded-full shadow-2xl bg-white"
                unoptimized={!!logo_url}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-background">
        <div className="container-narrow text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark mb-4">
            Ready to Find Your Carpet?
          </h2>
          <p className="text-brand-muted mb-8 max-w-xl mx-auto">
            Whether you seek a traditional masterpiece, a contemporary piece, or a fully
            bespoke commission, our team is ready to assist you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/93787567967"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
            >
              Chat on WhatsApp
            </a>
            <Link
              href="/contact/"
              className="inline-flex items-center justify-center gap-2 bg-brand-red text-white font-semibold px-8 py-4 rounded-full hover:bg-brand-red-dark transition-colors"
            >
              Send Enquiry
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
