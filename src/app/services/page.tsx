"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  Palette,
  RefreshCw,
  Truck,
  Home,
  Package,
  HeartHandshake,
  type LucideIcon,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const DEFAULT_TITLE = "Our Services";
const DEFAULT_INTRO =
  "Beyond ready pieces — we support custom work, restoration, shipping and professional consultation.";

const DEFAULT_BODY = `## Bespoke / Custom Commissions
Commission a unique carpet made to your exact size, color palette and design. Our master weavers can interpret traditional Afghan motifs, create contemporary geometric compositions, or work from your own inspiration. Typical lead times range from 4 to 12 months depending on dimensions and complexity. Ideal for architects, interior designers and private clients seeking a true one-of-a-kind heirloom.

## Restoration & Repair
We carefully restore and repair existing Afghan and related handmade carpets. Services include re-knotting damaged areas, fringe and edge repair, foundation strengthening, and professional cleaning guidance. Each restoration is assessed individually so that the original character of the piece is preserved as far as possible.

## Worldwide Shipping
We arrange secure, insured shipping to destinations around the world. Carpets are carefully rolled, wrapped and packed to protect the pile and structure during transit. Shipping costs and transit times are quoted on a case-by-case basis according to size, destination and preferred service level.

## Interior & Project Consultation
We work with interior designers, architects and project teams to select or commission carpets that suit specific spaces — residential, hospitality or commercial. We can provide recommendations on size, scale, color and collection type to complement your overall design vision.

## Wholesale & Trade
Trade clients and retailers are welcome to enquire about wholesale arrangements. We can discuss volume, lead times, exclusive designs and ongoing supply. Please contact us with details of your business and requirements.

## Care Guidance & After-Sales
Every carpet is accompanied by clear care instructions tailored to its materials (wool, silk blend, kilim, etc.). We remain available after purchase to advise on cleaning, rotation, storage and minor maintenance so that your carpet ages gracefully for decades.`;

/** Map section title keywords → icon (matches original design) */
function iconForTitle(title: string): LucideIcon {
  const t = title.toLowerCase();
  if (t.includes("bespoke") || t.includes("custom")) return Palette;
  if (t.includes("restor") || t.includes("repair")) return RefreshCw;
  if (t.includes("ship")) return Truck;
  if (t.includes("interior") || t.includes("consult") || t.includes("project")) return Home;
  if (t.includes("wholesale") || t.includes("trade")) return Package;
  if (t.includes("care") || t.includes("after")) return HeartHandshake;
  return Palette;
}

function parseSections(text: string) {
  const sections: { title: string; body: string }[] = [];
  const parts = text.split(/\n##\s+/);
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim();
    if (!part) continue;
    if (i === 0 && !text.trimStart().startsWith("##")) {
      continue;
    }
    const nl = part.indexOf("\n");
    if (nl === -1) {
      sections.push({ title: part, body: "" });
    } else {
      sections.push({ title: part.slice(0, nl).trim(), body: part.slice(nl).trim() });
    }
  }
  return sections;
}

export default function ServicesPage() {
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [body, setBody] = useState(DEFAULT_BODY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("services_content").select("title, body").limit(1).maybeSingle();
      if (data?.title) setTitle(data.title);
      if (data?.body) setBody(data.body);
      setLoading(false);
    };
    load();
  }, []);

  const sections = parseSections(body);

  return (
    <>
      <section className="bg-brand-dark text-white py-16 md:py-20">
        <div className="container-wide px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">{DEFAULT_INTRO}</p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-wide">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
            </div>
          ) : sections.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {sections.map((s) => {
                const Icon = iconForTitle(s.title);
                return (
                  <div
                    key={s.title}
                    className="bg-white p-8 rounded-2xl border border-border shadow-sm"
                  >
                    <Icon className="w-8 h-8 text-brand-red mb-4" strokeWidth={1.5} />
                    <h2 className="font-serif text-xl font-semibold text-brand-dark mb-3">{s.title}</h2>
                    <p className="text-brand-muted leading-relaxed text-sm whitespace-pre-line">{s.body}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="prose max-w-none text-brand-muted whitespace-pre-line">{body}</div>
          )}

          <div className="mt-16 text-center">
            <p className="text-brand-muted mb-6 max-w-xl mx-auto">
              Tell us about your project or requirements. We respond to every serious enquiry.
            </p>
            <Link
              href="/contact/"
              className="inline-flex items-center justify-center gap-2 bg-brand-red text-white font-semibold px-8 py-4 rounded-full hover:bg-brand-red-dark transition-colors"
            >
              Discuss Your Project
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
