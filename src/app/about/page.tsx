import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Users, Award, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Khalaj Amani Carpets – a handmade carpet production house rooted in Kabul’s historic Chaman Huzori district. Generations of Afghan weaving tradition.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-brand-dark text-white py-20 md:py-28">
        <div className="container-wide px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            About Khalaj Amani Carpets
          </h1>
          <p className="text-xl text-brand-gold max-w-2xl mx-auto">
            Weaving heritage, one knot at a time, from the heart of Kabul.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-background">
        <div className="container-narrow prose prose-lg max-w-none">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="font-serif text-3xl font-bold text-brand-dark mb-6">
                Our Roots in Kabul
              </h2>
              <p className="text-brand-muted leading-relaxed mb-4">
                Khalaj Amani Carpets is a handmade carpet production company based in the
                historic Chaman Huzori area of Kabul, Afghanistan. Located at ACMEG 1st,
                Second Floor, Room #24 on Jada e Maiwand, our workshop sits in a district
                long associated with craft, trade, and the enduring spirit of Afghan artistry.
              </p>
              <p className="text-brand-muted leading-relaxed mb-4">
                We specialize exclusively in authentic hand-knotted and handwoven carpets
                produced by skilled Afghan weavers. Every piece that leaves our workshop is
                the result of traditional techniques, natural materials, and the patient
                dedication of artisans whose knowledge has been passed down through families
                for generations.
              </p>
              <p className="text-brand-muted leading-relaxed">
                Our name — Khalaj Amani — reflects both heritage and aspiration: the Khalaj
                cultural lineage and the word “Amani,” which carries meanings of peace,
                safety, and lasting value. We aim to create carpets that bring beauty and
                lasting quality into homes around the world.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 rounded-full border-2 border-brand-gold/40" />
                <Image
                  src="/logo.jpg"
                  alt="Khalaj Amani Carpets logo"
                  width={320}
                  height={320}
                  className="rounded-full shadow-2xl border-4 border-brand-gold"
                />
              </div>
            </div>
          </div>

          <h2 className="font-serif text-3xl font-bold text-brand-dark mb-6">
            What We Stand For
          </h2>
          <div className="grid sm:grid-cols-2 gap-8 mb-16">
            {[
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
            ].map((item) => (
              <div key={item.title} className="bg-white p-6 rounded-2xl border border-border shadow-sm">
                <item.icon className="w-8 h-8 text-brand-red mb-3" />
                <h3 className="font-serif text-xl font-semibold text-brand-dark mb-2">{item.title}</h3>
                <p className="text-brand-muted text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>

          <h2 className="font-serif text-3xl font-bold text-brand-dark mb-6">
            Our Workshop & Process
          </h2>
          <p className="text-brand-muted leading-relaxed mb-4">
            Production takes place in our Kabul workshop under the supervision of experienced
            masters. Designs range from classical medallion and tribal geometric patterns to
            more contemporary interpretations and fully bespoke commissions. Clients can
            request specific sizes, colorways, and motifs. Lead times vary according to size
            and complexity — typically several months for fine hand-knotted pieces.
          </p>
          <p className="text-brand-muted leading-relaxed mb-4">
            We also offer restoration and careful cleaning guidance for existing Afghan and
            related carpets, helping preserve pieces that already carry history.
          </p>
          <p className="text-brand-muted leading-relaxed mb-8">
            Whether you are furnishing a home, specifying for a project, or seeking a single
            heirloom piece, Khalaj Amani Carpets exists to provide authentic, high-quality
            handmade carpets with clear provenance and honest craftsmanship.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 bg-brand-red text-white font-semibold px-6 py-3 rounded-full hover:bg-brand-red-dark transition-colors"
            >
              View Our Collection
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 border-2 border-brand-red text-brand-red font-semibold px-6 py-3 rounded-full hover:bg-brand-red hover:text-white transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
