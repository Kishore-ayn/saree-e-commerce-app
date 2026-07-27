import { describe, expect, test } from "vitest";
import { formatPrice, discountPercent, buildOrderMessage, buildOrderWhatsAppUrl } from "@/lib/utils";
import type { CartItem } from "@/lib/store";
import type { Product } from "@/lib/types";

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: "p1",
    slug: "test-saree",
    name: "Test Saree",
    fabric: "Cotton",
    collections: [],
    occasions: [],
    colors: [],
    price: 1000,
    mrp: 1000,
    description: "",
    longDescription: "",
    images: [],
    rating: 0,
    reviewCount: 0,
    inStock: true,
    sku: "SKU1",
    blousePiece: false,
    length: "",
    care: "",
    ...overrides,
  };
}

describe("formatPrice", () => {
  test("formats with the rupee symbol and Indian digit grouping", () => {
    expect(formatPrice(1234567)).toBe("₹12,34,567");
  });

  test("formats small numbers without grouping", () => {
    expect(formatPrice(500)).toBe("₹500");
  });
});

describe("discountPercent", () => {
  test("returns 0 when mrp is not greater than price", () => {
    expect(discountPercent(1000, 1000)).toBe(0);
    expect(discountPercent(1200, 1000)).toBe(0);
  });

  test("rounds to the nearest whole percent", () => {
    expect(discountPercent(750, 1000)).toBe(25);
  });
});

describe("buildOrderMessage / buildOrderWhatsAppUrl", () => {
  const cart: CartItem[] = [{ product: makeProduct({ name: "Kanjivaram Silk", price: 5000 }), quantity: 2 }];

  test("includes product name, quantity and total", () => {
    const message = buildOrderMessage(cart, 10000);
    expect(message).toContain("Kanjivaram Silk");
    expect(message).toContain("Qty: 2");
    expect(message).toContain("₹10,000");
  });

  test("builds a wa.me link with the encoded message", () => {
    const url = buildOrderWhatsAppUrl(cart, 10000);
    expect(url).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
    expect(decodeURIComponent(url.split("text=")[1])).toContain("Kanjivaram Silk");
  });
});
