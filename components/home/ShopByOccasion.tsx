import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";

const occasions = [
  { label: "Wedding", href: "/collections/wedding-sarees", image: "https://placehold.co/500x650/7a1f35/d4b876.png?text=Wedding" },
  { label: "Haldi", href: "/collections/festive-sarees", image: "https://placehold.co/500x650/c9932e/5c1728.png?text=Haldi" },
  { label: "Mehendi", href: "/collections/fancy-sarees", image: "https://placehold.co/500x650/3f6b4a/d4b876.png?text=Mehendi" },
  { label: "Sangeet", href: "/collections/party-wear-sarees", image: "https://placehold.co/500x650/5b2a7a/d4b876.png?text=Sangeet" },
  { label: "Reception", href: "/collections/reception-sarees", image: "https://placehold.co/500x650/6b1a2e/d4b876.png?text=Reception" },
  { label: "Festive", href: "/collections/festive-sarees", image: "https://placehold.co/500x650/0e6e6e/d4b876.png?text=Festive" },
];

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
          {occasions.map((occ) => (
            <Link key={occ.label} href={occ.href} className="group block text-center">
              <div className="relative mb-3 aspect-square overflow-hidden rounded-full bg-muted">
                <Image
                  src={occ.image}
                  alt={`${occ.label} sarees`}
                  fill
                  sizes="(max-width: 640px) 30vw, 15vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
              <span className="text-xs font-medium text-foreground group-hover:text-primary md:text-sm">
                {occ.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
