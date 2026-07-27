import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { ShopByCategory } from "@/components/home/ShopByCategory";
import { ShopByOccasion } from "@/components/home/ShopByOccasion";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { TrustBadges } from "@/components/home/TrustBadges";
import { HomeSeoContent } from "@/components/home/HomeSeoContent";
import { getProducts } from "@/lib/cms/products";

export const metadata: Metadata = {
  title: "Best Saree Shop in Visakhapatnam | Designer & Silk Sarees",
  description:
    "Shop the best saree shop in Visakhapatnam for designer sarees, silk sarees, wedding and bridal sarees. Visit our Vizag store or shop online with delivery citywide.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Best Saree Shop in Visakhapatnam | Designer & Silk Sarees",
    description:
      "Shop the best saree shop in Visakhapatnam for designer sarees, silk sarees, wedding and bridal sarees.",
    url: "/",
  },
};

export default async function Home() {
  const products = await getProducts();
  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 8);
  const bestsellers = products.filter((p) => p.isBestseller).slice(0, 8);

  return (
    <>
      <Hero />
      <TrustBadges />
      <ShopByCategory />
      <ShopByOccasion />
      <ProductCarousel
        eyebrow="Fresh In"
        title="New Arrivals"
        subtitle="The latest saree collection in Vizag, updated regularly."
        products={newArrivals}
        viewAllHref="/collections/new-arrivals"
      />
      <ProductCarousel
        eyebrow="Customer Favourites"
        title="Bestsellers"
        subtitle="The silk and designer sarees Visakhapatnam shoppers love most."
        products={bestsellers}
        viewAllHref="/collections/soft-silk-sarees"
      />
      <HomeSeoContent />
    </>
  );
}
