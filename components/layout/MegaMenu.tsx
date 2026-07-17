import Image from "next/image";
import Link from "next/link";

interface MegaMenuColumn {
  heading: string;
  links: { label: string; href: string; image: string }[];
}

const columns: MegaMenuColumn[] = [
  {
    heading: "Shop by Fabric",
    links: [
      { label: "Kanchipuram Silk", href: "/collections/kanchipuram-silk-sarees", image: "https://placehold.co/200x260/7a1f35/f3e9da.png?text=Kanchipuram" },
      { label: "Banarasi Sarees", href: "/collections/banarasi-sarees", image: "https://placehold.co/200x260/5c1728/d4b876.png?text=Banarasi" },
      { label: "Soft Silk Sarees", href: "/collections/soft-silk-sarees", image: "https://placehold.co/200x260/6b1a2e/d4b876.png?text=Soft+Silk" },
      { label: "Cotton Sarees", href: "/collections/cotton-sarees", image: "https://placehold.co/200x260/2c4a6e/fbf7f0.png?text=Cotton" },
      { label: "Handloom Sarees", href: "/collections/handloom-sarees", image: "https://placehold.co/200x260/8a3a3a/d9cdb0.png?text=Handloom" },
    ],
  },
  {
    heading: "Shop by Occasion",
    links: [
      { label: "Wedding Sarees", href: "/collections/wedding-sarees", image: "https://placehold.co/200x260/7a1f35/d4b876.png?text=Wedding" },
      { label: "Bridal Sarees", href: "/collections/bridal-sarees", image: "https://placehold.co/200x260/6b1a2e/d4b876.png?text=Bridal" },
      { label: "Reception Sarees", href: "/collections/reception-sarees", image: "https://placehold.co/200x260/5b2a7a/d4b876.png?text=Reception" },
      { label: "Festive Sarees", href: "/collections/festive-sarees", image: "https://placehold.co/200x260/c9932e/5c1728.png?text=Festive" },
      { label: "Party Wear Sarees", href: "/collections/party-wear-sarees", image: "https://placehold.co/200x260/0e6e6e/d4b876.png?text=Party+Wear" },
      { label: "Office Wear Sarees", href: "/collections/office-wear-sarees", image: "https://placehold.co/200x260/2c4a6e/fbf7f0.png?text=Office+Wear" },
    ],
  },
  {
    heading: "Shop by Price",
    links: [
      { label: "New Arrivals", href: "/collections/new-arrivals", image: "https://placehold.co/200x260/b08d3e/2a1a1a.png?text=New+In" },
      { label: "Sarees Under ₹1000", href: "/collections/sarees-under-1000", image: "https://placehold.co/200x260/d9cdb0/2a1a1a.png?text=Under+%E2%82%B91000" },
      { label: "Sarees Under ₹2000", href: "/collections/sarees-under-2000", image: "https://placehold.co/200x260/e8d34a/2a1a1a.png?text=Under+%E2%82%B92000" },
      { label: "Daily Wear Sarees", href: "/collections/daily-wear-sarees", image: "https://placehold.co/200x260/d9c9b0/2a1a1a.png?text=Daily+Wear" },
    ],
  },
];

export function MegaMenu() {
  return (
    <div className="absolute left-0 top-full w-full border-t border-border bg-card shadow-lg">
      <div className="container-page grid grid-cols-3 gap-8 py-8">
        {columns.map((column) => (
          <div key={column.heading}>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gold">
              {column.heading}
            </h3>
            <ul className="grid grid-cols-3 gap-4">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="group block">
                    <div className="relative mb-2 aspect-[3/4] overflow-hidden rounded-sm bg-muted">
                      <Image
                        src={link.image}
                        alt={link.label}
                        fill
                        sizes="120px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <span className="text-xs font-medium text-foreground group-hover:text-primary">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
