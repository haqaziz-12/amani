"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Users, Award, Heart, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const VALUES = [
  {
    icon: Users,
    title: "Master Craftsmanship",
    text: "Our weavers are experienced artisans who work exclusively by hand. We maintain high standards of knot density, design fidelity, and finishing so that every carpet is worthy of the tradition it represents.",
  },
  {
    icon: Heart,
    title: "Natural Materials",
    text: "We prioritize hand-spun Afghan wool, natural vegetable dyes (madder, indigo, and others), and carefully selected foundations. Where silk is used, it is chosen for quality and luminosity.",
  },
  {
    icon: Award,
    title: "Authenticity First",
    text: "We do not produce machine-made imitations. Every carpet is genuinely handmade in Afghanistan. We are transparent about materials, origin, and the time required to create each piece.",
  },
  {
    icon: MapPin,
    title: "From Kabul to the World",
    text: "While our roots are firmly in Kabul, we serve clients internationally — private collectors, interior designers, hotels, and families seeking lasting, meaningful floor art.",
  },
];

const DEFAULT_ROOTS = `Khalaj Amani Carpets is a handmade carpet production company based in the historic Chaman Huzori area of Kabul, Afghanistan. Located at ACMEG 1st, Second Floor, Room #24 on Jada e Maiwand, our workshop sits in a district long associated with craft, trade, and the enduring spirit of Afghan artistry.

We specialize exclusively in authentic hand-knotted and handwoven carpets produced by skilled Afghan weavers. Every piece that leaves our workshop is the result of traditional techniques, natural materials, and the patient dedication of artisans whose knowledge has been passed down through families for generations.

Our name — Khalaj Amani — reflects both heritage and aspiration: the Khalaj cultural lineage and the word "Amani," which carries meanings of peace, safety, and lasting value. We aim to create carpets that bring beauty and lasting quality into homes around the world.`;

const DEFAULT_WORKSHOP = `Production takes place in our Kabul workshop under the supervision of experienced masters. Designs range from classical medallion and tribal geometric patterns to more contemporary interpretations and fully bespoke commissions. Clients can request specific sizes, colorways, and motifs. Lead times vary according to size and complexity — typically several months for fine hand-knotted pieces.

We also offer restoration and careful cleaning guidance for existing Afghan and related carpets, helping preserve pieces that already carry history.

Whether you are furnishing a home, specifying for a project, or seeking a single heirloom piece, Khalaj Amani Carpets exists to provide authentic, high-quality handmade carpets with clear provenance and honest craftsmanship.`;

function extractSection(body: string, heading: string): string | null {
  const re = new RegExp(`##\\s*${heading}[\\s\\S]*?(?=\\n##\\s|$)`, "i");
  const m = body.match(re);
  if (!m) return null;
  return m[0].replace(new RegExp(`^##\\s*${heading}\\s*`, "i"), "").trim();
}

export default function AboutPage() {
  const [pageTitle, setPageTitle] = useState("About Khalaj Amani Carpets");
  const [roots, setRoots] = useState(DEFAULT_ROOTS);
  const [workshop, setWorkshop] = useState(DEFAULT_WORKSHOP);
  const [aboutImage, setAboutImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { logo_url } = useSiteSettings();
  const logoSrc = logo_url || "/logo.jpg";

  useEffect(() => {
    const load = async () => {
      // Use select(*) so a missing image_url column does not break the whole query
      const { data, error } = await supabase
        .from("about_content")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        if (data.title) setPageTitle(data.title);
        if ((data as any).image_url) setAboutImage((data as any).image_url);
        if (data.body) {
          const rootsSec =
            extractSection(data.body, "Our Roots in Kabul") ||
            extractSection(data.body, "Our Roots");
          const workshopSec =
            extractSection(data.body, "Our Workshop & Process") ||
            extractSection(data.body, "Our Workshop");
          if (rootsSec) setRoots(rootsSec);
          else if (!data.body.includes("##")) setRoots(data.body);
          if (workshopSec) setWorkshop(workshopSec);
        }
      }

      // Fallback from site_settings (dual-write path)
      if (!(data as any)?.image_url) {
        const { data: settings } = await supabase
          .from("site_settings")
          .select("*")
          .limit(1)
          .maybeSingle();
        if ((settings as any)?.about_image_url) {
          setAboutImage((settings as any).about_image_url);
        }
      }

      setLoading(false);
    };
    load();
  }, []);

  const displayImage = aboutImage || logoSrc;
  const isLogoFallback = !aboutImage;

  return (
    <>
      <section className="relative bg-brand-dark text-white py-20 md:py-28">
        <div className="container-wide px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            {pageTitle}
          </h1>
          <p className="text-xl text-brand-gold max-w-2xl mx-auto">
            Weaving heritage, one knot at a time, from the heart of Kabul.
          </p>
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
              <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                <div>
                  <h2 className="font-serif text-3xl font-bold text-brand-dark mb-6">
                    Our Roots in Kabul
                  </h2>
                  {roots.split("\n\n").map((para, i) => (
                    <p key={i} className="text-brand-muted leading-relaxed mb-4 last:mb-0">
                      {para.trim()}
                    </p>
                  ))}
                </div>
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute -inset-4 rounded-full border-2 border-brand-gold/40" />
                    <div
                      className={`relative overflow-hidden shadow-2xl border-4 border-brand-gold bg-white ${
                        isLogoFallback
                          ? "rounded-full w-[280px] h-[280px] md:w-[320px] md:h-[320px]"
                          : "rounded-2xl w-full max-w-sm aspect-[4/5]"
                      }`}
                    >
                      <Image
                        src={displayImage}
                        alt={aboutImage ? "Khalaj Amani workshop" : "Khalaj Amani Carpets logo"}
                        fill
                        className="object-cover"
                        unoptimized
                        priority
                      />
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="font-serif text-3xl font-bold text-brand-dark mb-6">
                What We Stand For
              </h2>
              <div className="grid sm:grid-cols-2 gap-6 mb-16">
                {VALUES.map((item) => (
                  <div
                    key={item.title}
                    className="bg-white p-6 rounded-2xl border border-border shadow-sm"
                  >
                    <item.icon className="w-8 h-8 text-brand-red mb-3" />
                    <h3 className="font-serif text-xl font-semibold text-brand-dark mb-2">
                      {item.title}
                    </h3>
                    <p className="text-brand-muted text-sm leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>

              <h2 className="font-serif text-3xl font-bold text-brand-dark mb-6">
                Our Workshop & Process
              </h2>
              {workshop.split("\n\n").map((para, i) => (
                <p key={i} className="text-brand-muted leading-relaxed mb-4">
                  {para.trim()}
                </p>
              ))}

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
