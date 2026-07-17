"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import type { Product, Fabric, Occasion, ProductColor } from "@/lib/types";
import { ProductGrid } from "@/components/product/ProductGrid";
import { cn } from "@/lib/utils";

type SortOption = "featured" | "price-asc" | "price-desc" | "rating";

const colorSwatch: Record<ProductColor, string> = {
  Red: "#c23b3b",
  Maroon: "#7a1f35",
  Gold: "#b08d3e",
  Green: "#2c5e2c",
  Blue: "#2c4a6e",
  Pink: "#d94f8a",
  Purple: "#5b2a7a",
  Orange: "#d97a2e",
  Yellow: "#e8d34a",
  Black: "#1a1a1a",
  White: "#f5f0e6",
  Beige: "#d9cdb0",
  Peach: "#e8b89a",
  Teal: "#0e6e6e",
  Mustard: "#c99a2e",
};

const priceRanges = [
  { label: "Under ₹1,000", min: 0, max: 1000 },
  { label: "₹1,000 – ₹5,000", min: 1000, max: 5000 },
  { label: "₹5,000 – ₹15,000", min: 5000, max: 15000 },
  { label: "Above ₹15,000", min: 15000, max: Infinity },
];

function FilterPanel({
  fabrics,
  occasions,
  colors,
  activeFabrics,
  activeOccasions,
  activeColors,
  activePriceIndex,
  onToggleFabric,
  onToggleOccasion,
  onToggleColor,
  onSetPrice,
  onClear,
}: {
  fabrics: Fabric[];
  occasions: Occasion[];
  colors: ProductColor[];
  activeFabrics: Set<string>;
  activeOccasions: Set<string>;
  activeColors: Set<string>;
  activePriceIndex: number | null;
  onToggleFabric: (v: string) => void;
  onToggleOccasion: (v: string) => void;
  onToggleColor: (v: string) => void;
  onSetPrice: (i: number | null) => void;
  onClear: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Filters</h3>
        <button onClick={onClear} className="text-xs text-primary underline cursor-pointer">
          Clear all
        </button>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fabric</p>
        <ul className="space-y-2">
          {fabrics.map((fabric) => (
            <li key={fabric}>
              <label className="flex min-h-6 cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={activeFabrics.has(fabric)}
                  onChange={() => onToggleFabric(fabric)}
                  className="h-4 w-4 accent-primary"
                />
                {fabric}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Occasion</p>
        <ul className="space-y-2">
          {occasions.map((occasion) => (
            <li key={occasion}>
              <label className="flex min-h-6 cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={activeOccasions.has(occasion)}
                  onChange={() => onToggleOccasion(occasion)}
                  className="h-4 w-4 accent-primary"
                />
                {occasion}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Color</p>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => onToggleColor(color)}
              aria-label={color}
              aria-pressed={activeColors.has(color)}
              title={color}
              style={{ backgroundColor: colorSwatch[color] }}
              className={cn(
                "h-8 w-8 rounded-full border-2 transition-transform cursor-pointer",
                activeColors.has(color) ? "border-primary scale-110" : "border-border"
              )}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Price</p>
        <ul className="space-y-2">
          {priceRanges.map((range, index) => (
            <li key={range.label}>
              <label className="flex min-h-6 cursor-pointer items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="price"
                  checked={activePriceIndex === index}
                  onChange={() => onSetPrice(index)}
                  className="h-4 w-4 accent-primary"
                />
                {range.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function CollectionExplorer({ products }: { products: Product[] }) {
  const [activeFabrics, setActiveFabrics] = useState<Set<string>>(new Set());
  const [activeOccasions, setActiveOccasions] = useState<Set<string>>(new Set());
  const [activeColors, setActiveColors] = useState<Set<string>>(new Set());
  const [activePriceIndex, setActivePriceIndex] = useState<number | null>(null);
  const [sort, setSort] = useState<SortOption>("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const fabrics = useMemo(
    () => Array.from(new Set(products.map((p) => p.fabric))).sort(),
    [products]
  );
  const occasions = useMemo(
    () => Array.from(new Set(products.flatMap((p) => p.occasions))).sort(),
    [products]
  );
  const colors = useMemo(
    () => Array.from(new Set(products.flatMap((p) => p.colors))).sort(),
    [products]
  );

  function toggle(set: Set<string>, setter: (s: Set<string>) => void, value: string) {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
  }

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      if (activeFabrics.size > 0 && !activeFabrics.has(p.fabric)) return false;
      if (activeOccasions.size > 0 && !p.occasions.some((o) => activeOccasions.has(o))) return false;
      if (activeColors.size > 0 && !p.colors.some((c) => activeColors.has(c))) return false;
      if (activePriceIndex !== null) {
        const range = priceRanges[activePriceIndex];
        if (p.price < range.min || p.price >= range.max) return false;
      }
      return true;
    });

    result = [...result];
    if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sort === "rating") result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [products, activeFabrics, activeOccasions, activeColors, activePriceIndex, sort]);

  function clearAll() {
    setActiveFabrics(new Set());
    setActiveOccasions(new Set());
    setActiveColors(new Set());
    setActivePriceIndex(null);
  }

  const activeCount =
    activeFabrics.size + activeOccasions.size + activeColors.size + (activePriceIndex !== null ? 1 : 0);

  const filterProps = {
    fabrics,
    occasions,
    colors,
    activeFabrics,
    activeOccasions,
    activeColors,
    activePriceIndex,
    onToggleFabric: (v: string) => toggle(activeFabrics, setActiveFabrics, v),
    onToggleOccasion: (v: string) => toggle(activeOccasions, setActiveOccasions, v),
    onToggleColor: (v: string) => toggle(activeColors, setActiveColors, v),
    onSetPrice: setActivePriceIndex,
    onClear: clearAll,
  };

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr]">
      <aside className="hidden md:block">
        <FilterPanel {...filterProps} />
      </aside>

      <div>
        <div className="mb-6 flex items-center justify-between gap-3">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex min-h-11 items-center gap-2 rounded-sm border border-border px-4 text-sm font-medium md:hidden cursor-pointer"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters {activeCount > 0 && `(${activeCount})`}
          </button>
          <p className="hidden text-sm text-muted-foreground md:block">{filtered.length} sarees</p>
          <label className="ml-auto flex items-center gap-2 text-sm">
            <span className="hidden text-muted-foreground sm:inline">Sort by</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="min-h-11 rounded-sm border border-border bg-card px-3 text-sm cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </label>
        </div>

        <ProductGrid products={filtered} />
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:hidden">
          <button
            aria-label="Close filters"
            onClick={() => setMobileFiltersOpen(false)}
            className="absolute inset-0 bg-foreground/40 cursor-pointer"
          />
          <div className="relative max-h-[80svh] w-full overflow-y-auto rounded-t-lg bg-card p-5 animate-fade-in">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold">Filters</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <FilterPanel {...filterProps} />
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-6 min-h-11 w-full rounded-sm bg-primary text-sm font-semibold text-primary-foreground cursor-pointer"
            >
              Show {filtered.length} Sarees
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
