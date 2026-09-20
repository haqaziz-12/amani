import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Craftsmanship",
  description:
    "Discover the traditional handmade process behind every Khalaj Amani carpet — from design and dyeing to knotting and finishing in our Kabul workshop.",
};

const steps = [
  {
    number: "01",
    title: "Design & Planning",
    text: "Each carpet begins with a design. Classical medallion, tribal geometric, floral garden or contemporary compositions are drawn and sized according to the intended final dimensions. For bespoke work we refine the design in dialogue with the client before weaving begins.",
  },
  {
    number: "02",
    title: "Material Selection",
    text: "We select hand-spun Afghan wool for its resilience, natural lanolin and ability to take dye beautifully. Where silk accents are required, high-quality silk is chosen for its luminous sheen. Foundations are typically cotton or wool, prepared to the density required by the design.",
  },
  {
    number: "03",
    title: "Natural Dyeing",
    text: "Traditional vegetable dyes — madder for reds, indigo for blues, and other natural sources — are used wherever possible. The dyeing process is carefully controlled so that colors are rich, light-fast and harmonious. Natural abrash (subtle tonal variation) is often embraced as a mark of handwork.",
  },
  {
    number: "04",
    title: "Hand Knotting",
    text: "The carpet is woven on a vertical loom. Each knot is tied by hand by experienced weavers. Knot density (KPSI) varies by collection — from robust tribal weaves to ultra-fine pieces exceeding 200 knots per square inch. A single large carpet can take many months of continuous work.",
  },
  {
    number: "05",
    title: "Washing & Finishing",
    text: "After the weaving is complete the carpet is washed, stretched and finished. Edges are secured, fringes are prepared, and the pile is sheared to an even height. Some pieces receive a special wash to create a softer, antique-style appearance while remaining fully new and durable.",
  },
  {
    number: "06",
    title: "Quality Inspection",
    text: "Every carpet is inspected for design fidelity, structural integrity, color consistency and overall finish before it is offered for sale or shipped. Only pieces that meet our standards leave the workshop under the Khalaj Amani name.",
  },
];

export default function CraftsmanshipPage() {
  return (
    <>
      <section className="bg-brand-dark text-white py-16 md:py-20">
        <div className="container-wide px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Craftsmanship</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            The patient, human process behind every authentic handmade Afghan carpet.
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-narrow">
          <p className="text-brand-muted leading-relaxed text-lg mb-12 text-center">
            At Khalaj Amani Carpets we remain committed to traditional hand methods.
            No machine weaving is used. The result is a living object with texture,
            slight irregularities and character that only human hands can create.
          </p>

          <div className="space-y-10">
            {steps.map((step) => (
              <div key={step.number} className="flex gap-6 items-start">
                <div className="shrink-0 w-14 h-14 rounded-full bg-brand-red text-white flex items-center justify-center font-serif font-bold text-lg">
                  {step.number}
                </div>
                <div>
                  <h2 className="font-serif text-xl font-semibold text-brand-dark mb-2">{step.title}</h2>
                  <p className="text-brand-muted leading-relaxed">{step.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-brand-red text-white font-semibold px-8 py-4 rounded-full hover:bg-brand-red-dark transition-colors"
            >
              Explore Finished Pieces
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
