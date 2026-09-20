import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy of Khalaj Amani Carpets.",
};

export default function PrivacyPage() {
  return (
    <section className="section-padding bg-background">
      <div className="container-narrow prose prose-sm max-w-none">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark mb-6">Privacy Policy</h1>
        <p className="text-brand-muted leading-relaxed mb-4">
          Khalaj Amani Carpets (“we”, “us”) respects your privacy. This policy explains how we handle
          information when you use our website or contact us.
        </p>
        <h2 className="font-serif text-xl font-semibold text-brand-dark mt-8 mb-3">Information We Collect</h2>
        <p className="text-brand-muted leading-relaxed mb-4">
          When you contact us by email, WhatsApp, phone or through any form, we receive the information
          you choose to provide (name, contact details, enquiry content). We do not sell personal data.
        </p>
        <h2 className="font-serif text-xl font-semibold text-brand-dark mt-8 mb-3">How We Use Information</h2>
        <p className="text-brand-muted leading-relaxed mb-4">
          We use contact information solely to respond to enquiries, process orders and provide customer
          service related to our carpets and services.
        </p>
        <h2 className="font-serif text-xl font-semibold text-brand-dark mt-8 mb-3">Third Parties</h2>
        <p className="text-brand-muted leading-relaxed mb-4">
          Our website may use hosting, analytics or communication providers. These providers process data
          only as necessary to deliver their services to us.
        </p>
        <h2 className="font-serif text-xl font-semibold text-brand-dark mt-8 mb-3">Contact</h2>
        <p className="text-brand-muted leading-relaxed">
          For any privacy-related questions, please email khalajamani.ltd@hotmail.com.
        </p>
      </div>
    </section>
  );
}
