import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ProductCarousel({
  eyebrow,
  title,
  subtitle,
  products,
  viewAllHref,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref: string;
}) {
  return (
    <section className="container-page py-14 md:py-20">
      <div className="mb-8 flex items-end justify-between gap-4 md:mb-10">
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} align="left" className="mb-0" />
        <Link
          href={viewAllHref}
          className="hidden shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline md:flex"
        >
          View All <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="scrollbar-hide -mx-4 flex gap-4 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:px-0">
        {products.map((product) => (
          <div key={product.id} className="w-40 shrink-0 sm:w-56 md:w-auto">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      <div className="mt-6 text-center md:hidden">
        <Link href={viewAllHref} className="inline-flex items-center gap-1 text-sm font-medium text-primary">
          View All <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
