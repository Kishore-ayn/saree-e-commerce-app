import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getThemeImage } from "@/lib/theme-images";
import { OCCASION_ITEMS } from "@/data/theme-nav";

export function ShopByOccasion() {
  return (
    <section className="bg-muted/50 py-14 md:py-20" aria-labelledby="shop-by-occasion-heading">
      <div className="container-page">
        <SectionHeading
          eyebrow="Every Function, Sorted"
          title="Shop by Occasion"
          subtitle="From haldi mornings to reception nights, find wedding sarees Visakhapatnam brides and families trust for every function."
        />
        <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
          {OCCASION_ITEMS.map((occ) => {
            const image = getThemeImage("occasions", occ.key, {
              src: `https://placehold.co/500x650/7a1f35/d4b876.png?text=${encodeURIComponent(occ.label)}`,
              alt: `${occ.label} sarees`,
            });

            return (
              <Link key={occ.key} href={occ.href} className="group block text-center">
                <div className="relative mb-3 aspect-square overflow-hidden rounded-full bg-muted">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 640px) 30vw, 15vw"
                    loading="lazy"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent" />
                </div>
                <span className="text-xs font-medium text-foreground group-hover:text-primary md:text-sm">
                  {occ.label}
                </span>
                <span className="mt-0.5 block text-[10px] text-muted-foreground md:text-xs">
                  {occ.subtitle}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
