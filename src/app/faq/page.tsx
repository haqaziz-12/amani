import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Khalaj Amani handmade Afghan carpets — authenticity, materials, shipping, care, custom orders and more.",
};

const faqs = [
  {
    q: "Are your carpets truly handmade in Afghanistan?",
    a: "Yes. Every carpet offered by Khalaj Amani Carpets is produced by hand in our workshop and associated weaving facilities in Kabul, Afghanistan. We do not sell machine-made carpets.",
  },
  {
    q: "What materials do you use?",
    a: "Primarily hand-spun Afghan wool and natural vegetable dyes. Some pieces include silk accents or pure silk. Foundations are typically cotton or wool. Exact materials are listed for each product.",
  },
  {
    q: "How are prices determined?",
    a: "Prices depend on size, knot density (KPSI), materials (wool vs silk), design complexity and current market conditions. All prices are provided on enquiry so we can give accurate, up-to-date quotations.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes. We arrange secure, insured international shipping. Cost and transit time depend on the size of the carpet and the destination. We will quote shipping as part of any order discussion.",
  },
  {
    q: "Can I commission a custom size or design?",
    a: "Absolutely. Bespoke commissions are one of our core services. You can specify dimensions, colors and design direction. Lead times typically range from 4 to 12 months depending on the piece.",
  },
  {
    q: "How should I care for my carpet?",
    a: "Professional cleaning is recommended for most hand-knotted pieces. Regular vacuuming (without a beater bar) and prompt attention to spills help. Detailed care instructions are supplied with each carpet according to its materials.",
  },
  {
    q: "What is KPSI and why does it matter?",
    a: "KPSI means knots per square inch. Higher KPSI generally indicates a finer, more detailed and often more time-consuming weave. Our range includes robust tribal weaves as well as ultra-fine pieces over 200 KPSI.",
  },
  {
    q: "Do you offer restoration services?",
    a: "Yes. We assess and restore existing handmade carpets — re-knotting, edge and fringe repair, structural strengthening and cleaning guidance. Contact us with photos and details of the piece.",
  },
  {
    q: "How long does a typical carpet take to make?",
    a: "It varies widely. A small prayer rug may take weeks; a large, fine medallion carpet can take many months of continuous weaving by skilled hands.",
  },
  {
    q: "Can I visit the workshop in Kabul?",
    a: "Visits can be arranged by prior appointment when conditions allow. Please contact us in advance so we can coordinate a suitable time.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We discuss payment terms on a case-by-case basis for international orders. Common methods include bank transfer. Details are confirmed once an order is agreed.",
  },
  {
    q: "Are the colors light-fast?",
    a: "Natural dyes used properly have good light-fastness, though prolonged direct sunlight will gradually affect any textile. We recommend rotating carpets periodically and using UV-protective window treatments where possible.",
  },
];

export default function FAQPage() {
  return (
    <>
      <section className="bg-brand-dark text-white py-16 md:py-20">
        <div className="container-wide px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Clear answers about our carpets, process and services.
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-narrow space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <h2 className="font-serif text-lg font-semibold text-brand-dark mb-2">{faq.q}</h2>
              <p className="text-brand-muted leading-relaxed text-sm">{faq.a}</p>
            </div>
          ))}

          <div className="pt-8 text-center">
            <p className="text-brand-muted mb-4">Still have a question?</p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-brand-red text-white font-semibold px-6 py-3 rounded-full hover:bg-brand-red-dark transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
