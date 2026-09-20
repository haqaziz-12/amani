import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import { ArrowLeft, MessageCircle } from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  return (
    <>
      <section className="bg-brand-dark text-white py-8">
        <div className="container-wide px-4">
          <Link
            href="/products"
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
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square relative bg-muted rounded-2xl overflow-hidden flex items-center justify-center border border-border">
                <Image src="/logo.jpg" alt={product.name} width={200} height={200} className="opacity-30" />
                <span className="absolute bottom-4 left-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                  Front View (replace via Admin)
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square relative bg-muted rounded-xl overflow-hidden flex items-center justify-center border border-border">
                  <Image src="/logo.jpg" alt="Back" width={100} height={100} className="opacity-25" />
                  <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">Back</span>
                </div>
                <div className="aspect-square relative bg-muted rounded-xl overflow-hidden flex items-center justify-center border border-border">
                  <Image src="/logo.jpg" alt="Detail" width={100} height={100} className="opacity-25" />
                  <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">Detail</span>
                </div>
              </div>
            </div>

            {/* Details */}
            <div>
              <span className="inline-block bg-brand-red/10 text-brand-red text-sm font-medium px-3 py-1 rounded-full mb-3">
                {product.collection}
              </span>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark mb-4">
                {product.name}
              </h1>
              <p className="text-2xl font-semibold text-brand-red mb-6">{product.priceNote}</p>

              <dl className="space-y-4 mb-8">
                <div>
                  <dt className="text-sm font-medium text-brand-muted">Size</dt>
                  <dd className="text-brand-dark">{product.size}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-brand-muted">Quality</dt>
                  <dd className="text-brand-dark">{product.quality}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-brand-muted">Materials</dt>
                  <dd className="text-brand-dark">{product.materials}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-brand-muted">Washing / Care</dt>
                  <dd className="text-brand-dark">{product.washingType}</dd>
                </div>
              </dl>

              <div className="prose prose-sm max-w-none mb-8">
                <h3 className="font-serif text-lg font-semibold text-brand-dark">Description</h3>
                <p className="text-brand-muted leading-relaxed">{product.description}</p>
              </div>

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
                  href="/contact"
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
