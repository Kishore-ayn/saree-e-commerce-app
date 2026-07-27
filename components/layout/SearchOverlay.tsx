"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { searchProducts, searchCollections, POPULAR_SEARCHES } from "@/lib/search";
import { getDedicatedProductImage } from "@/lib/product-images";
import { getSareeImagesForProduct } from "@/lib/sarees-manifest";
import { formatPrice } from "@/lib/utils";
import { useMounted } from "@/lib/use-mounted";
import type { Product, Collection } from "@/lib/types";

function resultImage(product: Product) {
  return (
    getDedicatedProductImage(product.slug) ??
    getSareeImagesForProduct(product.id, 1)[0] ?? {
      src: product.images[0],
      alt: product.name,
    }
  );
}

export function SearchOverlay({
  isOpen,
  onClose,
  allProducts,
  allCollections,
}: {
  isOpen: boolean;
  onClose: () => void;
  allProducts: Product[];
  allCollections: Collection[];
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const mounted = useMounted();
  const router = useRouter();

  const products = useMemo(() => searchProducts(query, allProducts), [query, allProducts]);
  const collectionMatches = useMemo(
    () => searchCollections(query, allCollections),
    [query, allCollections]
  );
  const hasQuery = query.trim().length > 0;
  const hasResults = products.length > 0 || collectionMatches.length > 0;

  function handleClose() {
    setQuery("");
    onClose();
  }

  // The overlay unmounts as soon as handleClose() runs. If we let a plain
  // <Link> handle navigation itself, closing the overlay synchronously in
  // its own onClick can unmount the anchor before the browser processes the
  // click's default navigation, silently dropping it. Driving navigation
  // through the router explicitly avoids depending on the anchor surviving.
  function handleNavigate(href: string) {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      handleClose();
      router.push(href);
    };
  }

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setQuery("");
        onClose();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Search sarees">
      <button
        aria-label="Close search"
        onClick={handleClose}
        className="absolute inset-0 bg-foreground/40 cursor-pointer"
      />
      <div className="animate-menu-in relative mx-auto mt-0 flex max-h-svh w-full flex-col overflow-hidden bg-card shadow-lg sm:mt-20 sm:max-h-[80svh] sm:max-w-2xl sm:rounded-sm">
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for sarees, fabrics, occasions..."
            className="min-h-11 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
            aria-label="Search query"
          />
          <button
            onClick={handleClose}
            aria-label="Close search"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-muted cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {!hasQuery && (
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gold">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleNavigate(item.href)}
                    className="rounded-full border border-border px-4 py-2 text-sm hover:border-primary hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {hasQuery && !hasResults && (
            <div className="py-10 text-center">
              <p className="text-sm text-muted-foreground">
                No results for &ldquo;{query}&rdquo;. Try a fabric, colour or occasion like &ldquo;silk&rdquo; or
                &ldquo;wedding&rdquo;.
              </p>
            </div>
          )}

          {collectionMatches.length > 0 && (
            <div className="mb-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gold">Collections</p>
              <div className="flex flex-wrap gap-2">
                {collectionMatches.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/collections/${c.slug}`}
                    onClick={handleNavigate(`/collections/${c.slug}`)}
                    className="rounded-full border border-border px-4 py-2 text-sm hover:border-primary hover:text-primary"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {products.length > 0 && (
            <div>
              {collectionMatches.length > 0 && (
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gold">Sarees</p>
              )}
              <ul className="space-y-1">
                {products.map((product) => {
                  const image = resultImage(product);
                  return (
                    <li key={product.id}>
                      <Link
                        href={`/products/${product.slug}`}
                        onClick={handleNavigate(`/products/${product.slug}`)}
                        className="flex items-center gap-3 rounded-sm p-2 hover:bg-muted"
                      >
                        <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-sm bg-muted">
                          <Image src={image.src} alt={image.alt} fill sizes="48px" className="object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.fabric}</p>
                        </div>
                        <p className="shrink-0 text-sm font-semibold text-foreground">
                          {formatPrice(product.price)}
                        </p>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
