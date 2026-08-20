import { getThemeImage } from "@/lib/theme-images";

export type HeroImage = {
  title: string;
  subtitle: string;
  cta: { label: string; href: string };
  image: {
    src: string;
    alt: string;
    photographer?: string;
    photographer_url?: string | null;
  };
};

export async function getHeroImages(): Promise<HeroImage[]> {
  // Hardcoded hero data - in a real scenario, this might come from CMS
  const heroData = [
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

  return heroData.map((slide) => ({
    title: slide.title,
    subtitle: slide.subtitle,
    cta: slide.cta,
    image: getThemeImage("hero", slide.imageKey, {
      src: slide.fallback,
      alt: slide.title,
    }),
  }));
}