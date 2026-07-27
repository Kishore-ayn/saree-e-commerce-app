import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { megaMenuColumns, thumbnailFor, getFeaturedMenuImage } from "@/lib/mega-menu-data";

export function MegaMenu() {
  const featuredImage = getFeaturedMenuImage();

  return (
    <div
      role="menu"
      className="animate-menu-in absolute left-0 top-full w-full border-t border-border bg-card shadow-lg"
    >
      <div className="container-page flex gap-10 py-8">
        <div className="grid flex-1 grid-cols-3 gap-8">
          {megaMenuColumns.map((column) => (
            <div key={column.heading}>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gold">
                {column.heading}
              </h3>
              <ul className="grid grid-cols-3 gap-4">
                {column.links.map((link) => {
                  const thumb = thumbnailFor(link);
                  return (
                    <li key={link.href + link.label}>
                      <Link href={link.href} role="menuitem" className="group block">
                        <div className="relative mb-2 aspect-[3/4] overflow-hidden rounded-sm bg-muted">
                          <Image
                            src={thumb.src}
                            alt={thumb.alt}
                            fill
                            sizes="120px"
                            loading="eager"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <span className="text-xs font-medium text-foreground group-hover:text-primary">
                          {link.label}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="w-56 shrink-0 border-l border-border pl-8">
          <Link href="/collections/new-arrivals" role="menuitem" className="group block">
            <div className="relative mb-3 aspect-[3/4] overflow-hidden rounded-sm bg-muted">
              <Image
                src={featuredImage.src}
                alt={featuredImage.alt}
                fill
                sizes="224px"
                loading="eager"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="font-heading text-lg font-medium text-primary-foreground">New Arrivals</p>
                <p className="mt-0.5 text-xs text-primary-foreground/85">Fresh off the loom this week</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-primary group-hover:underline">
              Shop New In <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
