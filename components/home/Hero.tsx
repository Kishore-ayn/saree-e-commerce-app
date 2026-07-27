"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { getThemeImage } from "@/lib/theme-images";

const slideMeta = [
  {
    title: "Timeless Silk, Woven for Visakhapatnam",
    subtitle: "The Best Saree Shop in Visakhapatnam for Bridal & Designer Silk Sarees",
    cta: { label: "Shop Bridal Sarees", href: "/collections/bridal-sarees" },
    imageKey: "hero-saree-closeup",
    fallback: "https://placehold.co/1600x900/7a1f35/f3e9da.png?text=Bridal+Kanjivaram+Silk",
  },
  {
    title: "New Arrivals, Fresh Off the Loom",
    subtitle: "Discover the Latest Saree Collection in Vizag",
    cta: { label: "Explore New Arrivals", href: "/collections/new-arrivals" },
    imageKey: "hero-fabric-texture",
    fallback: "https://placehold.co/1600x900/b08d3e/2a1a1a.png?text=New+Arrival+Sarees",
  },
  {
    title: "Everyday Elegance, Effortless Comfort",
    subtitle: "Cotton & Handloom Sarees for Vizag's Warm Days",
    cta: { label: "Shop Cotton Sarees", href: "/collections/cotton-sarees" },
    imageKey: "hero-silk-drape",
    fallback: "https://placehold.co/1600x900/2c4a6e/fbf7f0.png?text=Cotton+%26+Handloom+Sarees",
  },
] as const;

const slides = slideMeta.map((slide) => ({
  ...slide,
  image: getThemeImage("hero", slide.imageKey, { src: slide.fallback, alt: slide.title }),
}));

export function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[75svh] min-h-[480px] w-full overflow-hidden md:h-[80svh]" aria-label="Featured saree collections">
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
            src={slide.image.src}
            alt={slide.image.alt}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
          />
          {/* Bottom scrim: guarantees contrast for the text block regardless of breakpoint. */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
          {/* Left scrim (desktop only, where the text column sits narrower than the full-bleed image). */}
          <div className="absolute inset-0 hidden bg-gradient-to-r from-foreground/70 via-foreground/15 to-transparent md:block" />

          <div className="container-page absolute inset-0 flex flex-col items-start justify-end pb-20 text-primary-foreground sm:pb-16 md:pb-24">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold-light sm:tracking-[0.25em]">
              {slide.subtitle}
            </p>
            {index === 0 ? (
              <h1 className="max-w-xl font-heading text-3xl font-medium leading-tight sm:text-4xl md:text-6xl">
                {slide.title}
              </h1>
            ) : (
              <p
                className="max-w-xl font-heading text-3xl font-medium leading-tight sm:text-4xl md:text-6xl"
                role="heading"
                aria-level={2}
              >
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
