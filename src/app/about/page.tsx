"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const DEFAULT_TITLE = "About Khalaj Amani Carpets";
const DEFAULT_SUBTITLE = "Weaving heritage, one knot at a time, from the heart of Kabul.";
const DEFAULT_BODY = `Khalaj Amani Carpets is a handmade carpet production company based in the historic Chaman Huzori area of Kabul, Afghanistan. Located at ACMEG 1st, Second Floor, Room #24 on Jada e Maiwand, our workshop sits in a district long associated with craft, trade, and the enduring spirit of Afghan artistry.

We specialize exclusively in authentic hand-knotted and handwoven carpets produced by skilled Afghan weavers. Every piece that leaves our workshop is the result of traditional techniques, natural materials, and the patient dedication of artisans whose knowledge has been passed down through families for generations.

Our name — Khalaj Amani — reflects both heritage and aspiration: the Khalaj cultural lineage and the word "Amani," which carries meanings of peace, safety, and lasting value. We aim to create carpets that bring beauty and lasting quality into homes around the world.`;

function renderBody(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      elements.push(<div key={key++} className="h-3" />);
      continue;
    }
    if (trimmed.startsWith("## ")) {
      elements.push(
        <h2 key={key++} className="font-serif text-2xl md:text-3xl font-bold text-brand-dark mt-10 mb-4">
          {trimmed.replace(/^##\s+/, "")}
        </h2>
      );
    } else if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
      elements.push(
        <h3 key={key++} className="font-serif text-xl font-semibold text-brand-dark mt-6 mb-2">
          {trimmed.replace(/\*\*/g, "")}
        </h3>
      );
    } else {
      elements.push(
        <p key={key++} className="text-brand-muted leading-relaxed mb-3">
          {trimmed.replace(/\*\*(.+?)\*\*/g, "$1")}
        </p>
      );
    }
  }
  return elements;
}

export default function AboutPage() {
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [body, setBody] = useState(DEFAULT_BODY);
  const [loading, setLoading] = useState(true);
  const { logo_url } = useSiteSettings();
  const logoSrc = logo_url || "/logo.svg";

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("about_content").select("title, body").limit(1).maybeSingle();
      if (data?.title) setTitle(data.title);
      if (data?.body) setBody(data.body);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <>
      <section className="relative bg-brand-dark text-white py-20 md:py-28">
        <div className="container-wide px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{title}</h1>
          <p className="text-xl text-brand-gold max-w-2xl mx-auto">{DEFAULT_SUBTITLE}</p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-narrow">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-12 items-start mb-12">
                <div>{renderBody(body)}</div>
                <div className="flex justify-center md:sticky md:top-28">
                  <div className="relative">
                    <div className="absolute -inset-4 rounded-full border-2 border-brand-gold/40" />
                    <Image
                      src={logoSrc}
                      alt="Khalaj Amani Carpets logo"
                      width={280}
                      height={280}
                      className="rounded-full shadow-2xl border-4 border-brand-gold bg-white"
                      unoptimized={!!logo_url}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <Link
                  href="/products/"
                  className="inline-flex items-center justify-center gap-2 bg-brand-red text-white font-semibold px-6 py-3 rounded-full hover:bg-brand-red-dark transition-colors"
                >
                  View Our Collection
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact/"
                  className="inline-flex items-center justify-center gap-2 border-2 border-brand-red text-brand-red font-semibold px-6 py-3 rounded-full hover:bg-brand-red hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
