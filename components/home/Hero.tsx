"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const slides = [
  {
    title: "Timeless Silk, Woven for Visakhapatnam",
    subtitle: "The Best Saree Shop in Visakhapatnam for Bridal & Designer Silk Sarees",
    cta: { label: "Shop Bridal Sarees", href: "/collections/bridal-sarees" },
    image: "https://placehold.co/1600x900/7a1f35/f3e9da.png?text=Bridal+Kanjivaram+Silk",
  },
  {
    title: "New Arrivals, Fresh Off the Loom",
    subtitle: "Discover the Latest Saree Collection in Vizag",
    cta: { label: "Explore New Arrivals", href: "/collections/new-arrivals" },
    image: "https://placehold.co/1600x900/b08d3e/2a1a1a.png?text=New+Arrival+Sarees",
  },
  {
    title: "Everyday Elegance, Effortless Comfort",
    subtitle: "Cotton & Handloom Sarees for Vizag's Warm Days",
    cta: { label: "Shop Cotton Sarees", href: "/collections/cotton-sarees" },
    image: "https://placehold.co/1600x900/2c4a6e/fbf7f0.png?text=Cotton+%26+Handloom+Sarees",
  },
];

export function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[70svh] min-h-[420px] w-full overflow-hidden md:h-[80svh]" aria-label="Featured saree collections">
      {slides.map((slide, index) => (
        <div
          key={slide.title}
          className={cn(
            "absolute inset-0 transition-opacity duration-700 ease-out",
            index === active ? "opacity-100" : "opacity-0"
          )}
          aria-hidden={index !== active}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
          <div className="container-page absolute inset-0 flex flex-col items-start justify-end pb-16 text-primary-foreground md:pb-24">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold-light">
              {slide.subtitle}
            </p>
            {index === 0 ? (
              <h1 className="max-w-xl font-heading text-4xl font-medium leading-tight md:text-6xl">
                {slide.title}
              </h1>
            ) : (
              <p className="max-w-xl font-heading text-4xl font-medium leading-tight md:text-6xl" role="heading" aria-level={2}>
                {slide.title}
              </p>
            )}
            <Button href={slide.cta.href} size="lg" className="mt-6" variant="secondary">
              {slide.cta.label}
            </Button>
          </div>
        </div>
      ))}
      <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.title}
            onClick={() => setActive(index)}
            aria-label={`Show slide ${index + 1}`}
            aria-current={index === active}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
              index === active ? "w-8 bg-gold" : "w-1.5 bg-card/70"
            )}
          />
        ))}
      </div>
    </section>
  );
}
