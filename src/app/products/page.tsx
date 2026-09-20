import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse our collection of 15 authentic handmade Afghan carpets from Khalaj Amani Carpets. Hand-knotted wool, silk blends, kilims and bespoke commissions. Price on enquiry.",
};

export default function ProductsPage() {
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[4/3] relative bg-muted overflow-hidden flex items-center justify-center">
                  <Image
                    src="/logo.jpg"
                    alt=""
                    width={90}
                    height={90}
                    className="opacity-25 group-hover:scale-110 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-brand-red text-white text-xs font-medium px-3 py-1 rounded-full">
                    {product.collection}
                  </span>
                </div>
                <div className="p-5">
                  <h2 className="font-serif text-lg font-semibold text-brand-dark group-hover:text-brand-red transition-colors mb-1">
                    {product.name}
                  </h2>
                  <p className="text-sm text-brand-muted mb-1">{product.size}</p>
                  <p className="text-sm text-brand-muted mb-2">{product.quality}</p>
                  <p className="text-sm font-medium text-brand-red">{product.priceNote}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
