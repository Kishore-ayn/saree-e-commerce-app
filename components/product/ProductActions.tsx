"use client";

import { useState } from "react";
import { Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function ProductActions({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const addToCart = useStore((s) => s.addToCart);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const isWishlisted = useStore((s) => s.wishlist.includes(product.id));

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Color: <span className="text-foreground">{selectedColor}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {product.colors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              aria-pressed={selectedColor === color}
              className={cn(
                "rounded-full border px-4 py-2 text-sm cursor-pointer",
                selectedColor === color
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-foreground hover:border-primary"
              )}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quantity</p>
        <div className="inline-flex items-center rounded-sm border border-border">
          <button
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-11 w-11 items-center justify-center cursor-pointer"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center text-sm">{quantity}</span>
          <button
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => q + 1)}
            className="flex h-11 w-11 items-center justify-center cursor-pointer"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          size="lg"
          className="flex-1"
          onClick={() => addToCart(product, quantity)}
          disabled={!product.inStock}
        >
          <ShoppingBag className="h-4 w-4" />
          {product.inStock ? "Add to Bag" : "Out of Stock"}
        </Button>
        <button
          onClick={() => toggleWishlist(product.id)}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={isWishlisted}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-border cursor-pointer"
        >
          <Heart className={cn("h-5 w-5", isWishlisted ? "fill-primary text-primary" : "text-foreground")} />
        </button>
      </div>
    </div>
  );
}
