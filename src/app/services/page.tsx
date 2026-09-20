import type { Metadata } from "next";
import Link from "next/link";
import { Scissors, Truck, RefreshCw, Palette, Home, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Custom orders, restoration, wholesale, shipping and interior consultation from Khalaj Amani Carpets in Kabul.",
};

const services = [
  {
    icon: Palette,
    title: "Bespoke / Custom Commissions",
    description:
      "Commission a unique carpet made to your exact size, color palette and design. Our master weavers can interpret traditional Afghan motifs, create contemporary geometric compositions, or work from your own inspiration. Typical lead times range from 4 to 12 months depending on dimensions and complexity. Ideal for architects, interior designers and private clients seeking a true one-of-a-kind heirloom.",
  },
  {
    icon: RefreshCw,
    title: "Restoration & Repair",
    description:
      "We carefully restore and repair existing Afghan and related handmade carpets. Services include re-knotting damaged areas, fringe and edge repair, foundation strengthening, and professional cleaning guidance. Each restoration is assessed individually so that the original character of the piece is preserved as far as possible.",
  },
  {
    icon: Truck,
    title: "Worldwide Shipping",
    description:
      "We arrange secure, insured shipping to destinations around the world. Carpets are carefully rolled, wrapped and packed to protect the pile and structure during transit. Shipping costs and transit times are quoted on a case-by-case basis according to size, destination and preferred service level.",
  },
  {
    icon: Home,
    title: "Interior & Project Consultation",
    description:
      "We work with interior designers, architects and project teams to select or commission carpets that suit specific spaces — residential, hospitality or commercial. We can provide recommendations on size, scale, color and collection type to complement your overall design vision.",
  },
  {
    icon: Scissors,
    title: "Wholesale & Trade",
    description:
      "Trade clients and retailers are welcome to enquire about wholesale arrangements. We can discuss volume, lead times, exclusive designs and ongoing supply. Please contact us with details of your business and requirements.",
  },
  {
    icon: Shield,
    title: "Care Guidance & After-Sales",
    description:
      "Every carpet is accompanied by clear care instructions tailored to its materials (wool, silk blend, kilim, etc.). We remain available after purchase to advise on cleaning, rotation, storage and minor maintenance so that your carpet ages gracefully for decades.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="bg-brand-dark text-white py-16 md:py-20">
        <div className="container-wide px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Beyond ready pieces — we support custom work, restoration, shipping and professional consultation.
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((s) => (
              <div key={s.title} className="bg-white p-8 rounded-2xl border border-border shadow-sm">
                <s.icon className="w-10 h-10 text-brand-red mb-4" />
                <h2 className="font-serif text-xl font-semibold text-brand-dark mb-3">{s.title}</h2>
                <p className="text-brand-muted leading-relaxed text-sm">{s.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-brand-muted mb-6 max-w-xl mx-auto">
              Tell us about your project or requirements. We respond to every serious enquiry.
            </p>
            <Link
              href="/contact"
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
