"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { Product } from "@/lib/types";
import { useStore } from "@/lib/store";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { PriceTag } from "@/components/ui/PriceTag";
import { discountPercent, cn } from "@/lib/utils";
import { getSareeImagesForProduct } from "@/lib/sarees-manifest";
import { getDedicatedProductImage } from "@/lib/product-images";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const isWishlisted = useStore((s) => s.wishlist.includes(product.id));
  const discount = discountPercent(product.price, product.mrp);

  // CMS-managed images (set via the admin Media Library) take priority
  // when present; falls back to the curated dedicated/pool photos for
  // products that haven't had images assigned through the CMS yet.
  const hasCmsImages = product.images.length > 0;
  const dedicatedImage = hasCmsImages ? null : getDedicatedProductImage(product.slug);
  const manifestImages = hasCmsImages || dedicatedImage ? [] : getSareeImagesForProduct(product.id, 2);
  const primaryImage = dedicatedImage ??
    manifestImages[0] ?? {
      src: product.images[0],
      alt: `${product.name} - ${product.fabric} saree in ${product.colors[0]}, Visakhapatnam`,
    };
  const secondaryImage = dedicatedImage
    ? null
    : (manifestImages[1] ?? (product.images[1] ? { src: product.images[1], alt: `${product.name} pallu detail` } : null));

  return (
    <div className="group relative">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-muted">
          <Image
            src={primaryImage.src}
            alt={primaryImage.alt}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          {secondaryImage && (
            <Image
              src={secondaryImage.src}
              alt={secondaryImage.alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
            />
          )}
          <div className="absolute left-2 top-2 flex flex-col gap-1.5">
            {product.isNewArrival && <Badge variant="new">New</Badge>}
            {product.isBestseller && <Badge variant="bestseller">Bestseller</Badge>}
            {discount > 0 && <Badge variant="sale">{discount}% Off</Badge>}
          </div>
        </div>
      </Link>
      <button
        type="button"
        onClick={() => toggleWishlist(product.id)}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={isWishlisted}
        className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-card/90 text-foreground shadow-sm transition-transform duration-150 hover:scale-105 cursor-pointer"
      >
        <Heart className={cn("h-4 w-4", isWishlisted ? "fill-primary text-primary" : "text-foreground")} />
      </button>

      <div className="mt-3 space-y-1.5">
        <Link href={`/products/${product.slug}`}>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{product.fabric}</p>
          <h3 className="text-sm font-medium text-foreground line-clamp-1 md:text-base">{product.name}</h3>
        </Link>
        <StarRating rating={product.rating} reviewCount={product.reviewCount} />
        <PriceTag price={product.price} mrp={product.mrp} />
      </div>
    </div>
  );
}
