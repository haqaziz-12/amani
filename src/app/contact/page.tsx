import type { Metadata } from "next";
import { MapPin, Phone, Mail, MessageCircle, Instagram, Facebook } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Khalaj Amani Carpets in Kabul. Email, WhatsApp, phone and address for enquiries about handmade Afghan carpets.",
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-brand-dark text-white py-16 md:py-20">
        <div className="container-wide px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            We welcome enquiries about our carpets, custom work and services.
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-wide grid lg:grid-cols-2 gap-12">
          {/* Contact info */}
          <div className="space-y-8">
            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-dark mb-6">Get in Touch</h2>
              <ul className="space-y-5">
                <li className="flex gap-4">
                  <MapPin className="w-6 h-6 text-brand-red shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-brand-dark">Workshop Address</p>
                    <p className="text-brand-muted text-sm">
                      ACMEG 1st, Second Floor, Room #24<br />
                      Jada e Maiwand, Chaman Huzori<br />
                      Kabul, Afghanistan
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <Phone className="w-6 h-6 text-brand-red shrink-0" />
                  <div>
                    <p className="font-medium text-brand-dark">Phone</p>
                    <a href="tel:+93787567967" className="text-brand-muted text-sm hover:text-brand-red">
                      +93 787 567 967
                    </a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <MessageCircle className="w-6 h-6 text-brand-red shrink-0" />
                  <div>
                    <p className="font-medium text-brand-dark">WhatsApp</p>
                    <a
                      href="https://wa.me/93787567967"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-muted text-sm hover:text-brand-red"
                    >
                      +93 787 567 967
                    </a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <Mail className="w-6 h-6 text-brand-red shrink-0" />
                  <div>
                    <p className="font-medium text-brand-dark">Email</p>
                    <a
                      href="mailto:khalajamani.ltd@hotmail.com"
                      className="text-brand-muted text-sm hover:text-brand-red"
                    >
                      khalajamani.ltd@hotmail.com
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-medium text-brand-dark mb-3">Follow us</p>
              <div className="flex gap-3">
                <a
                  href="https://www.instagram.com/khalajamanicarpets"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-brand-red/10 flex items-center justify-center text-brand-red hover:bg-brand-red hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://www.facebook.com/share/1C4gJ47quX/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-brand-red/10 flex items-center justify-center text-brand-red hover:bg-brand-red hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Simple form note */}
          <div className="bg-white rounded-2xl border border-border p-8 shadow-sm">
            <h2 className="font-serif text-2xl font-bold text-brand-dark mb-4">Send an Enquiry</h2>
            <p className="text-brand-muted text-sm mb-6 leading-relaxed">
              For the fastest response, please message us directly on WhatsApp. You can also
              email us with details of the carpet or service you are interested in.
              We will reply as soon as possible.
            </p>
            <a
              href="https://wa.me/93787567967"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold px-6 py-4 rounded-full hover:opacity-90 transition-opacity mb-4"
            >
              <MessageCircle className="w-5 h-5" />
              Open WhatsApp Chat
            </a>
            <a
              href="mailto:khalajamani.ltd@hotmail.com?subject=Carpet%20Enquiry"
              className="w-full inline-flex items-center justify-center gap-2 bg-brand-red text-white font-semibold px-6 py-4 rounded-full hover:bg-brand-red-dark transition-colors"
            >
              <Mail className="w-5 h-5" />
              Send Email
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
