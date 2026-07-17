"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { useEffect } from "react";

export function CartDrawer() {
  const isOpen = useStore((s) => s.isCartOpen);
  const closeCart = useStore((s) => s.closeCart);
  const cart = useStore((s) => s.cart);
  const updateQuantity = useStore((s) => s.updateQuantity);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const cartTotal = useStore((s) => s.cartTotal());

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        aria-label="Close cart"
        onClick={closeCart}
        className="absolute inset-0 bg-foreground/40 cursor-pointer"
      />
      <div className="relative flex h-full w-full max-w-md flex-col bg-card animate-fade-in">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-lg font-medium">Your Bag ({cart.length})</h2>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-muted-foreground">Your bag is empty.</p>
            <Button href="/collections/new-arrivals" onClick={closeCart}>
              Start Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="space-y-5">
                {cart.map((item) => (
                  <li key={item.product.id} className="flex gap-3">
                    <Link
                      href={`/products/${item.product.slug}`}
                      onClick={closeCart}
                      className="relative h-24 w-20 shrink-0 overflow-hidden rounded-sm bg-muted"
                    >
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <Link
                          href={`/products/${item.product.slug}`}
                          onClick={closeCart}
                          className="text-sm font-medium text-foreground line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-xs text-muted-foreground">{item.product.fabric}</p>
                        <p className="mt-1 text-sm font-semibold">{formatPrice(item.product.price)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center rounded-sm border border-border">
                          <button
                            aria-label="Decrease quantity"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="flex h-8 w-8 items-center justify-center cursor-pointer"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
                          <button
                            aria-label="Increase quantity"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="flex h-8 w-8 items-center justify-center cursor-pointer"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          aria-label="Remove item"
                          onClick={() => removeFromCart(item.product.id)}
                          className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-destructive cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-border px-5 py-4">
              <div className="mb-4 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-lg font-semibold">{formatPrice(cartTotal)}</span>
              </div>
              <p className="mb-4 text-xs text-muted-foreground">
                Shipping and taxes calculated at checkout. This is a demo store — checkout is not enabled.
              </p>
              <Button className="w-full" size="lg">
                Checkout
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
