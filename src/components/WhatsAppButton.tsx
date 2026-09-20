"use client";

import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/93787567967"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 transition-transform"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
}
