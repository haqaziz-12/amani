"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const DEFAULT_TITLE = "About Khalaj Amani Carpets";
const DEFAULT_SUBTITLE = "Weaving heritage, one knot at a time, from the heart of Kabul.";

const DEFAULT_BODY = `## Our Roots in Kabul
Khalaj Amani Carpets is a handmade carpet production company based in the historic Chaman Huzori area of Kabul, Afghanistan. Located at ACMEG 1st, Second Floor, Room #24 on Jada e Maiwand, our workshop sits in a district long associated with craft, trade, and the enduring spirit of Afghan artistry.

We specialize exclusively in authentic hand-knotted and handwoven carpets produced by skilled Afghan weavers. Every piece that leaves our workshop is the result of traditional techniques, natural materials, and the patient dedication of artisans whose knowledge has been passed down through families for generations.

Our name — Khalaj Amani — reflects both heritage and aspiration: the Khalaj cultural lineage and the word "Amani," which carries meanings of peace, safety, and lasting value. We aim to create carpets that bring beauty and lasting quality into homes around the world.

## What We Stand For
**Master Craftsmanship**
Our weavers are experienced artisans who work exclusively by hand. We maintain high standards of knot density, design fidelity, and finishing so that every carpet is worthy of the tradition it represents.

**Natural Materials**
We prioritize hand-spun Afghan wool, natural vegetable dyes (madder, indigo, and others), and carefully selected foundations. Where silk is used, it is chosen for quality and luminosity.

**Authenticity First**
We do not produce machine-made imitations. Every carpet is genuinely handmade in Afghanistan. We are transparent about materials, origin, and the time required to create each piece.

**From Kabul to the World**
While our roots are firmly in Kabul, we serve clients internationally — private collectors, interior designers, hotels, and families seeking lasting, meaningful floor art.

## Our Workshop & Process
Production takes place in our Kabul workshop under the supervision of experienced masters. Designs range from classical medallion and tribal geometric patterns to more contemporary interpretations and fully bespoke commissions. Clients can request specific sizes, colorways, and motifs. Lead times vary according to size and complexity — typically several months for fine hand-knotted pieces.

We also offer restoration and careful cleaning guidance for existing handmade carpets.`;

type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string };

function parseBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  const lines = text.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    // Skip lines that are only the site subtitle (prevents duplicate under hero)
    if (
      trimmed === DEFAULT_SUBTITLE ||
      trimmed.toLowerCase() === DEFAULT_SUBTITLE.toLowerCase()
    ) {
      continue;
    }
    if (trimmed.startsWith("## ")) {
      blocks.push({ type: "h2", text: trimmed.replace(/^##\s+/, "") });
    } else if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
      blocks.push({ type: "h3", text: trimmed.replace(/\*\*/g, "") });
    } else {
      blocks.push({
        type: "p",
        text: trimmed.replace(/\*\*(.+?)\*\*/g, "$1"),
      });
    }
  }
  return blocks;
}

export default function AboutPage() {
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [body, setBody] = useState(DEFAULT_BODY);
  const [loading, setLoading] = useState(true);
  const { logo_url } = useSiteSettings();
  // Prefer uploaded logo, then static public logo — do not touch hero assets
  const logoSrc = logo_url || "/logo.jpg";

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("about_content").select("title, body").limit(1).maybeSingle();
      if (data?.title) setTitle(data.title);
      if (data?.body) setBody(data.body);
      setLoading(false);
    };
    load();
  }, []);

  const blocks = parseBlocks(body);

  // Split: first h2 section ("Our Roots…") sits beside the logo; rest below full width
  let firstH2Index = blocks.findIndex((b) => b.type === "h2");
  if (firstH2Index === -1) firstH2Index = 0;
  let secondH2Index = blocks.findIndex((b, i) => i > firstH2Index && b.type === "h2");
  if (secondH2Index === -1) secondH2Index = blocks.length;

  const introBlocks = blocks.slice(0, secondH2Index);
  const restBlocks = blocks.slice(secondH2Index);

  const renderBlocks = (list: Block[]) =>
    list.map((b, i) => {
      if (b.type === "h2") {
        return (
          <h2 key={i} className="font-serif text-2xl md:text-3xl font-bold text-brand-dark mt-10 mb-4 first:mt-0">
            {b.text}
          </h2>
        );
      }
      if (b.type === "h3") {
        return (
          <h3 key={i} className="font-serif text-xl font-semibold text-brand-dark mt-6 mb-2">
            {b.text}
          </h3>
        );
      }
      return (
        <p key={i} className="text-brand-muted leading-relaxed mb-3">
          {b.text}
        </p>
      );
    });

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
              {/* First section + logo side-by-side (original layout) */}
              <div className="grid md:grid-cols-2 gap-12 items-start mb-4">
                <div>{renderBlocks(introBlocks)}</div>
                <div className="flex justify-center md:sticky md:top-28 order-first md:order-last">
                  <div className="relative">
                    <div className="absolute -inset-4 rounded-full border-2 border-brand-gold/40" />
                    <Image
                      src={logoSrc}
                      alt="Khalaj Amani Carpets logo"
                      width={280}
                      height={280}
                      className="rounded-full shadow-2xl border-4 border-brand-gold bg-white object-cover"
                      unoptimized={!!logo_url}
                    />
                  </div>
                </div>
              </div>

              {/* Remaining sections full width */}
              {restBlocks.length > 0 && <div className="mt-4">{renderBlocks(restBlocks)}</div>}

              <div className="flex flex-col sm:flex-row gap-4 mt-12">
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
