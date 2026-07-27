import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getThemeImage } from "@/lib/theme-images";
import { CATEGORY_ITEMS } from "@/data/theme-nav";

export function ShopByCategory() {
  return (
    <section className="container-page py-14 md:py-20" aria-labelledby="shop-by-category-heading">
      <SectionHeading
        eyebrow="Curated For You"
        title="Shop by Category"
        subtitle="Explore our designer sarees Visakhapatnam collection, spanning traditional silk weaves to everyday comfort fabrics."
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
        {CATEGORY_ITEMS.map((cat) => {
          const image = getThemeImage("categories", cat.key, {
            src: `https://placehold.co/500x650/7a1f35/f3e9da.png?text=${encodeURIComponent(cat.label)}`,
            alt: `${cat.label} sarees Visakhapatnam`,
          });

          return (
            <Link
              key={cat.href}
              href={cat.href}
              className="group relative block aspect-[3/4] overflow-hidden rounded-sm bg-muted"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 15vw"
                loading="lazy"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/10 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 p-3 text-sm font-medium text-primary-foreground md:p-4 md:text-base">
                {cat.label}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
