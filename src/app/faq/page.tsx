"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
};

const DEFAULT_FAQS: Omit<FaqItem, "id">[] = [
  {
    question: "Are your carpets truly handmade in Afghanistan?",
    answer:
      "Yes. Every carpet offered by Khalaj Amani Carpets is produced by hand in our workshop and associated weaving facilities in Kabul, Afghanistan. We do not sell machine-made carpets.",
    sort_order: 1,
  },
  {
    question: "What materials do you use?",
    answer:
      "Primarily hand-spun Afghan wool and natural vegetable dyes. Some pieces include silk accents or pure silk. Foundations are typically cotton or wool. Exact materials are listed for each product.",
    sort_order: 2,
  },
  {
    question: "How are prices determined?",
    answer:
      "Prices depend on size, knot density (KPSI), materials (wool vs silk), design complexity and current market conditions. All prices are provided on enquiry so we can give accurate, up-to-date quotations.",
    sort_order: 3,
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes. We arrange secure, insured international shipping. Cost and transit time depend on the size of the carpet and the destination. We will quote shipping as part of any order discussion.",
    sort_order: 4,
  },
  {
    question: "Can I commission a custom size or design?",
    answer:
      "Absolutely. Bespoke commissions are one of our core services. You can specify dimensions, colors and design direction. Lead times typically range from 4 to 12 months depending on the piece.",
    sort_order: 5,
  },
  {
    question: "How should I care for my carpet?",
    answer:
      "Professional cleaning is recommended for most hand-knotted pieces. Regular vacuuming (without a beater bar) and prompt attention to spills help. Detailed care instructions are supplied with each carpet according to its materials.",
    sort_order: 6,
  },
];

export default function FAQPage() {
  const [faqs, setFaqs] = useState<(FaqItem | Omit<FaqItem, "id">)[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("faqs")
        .select("id, question, answer, sort_order")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });

      if (!error && data && data.length > 0) {
        setFaqs(data as FaqItem[]);
      } else {
        setFaqs(DEFAULT_FAQS);
      }
      setLoading(false);
    };
    load();
  }, []);

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
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
            </div>
          ) : (
            faqs.map((faq, i) => (
              <div
                key={"id" in faq ? faq.id : i}
                className="bg-white rounded-2xl border border-border p-6 shadow-sm"
              >
                <h2 className="font-serif text-lg font-semibold text-brand-dark mb-2">{faq.question}</h2>
                <p className="text-brand-muted leading-relaxed text-sm">{faq.answer}</p>
              </div>
            ))
          )}

          <div className="pt-8 text-center">
            <p className="text-brand-muted mb-4">Still have a question?</p>
            <Link
              href="/contact/"
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
