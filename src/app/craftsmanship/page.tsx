"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const DEFAULT_TITLE = "Craftsmanship";
const DEFAULT_INTRO =
  "The patient, human process behind every authentic handmade Afghan carpet.";

const DEFAULT_BODY = `At Khalaj Amani Carpets we remain committed to traditional hand methods. No machine weaving is used. The result is a living object with texture, slight irregularities and character that only human hands can create.

## 01 — Design & Planning
Each carpet begins with a design. Classical medallion, tribal geometric, floral garden or contemporary compositions are drawn and sized according to the intended final dimensions. For bespoke work we refine the design in dialogue with the client before weaving begins.

## 02 — Material Selection
We select hand-spun Afghan wool for its resilience, natural lanolin and ability to take dye beautifully. Where silk accents are required, high-quality silk is chosen for its luminous sheen. Foundations are typically cotton or wool, prepared to the density required by the design.

## 03 — Natural Dyeing
Traditional vegetable dyes — madder for reds, indigo for blues, and other natural sources — are used wherever possible. The dyes are applied with care so that colors remain rich and age gracefully over decades.

## 04 — Hand Knotting
The carpet is woven on a vertical loom. Each knot is tied by hand by experienced weavers. Knot density (KPSI) varies by collection and design; higher densities allow finer detail. This stage can take many months for a large, fine piece.

## 05 — Washing & Finishing
After the weaving is complete the carpet is washed, stretched and finished. Edges are secured, fringes are prepared, and the pile is sheared to an even height so the design reads clearly and the surface feels balanced underfoot.

## 06 — Quality Inspection
Every carpet is inspected for design fidelity, structural integrity, color consistency and overall finish before it is offered for sale or shipped. Only pieces that meet our standard leave the workshop.`;

function parseSteps(text: string) {
  const steps: { number: string; title: string; body: string }[] = [];
  const parts = text.split(/\n##\s+/);
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim();
    if (!part) continue;
    if (i === 0 && !text.trimStart().startsWith("##")) continue;
    const nl = part.indexOf("\n");
    const heading = (nl === -1 ? part : part.slice(0, nl)).trim();
    const body = nl === -1 ? "" : part.slice(nl).trim();
    const match = heading.match(/^(\d+)\s*[—–-]\s*(.+)$/);
    if (match) {
      steps.push({ number: match[1].padStart(2, "0"), title: match[2], body });
    } else {
      steps.push({
        number: String(steps.length + 1).padStart(2, "0"),
        title: heading,
        body,
      });
    }
  }
  return steps;
}

/** Body intro = text before first ## heading, minus the hero subtitle if it was stored in DB */
function extractIntro(text: string): string {
  const beforeHeading = text.split(/\n##\s+/)[0]?.trim() || "";
  // Remove lines that are only the hero subtitle (prevents duplicate on page)
  const lines = beforeHeading
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && l !== DEFAULT_INTRO && l.toLowerCase() !== DEFAULT_INTRO.toLowerCase());
  return lines.join("\n\n").trim();
}

export default function CraftsmanshipPage() {
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [body, setBody] = useState(DEFAULT_BODY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("craftsmanship_content")
        .select("title, body")
        .limit(1)
        .maybeSingle();
      if (data?.title) setTitle(data.title);
      if (data?.body) setBody(data.body);
      setLoading(false);
    };
    load();
  }, []);

  const steps = parseSteps(body);
  const intro = extractIntro(body);

  return (
    <>
      <section className="bg-brand-dark text-white py-16 md:py-20">
        <div className="container-wide px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">{DEFAULT_INTRO}</p>
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
              {intro ? (
                <p className="text-brand-muted leading-relaxed text-lg mb-12 text-center whitespace-pre-line">
                  {intro}
                </p>
              ) : null}

              <div className="space-y-10">
                {steps.map((step) => (
                  <div key={step.number + step.title} className="flex gap-6 items-start">
                    <div className="shrink-0 w-14 h-14 rounded-full bg-brand-red text-white flex items-center justify-center font-serif font-bold text-lg">
                      {step.number}
                    </div>
                    <div>
                      <h2 className="font-serif text-xl font-semibold text-brand-dark mb-2">
                        {step.title}
                      </h2>
                      <p className="text-brand-muted leading-relaxed whitespace-pre-line">{step.body}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-16 text-center">
                <Link
                  href="/products/"
                  className="inline-flex items-center gap-2 bg-brand-red text-white font-semibold px-8 py-4 rounded-full hover:bg-brand-red-dark transition-colors"
                >
                  Explore Finished Pieces
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
