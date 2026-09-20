import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for Khalaj Amani Carpets website and sales.",
};

export default function TermsPage() {
  return (
    <section className="section-padding bg-background">
      <div className="container-narrow prose prose-sm max-w-none">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark mb-6">Terms of Service</h1>
        <p className="text-brand-muted leading-relaxed mb-4">
          By using this website and placing enquiries or orders with Khalaj Amani Carpets you agree to the
          following terms.
        </p>
        <h2 className="font-serif text-xl font-semibold text-brand-dark mt-8 mb-3">Products & Descriptions</h2>
        <p className="text-brand-muted leading-relaxed mb-4">
          All carpets are handmade. Natural variations in color, size and texture are inherent to the craft
          and do not constitute defects. Product images and descriptions are representative; each piece is unique.
        </p>
        <h2 className="font-serif text-xl font-semibold text-brand-dark mt-8 mb-3">Pricing & Enquiries</h2>
        <p className="text-brand-muted leading-relaxed mb-4">
          Prices are provided on enquiry and may change. A formal quotation will be issued before any order
          is confirmed. Custom commissions require a deposit and written agreement on design and timeline.
        </p>
        <h2 className="font-serif text-xl font-semibold text-brand-dark mt-8 mb-3">Shipping & Risk</h2>
        <p className="text-brand-muted leading-relaxed mb-4">
          Shipping is arranged on a case-by-case basis. Risk of loss or damage passes according to the agreed
          shipping terms. We recommend insured shipping for all international orders.
        </p>
        <h2 className="font-serif text-xl font-semibold text-brand-dark mt-8 mb-3">Contact</h2>
        <p className="text-brand-muted leading-relaxed">
          For questions about these terms, contact us at khalajamani.ltd@hotmail.com or via WhatsApp.
        </p>
      </div>
    </section>
  );
}
