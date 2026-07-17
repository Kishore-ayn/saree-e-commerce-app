"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Heart, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";

const items = [
  { label: "Home", href: "/", icon: Home },
  { label: "Categories", href: "/collections/new-arrivals", icon: LayoutGrid },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
  { label: "Bag", href: "#cart", icon: ShoppingBag },
  { label: "Account", href: "/contact", icon: User },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();
  const cartCount = useStore((s) => s.cartCount());
  const wishlistCount = useStore((s) => s.wishlist.length);
  const openCart = useStore((s) => s.openCart);

  return (
    <nav
      aria-label="Primary mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-stretch border-t border-border bg-card md:hidden"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = item.href !== "#cart" && pathname === item.href;
        const count = item.label === "Wishlist" ? wishlistCount : item.label === "Bag" ? cartCount : 0;

        if (item.href === "#cart") {
          return (
            <button
              key={item.label}
              type="button"
              onClick={openCart}
              aria-label="Open shopping bag"
              className="relative flex flex-1 min-h-11 flex-col items-center justify-center gap-1 text-muted-foreground cursor-pointer"
            >
              <span className="relative">
                <Icon className="h-5 w-5" aria-hidden />
                {count > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                    {count}
                  </span>
                )}
              </span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "relative flex flex-1 min-h-11 flex-col items-center justify-center gap-1",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <span className="relative">
              <Icon className="h-5 w-5" aria-hidden />
              {count > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                  {count}
                </span>
              )}
            </span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
