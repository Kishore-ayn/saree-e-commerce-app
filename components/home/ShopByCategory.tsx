import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";

const categories = [
  { label: "Kanchipuram Silk", href: "/collections/kanchipuram-silk-sarees", image: "https://placehold.co/500x650/7a1f35/f3e9da.png?text=Kanchipuram+Silk" },
  { label: "Banarasi Sarees", href: "/collections/banarasi-sarees", image: "https://placehold.co/500x650/5c1728/d4b876.png?text=Banarasi" },
  { label: "Soft Silk Sarees", href: "/collections/soft-silk-sarees", image: "https://placehold.co/500x650/6b1a2e/d4b876.png?text=Soft+Silk" },
  { label: "Cotton Sarees", href: "/collections/cotton-sarees", image: "https://placehold.co/500x650/2c4a6e/fbf7f0.png?text=Cotton" },
  { label: "Handloom Sarees", href: "/collections/handloom-sarees", image: "https://placehold.co/500x650/8a3a3a/d9cdb0.png?text=Handloom" },
  { label: "Georgette Sarees", href: "/collections/georgette-sarees", image: "https://placehold.co/500x650/1f3a6e/d4b876.png?text=Georgette" },
];

export function ShopByCategory() {
  return (
    <section className="container-page py-14 md:py-20" aria-labelledby="shop-by-category-heading">
      <SectionHeading
        eyebrow="Curated For You"
        title="Shop by Category"
        subtitle="Explore our designer sarees Visakhapatnam collection, spanning traditional silk weaves to everyday comfort fabrics."
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
        {categories.map((cat) => (
          <Link key={cat.href} href={cat.href} className="group block text-center">
            <div className="relative mb-3 aspect-[3/4] overflow-hidden rounded-sm bg-muted">
              <Image
                src={cat.image}
                alt={`${cat.label} sarees Visakhapatnam`}
                fill
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 15vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>
            <span className="text-sm font-medium text-foreground group-hover:text-primary">
              {cat.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
