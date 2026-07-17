"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col-reverse gap-3 md:flex-row">
      <div className="flex gap-3 overflow-x-auto md:flex-col md:overflow-visible">
        {images.map((img, index) => (
          <button
            key={img}
            onClick={() => setActive(index)}
            aria-label={`View image ${index + 1}`}
            aria-current={active === index}
            className={cn(
              "relative h-16 w-14 shrink-0 overflow-hidden rounded-sm border-2 cursor-pointer md:h-20 md:w-16",
              active === index ? "border-primary" : "border-transparent"
            )}
          >
            <Image src={img} alt={`${name} thumbnail ${index + 1}`} fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-muted">
        <Image
          src={images[active]}
          alt={`${name} - view ${active + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
