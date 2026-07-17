"use client";

import { useStore } from "@/lib/store";
import { products } from "@/data/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/Button";

export function WishlistContent() {
  const wishlist = useStore((s) => s.wishlist);
  const items = products.filter((p) => wishlist.includes(p.id));

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-muted-foreground">
          Your wishlist is empty. Start exploring our sarees and tap the heart icon to save your favourites.
        </p>
        <Button href="/collections/new-arrivals">Shop New Arrivals</Button>
      </div>
    );
  }

  return <ProductGrid products={items} />;
}
