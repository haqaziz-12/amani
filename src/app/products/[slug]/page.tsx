"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { products as staticProducts } from "@/data/products";
import { ArrowLeft, MessageCircle, Loader2 } from "lucide-react";

type LiveProduct = {
  id: string;
  slug: string;
  name: string;
  size: string | null;
  quality: string | null;
  materials: string | null;
  description: string | null;
  washing_type: string | null;
  collection: string | null;
  price_note: string | null;
  image_front: string | null;
  image_back: string | null;
  image_detail: string | null;
};

// Required for Next.js static export so all product routes are pre-generated
export function generateStaticParams() {
  return staticProducts.map((p) => ({ slug: p.slug }));
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const [product, setProduct] = useState<LiveProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const load = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();

      if (!error && data) {
        setProduct(data as LiveProduct);
      } else {
        // Fallback to static data
        const staticOne = staticProducts.find((p) => p.slug === slug);
        if (staticOne) {
          setProduct({
            id: staticOne.id,
            slug: staticOne.slug,
            name: staticOne.name,
            size: staticOne.size,
            quality: staticOne.quality,
            materials: staticOne.materials,
            description: staticOne.description,
            washing_type: staticOne.washingType,
            collection: staticOne.collection,
            price_note: staticOne.priceNote,
            image_front: null,
            image_back: null,
            image_detail: null,
          });
        } else {
          setNotFound(true);
        }
      }
      setLoading(false);
    };

    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-brand-muted">Product not found.</p>
        <Link href="/products/" className="text-brand-red font-medium hover:underline">
          Back to Collection
        </Link>
      </div>
    );
  }

  const frontImg = product.image_front;
  const backImg = product.image_back;
  const detailImg = product.image_detail;

  return (
    <>
      <section className="bg-brand-dark text-white py-8">
        <div className="container-wide px-4">
          <Link
            href="/products/"
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-brand-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Collection
          </Link>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="aspect-square relative bg-muted rounded-2xl overflow-hidden flex items-center justify-center border border-border">
                {frontImg ? (
                  <Image
                    src={frontImg}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <>
                    <Image src="/logo.svg" alt={product.name} width={200} height={200} className="opacity-30" />
                    <span className="absolute bottom-4 left-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                      Front View (upload via Admin)
                    </span>
                  </>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square relative bg-muted rounded-xl overflow-hidden flex items-center justify-center border border-border">
                  {backImg ? (
                    <Image src={backImg} alt="Back view" fill className="object-cover" sizes="25vw" />
                  ) : (
                    <>
                      <Image src="/logo.svg" alt="Back" width={100} height={100} className="opacity-25" />
                      <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">
                        Back
                      </span>
                    </>
                  )}
                </div>
                <div className="aspect-square relative bg-muted rounded-xl overflow-hidden flex items-center justify-center border border-border">
                  {detailImg ? (
                    <Image src={detailImg} alt="Detail view" fill className="object-cover" sizes="25vw" />
                  ) : (
                    <>
                      <Image src="/logo.svg" alt="Detail" width={100} height={100} className="opacity-25" />
                      <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">
                        Detail
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div>
              {product.collection && (
                <span className="inline-block bg-brand-red/10 text-brand-red text-sm font-medium px-3 py-1 rounded-full mb-3">
                  {product.collection}
                </span>
              )}
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark mb-4">
                {product.name}
              </h1>
              <p className="text-2xl font-semibold text-brand-red mb-6">
                {product.price_note || "Price on Enquiry"}
              </p>

              <dl className="space-y-4 mb-8">
                {product.size && (
                  <div>
                    <dt className="text-sm font-medium text-brand-muted">Size</dt>
                    <dd className="text-brand-dark">{product.size}</dd>
                  </div>
                )}
                {product.quality && (
                  <div>
                    <dt className="text-sm font-medium text-brand-muted">Quality</dt>
                    <dd className="text-brand-dark">{product.quality}</dd>
                  </div>
                )}
                {product.materials && (
                  <div>
                    <dt className="text-sm font-medium text-brand-muted">Materials</dt>
                    <dd className="text-brand-dark">{product.materials}</dd>
                  </div>
                )}
                {product.washing_type && (
                  <div>
                    <dt className="text-sm font-medium text-brand-muted">Washing / Care</dt>
                    <dd className="text-brand-dark">{product.washing_type}</dd>
                  </div>
                )}
              </dl>

              {product.description && (
                <div className="prose prose-sm max-w-none mb-8">
                  <h3 className="font-serif text-lg font-semibold text-brand-dark">Description</h3>
                  <p className="text-brand-muted leading-relaxed">{product.description}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://wa.me/93787567967?text=${encodeURIComponent(`Hello, I am interested in: ${product.name}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
                >
                  <MessageCircle className="w-5 h-5" />
                  Enquire on WhatsApp
                </a>
                <Link
                  href="/contact/"
                  className="inline-flex items-center justify-center gap-2 bg-brand-red text-white font-semibold px-6 py-3 rounded-full hover:bg-brand-red-dark transition-colors"
                >
                  Send Enquiry Form
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
