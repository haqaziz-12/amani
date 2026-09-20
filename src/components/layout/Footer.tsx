"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Instagram, Facebook, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export function Footer() {
  const { logo_url, loaded } = useSiteSettings();
  // Prefer cached/live logo, then static logo.jpg (exists in /public)
  const logoSrc = logo_url || "/logo.jpg";

  return (
    <footer className="bg-brand-dark text-white">
      <div className="container-wide section-padding !py-12 md:!py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 shrink-0">
                <Image
                  src={logoSrc}
                  alt="Khalaj Amani Carpets"
                  width={48}
                  height={48}
                  className={cn(
                    "rounded-full object-cover border border-brand-gold transition-opacity duration-300",
                    loaded || logo_url ? "opacity-100" : "opacity-90"
                  )}
                  unoptimized={!!logo_url}
                />
              </div>
              <div>
                <span className="font-serif text-xl font-semibold">Khalaj Amani</span>
                <span className="block text-xs uppercase tracking-widest text-brand-gold">Carpets</span>
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Authentic handmade Afghan carpets crafted with generations of skill in the heart of Kabul.
              Every piece tells a story of heritage, patience, and artistry.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 text-brand-gold">Explore</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/about", label: "About Us" },
                { href: "/products", label: "Our Products" },
                { href: "/services", label: "Services" },
                { href: "/craftsmanship", label: "Craftsmanship" },
                { href: "/faq", label: "FAQ" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/70 hover:text-brand-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 text-brand-gold">Contact</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex gap-2">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-brand-gold" />
                <span>
                  ACMEG 1st, Second Floor, Room #24<br />
                  Jada e Maiwand, Chaman Huzori<br />
                  Kabul, Afghanistan
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-brand-gold" />
                <a href="tel:+93787567967" className="hover:text-brand-gold transition-colors">
                  +93 787 567 967
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-brand-gold" />
                <a href="mailto:khalajamani.ltd@hotmail.com" className="hover:text-brand-gold transition-colors">
                  khalajamani.ltd@hotmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 shrink-0 text-brand-gold" />
                <a href="https://wa.me/93787567967" target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors">
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 text-brand-gold">Follow Us</h3>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/khalajamanicarpets"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-red transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/share/1C4gJ47quX/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-red transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
            <p className="mt-6 text-xs text-white/50">
              Handmade with pride in Afghanistan.<br />
              Worldwide shipping available.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/50">
          <p>© {new Date().getFullYear()} Khalaj Amani Carpets. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-brand-gold">Privacy</Link>
            <Link href="/terms" className="hover:text-brand-gold">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
