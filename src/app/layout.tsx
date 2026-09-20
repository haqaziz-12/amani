import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Khalaj Amani Carpets | Authentic Handmade Afghan Carpets",
    template: "%s | Khalaj Amani Carpets",
  },
  description:
    "Discover premium handmade Afghan carpets from Khalaj Amani Carpets in Kabul. Traditional craftsmanship, natural materials, and timeless designs. Custom orders, restoration & worldwide shipping.",
  keywords: [
    "Afghan carpets",
    "handmade rugs",
    "Kabul carpets",
    "Khalaj Amani",
    "Persian style carpets",
    "wool silk rugs",
    "traditional Afghan weaving",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Khalaj Amani Carpets",
    title: "Khalaj Amani Carpets | Authentic Handmade Afghan Carpets",
    description:
      "Premium handmade carpets from the heart of Afghanistan. Heritage craftsmanship meets modern living.",
  },
  robots: { index: true, follow: true },
};

/**
 * Runs in the browser BEFORE React hydrates.
 * Reads the cached hero URL from localStorage and paints it immediately
 * so the homepage hero never flashes solid burgundy on refresh.
 */
const earlyHeroScript = `
(function () {
  try {
    var raw = localStorage.getItem("khalaj_amani_site_settings");
    if (!raw) return;
    var parsed = JSON.parse(raw);
    var hero = parsed && parsed.hero_image_url;
    var logo = parsed && parsed.logo_url;
    if (hero) {
      document.documentElement.style.setProperty("--hero-url", "url(\"" + hero + "\")");
      document.documentElement.classList.add("has-hero-cache");
      // Start downloading immediately
      var img = new Image();
      img.src = hero;
    }
    if (logo) {
      document.documentElement.style.setProperty("--logo-url", "url(\"" + logo + "\")");
      var limg = new Image();
      limg.src = logo;
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: earlyHeroScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
