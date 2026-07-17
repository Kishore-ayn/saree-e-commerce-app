"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Heart, ShoppingBag, Menu, X, Phone } from "lucide-react";
import { siteConfig, NAV_LINKS } from "@/lib/site-config";
import { useStore } from "@/lib/store";
import { MegaMenu } from "@/components/layout/MegaMenu";
import { cn } from "@/lib/utils";

export function Header() {
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = useStore((s) => s.cartCount());
  const wishlistCount = useStore((s) => s.wishlist.length);
  const openCart = useStore((s) => s.openCart);

  return (
    <header className="sticky top-0 z-30 bg-card/95 backdrop-blur">
      <div className="hidden bg-primary py-2 text-center text-xs text-primary-foreground md:block">
        Free shipping across Visakhapatnam on orders above ₹2999 &nbsp;·&nbsp; Visit our Siripuram store today
      </div>

      <div className="container-page flex h-16 items-center justify-between gap-4 md:h-20">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="flex h-11 w-11 items-center justify-center md:hidden cursor-pointer"
        >
          <Menu className="h-6 w-6" />
        </button>

        <Link href="/" className="shrink-0">
          <span className="font-heading text-xl font-semibold tracking-wide text-primary md:text-2xl">
            Siva Prakash
          </span>
          <span className="block text-center text-[10px] uppercase tracking-[0.3em] text-gold">
            Sarees
          </span>
        </Link>

        <nav
          className="relative hidden flex-1 items-center justify-center gap-8 md:flex"
          onMouseEnter={() => setMegaOpen(true)}
          onMouseLeave={() => setMegaOpen(false)}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          <div className={cn(megaOpen ? "block" : "hidden")}>
            <MegaMenu />
          </div>
        </nav>

        <div className="flex items-center gap-1 md:gap-2">
          <a
            href={`tel:${siteConfig.phoneRaw}`}
            className="hidden h-11 w-11 items-center justify-center rounded-full hover:bg-muted md:flex"
            aria-label="Call the store"
          >
            <Phone className="h-5 w-5" />
          </a>
          <button
            type="button"
            aria-label="Search"
            className="hidden h-11 w-11 items-center justify-center rounded-full hover:bg-muted md:flex cursor-pointer"
          >
            <Search className="h-5 w-5" />
          </button>
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="relative hidden h-11 w-11 items-center justify-center rounded-full hover:bg-muted md:flex"
          >
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                {wishlistCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={openCart}
            aria-label="Open shopping bag"
            className="relative flex h-11 w-11 items-center justify-center rounded-full hover:bg-muted cursor-pointer"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <button
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-foreground/40 cursor-pointer"
          />
          <div className="relative flex h-full w-72 flex-col overflow-y-auto bg-card p-5 animate-fade-in">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-heading text-lg font-semibold text-primary">Menu</span>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <ul className="space-y-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block min-h-11 rounded-sm px-2 py-3 text-sm font-medium text-foreground hover:bg-muted"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-border pt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gold">
                We Deliver Across Visakhapatnam
              </p>
              <Link
                href="/saree-shop/siripuram"
                onClick={() => setMobileOpen(false)}
                className="text-sm text-foreground underline"
              >
                View all Vizag area pages
              </Link>
            </div>
            <a
              href={`tel:${siteConfig.phoneRaw}`}
              className="mt-6 flex min-h-11 items-center gap-2 rounded-sm border border-border px-3 py-2 text-sm"
            >
              <Phone className="h-4 w-4" /> {siteConfig.phone}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
