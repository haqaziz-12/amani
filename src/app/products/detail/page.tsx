"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import ProductDetailClient from "../[slug]/ProductDetailClient";

function DetailInner() {
  const searchParams = useSearchParams();
  const slug = (searchParams.get("slug") || "").trim();

  if (!slug) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-brand-muted">No product selected.</p>
        <a href="/products/" className="text-brand-red font-medium hover:underline">
          Back to Collection
        </a>
      </div>
    );
  }

  return <ProductDetailClient slug={slug} />;
}

export default function ProductDetailByQueryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
        </div>
      }
    >
      <DetailInner />
    </Suspense>
  );
}
