"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/services", label: "Services" },
  { href: "/craftsmanship", label: "Craftsmanship" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { logo_url } = useSiteSettings();
  const logoSrc = logo_url || "/logo.jpg";

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-sm w-full">
      <div className="container-wide flex items-center justify-between h-16 md:h-20">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
          <Image
            src={logoSrc}
            alt="Khalaj Amani Carpets"
            width={48}
            height={48}
            className="rounded-full object-cover border-2 border-brand-gold bg-white w-11 h-11 sm:w-[52px] sm:h-[52px]"
            priority
            unoptimized={!!logo_url}
          />
          <div className="hidden sm:block min-w-0">
            <span className="font-serif text-lg md:text-xl font-semibold text-brand-dark tracking-tight">
              Khalaj Amani
            </span>
            <span className="block text-xs uppercase tracking-widest text-brand-red font-medium">
              Carpets
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-brand-dark/80 hover:text-brand-red transition-colors rounded-md hover:bg-muted"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="tel:+93787567967"
            className="hidden md:flex items-center gap-1.5 text-sm font-medium text-brand-dark hover:text-brand-red transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>+93 787 567 967</span>
          </a>
          <a
            href="https://wa.me/93787567967"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 bg-brand-red text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-brand-red-dark transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-md hover:bg-muted"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "lg:hidden overflow-y-auto transition-all duration-300 border-t border-border bg-white",
          open ? "max-h-[min(28rem,calc(100vh-4rem))] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        )}
      >
        <nav className="flex flex-col px-4 py-3 pb-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="px-3 py-3 text-base font-medium text-brand-dark hover:text-brand-red hover:bg-muted rounded-md"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://wa.me/93787567967"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 mb-2 flex items-center justify-center gap-2 bg-brand-red text-white font-medium px-4 py-3.5 rounded-full shrink-0"
          >
            <MessageCircle className="w-5 h-5" />
            Chat on WhatsApp
          </a>
        </nav>
      </div>
    </header>
  );
}
