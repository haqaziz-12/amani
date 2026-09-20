"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { products as staticProducts } from "@/data/products";
import { Loader2 } from "lucide-react";

type LiveProduct = {
  id: string;
  slug: string;
  name: string;
  size: string | null;
  quality: string | null;
  collection: string | null;
  price_note: string | null;
  image_front: string | null;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<LiveProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, slug, name, size, quality, collection, price_note, image_front")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });

      if (!error && data && data.length > 0) {
        setProducts(data as LiveProduct[]);
      } else {
        setProducts(
          staticProducts.map((p) => ({
            id: p.id,
            slug: p.slug,
            name: p.name,
            size: p.size,
            quality: p.quality,
            collection: p.collection,
            price_note: p.priceNote,
            image_front: null,
          }))
        );
      }
      setLoading(false);
    };
    load();
  }, []);

  return (
    <>
      <section className="bg-brand-dark text-white py-16 md:py-20">
        <div className="container-wide px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Our Collection</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Fifteen carefully selected handmade carpets. Every piece is unique.
            All prices are available on enquiry.
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-wide">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}/`}
                  className="group bg-white rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  {/* Portrait ratio + object-contain so full carpet is visible */}
                  <div className="aspect-[3/4] relative bg-muted/60 overflow-hidden flex items-center justify-center p-3">
                    {product.image_front ? (
                      <Image
                        src={product.image_front}
                        alt={product.name}
                        fill
                        className="object-contain p-2 group-hover:scale-[1.02] transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        unoptimized
                      />
                    ) : (
                      <Image
                        src="/logo.svg"
                        alt=""
                        width={90}
                        height={90}
                        className="opacity-25 group-hover:scale-110 transition-transform duration-500"
                      />
                    )}
                    {product.collection && (
                      <span className="absolute top-3 left-3 bg-brand-red text-white text-xs font-medium px-3 py-1 rounded-full z-10">
                        {product.collection}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h2 className="font-serif text-lg font-semibold text-brand-dark group-hover:text-brand-red transition-colors mb-1">
                      {product.name}
                    </h2>
                    {product.size && <p className="text-sm text-brand-muted mb-1">{product.size}</p>}
                    {product.quality && <p className="text-sm text-brand-muted mb-2">{product.quality}</p>}
                    <p className="text-sm font-medium text-brand-red">
                      {product.price_note || "Price on Enquiry"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
