"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { megaMenuColumns, thumbnailFor, getFeaturedMenuImage } from "@/lib/mega-menu-data";
import { cn } from "@/lib/utils";

/** Mobile fallback for the desktop hover mega-menu: tap-to-expand accordion, same thumbnails. */
export function MobileMegaAccordion({ onNavigate }: { onNavigate: () => void }) {
  const [openHeading, setOpenHeading] = useState<string | null>(null);
  const featuredImage = getFeaturedMenuImage();

  return (
    <div className="border-b border-border pb-2">
      <Link
        href="/collections/new-arrivals"
        onClick={onNavigate}
        className="mb-2 flex items-center gap-3 rounded-sm p-2 hover:bg-muted"
      >
        <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-sm bg-muted">
          <Image
            src={featuredImage.src}
            alt={featuredImage.alt}
            fill
            sizes="44px"
            loading="eager"
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">New Arrivals</p>
          <p className="text-xs text-muted-foreground">Fresh off the loom this week</p>
        </div>
      </Link>

      {megaMenuColumns.map((column) => {
        const isOpen = openHeading === column.heading;
        return (
          <div key={column.heading}>
            <button
              type="button"
              onClick={() => setOpenHeading(isOpen ? null : column.heading)}
              aria-expanded={isOpen}
              className="flex min-h-11 w-full items-center justify-between rounded-sm px-2 py-3 text-sm font-medium text-foreground hover:bg-muted cursor-pointer"
            >
              {column.heading}
              <ChevronDown
                className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", isOpen && "rotate-180")}
                aria-hidden
              />
            </button>
            {isOpen && (
              <ul className="animate-fade-in grid grid-cols-3 gap-3 px-2 pb-4">
                {column.links.map((link) => {
                  const thumb = thumbnailFor(link);
                  return (
                    <li key={link.href + link.label}>
                      <Link href={link.href} onClick={onNavigate} className="block">
                        <div className="relative mb-1.5 aspect-[3/4] overflow-hidden rounded-sm bg-muted">
                          <Image
                            src={thumb.src}
                            alt={thumb.alt}
                            fill
                            sizes="100px"
                            loading="eager"
                            className="object-cover"
                          />
                        </div>
                        <span className="text-[11px] font-medium leading-tight text-foreground">{link.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
