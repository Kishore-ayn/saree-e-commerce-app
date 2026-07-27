import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WishlistContent } from "@/components/wishlist/WishlistContent";
import { getProducts } from "@/lib/cms/products";

export const metadata: Metadata = {
  title: "My Wishlist",
  description: "View and manage your saved sarees at Kishore Sarees, Visakhapatnam.",
  alternates: { canonical: "/wishlist" },
  robots: { index: false, follow: true },
};

export default async function WishlistPage() {
  const products = await getProducts();

  return (
    <>
      <Breadcrumbs items={[{ label: "Wishlist" }]} />
      <div className="container-page py-10 md:py-14">
        <SectionHeading as="h1" align="left" title="My Wishlist" />
        <WishlistContent products={products} />
      </div>
    </>
  );
}
