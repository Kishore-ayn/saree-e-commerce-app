import { clsx, type ClassValue } from "clsx";
import { siteConfig } from "@/lib/site-config";
import type { CartItem } from "@/lib/store";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(value: number): string {
  return `${siteConfig.currencySymbol}${value.toLocaleString("en-IN")}`;
}

export function discountPercent(price: number, mrp: number): number {
  if (mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

/** Builds the pre-filled WhatsApp order message shown to the customer before they send it. */
export function buildOrderMessage(cart: CartItem[], total: number): string {
  const lines = cart
    .map(
      (item, index) =>
        `${index + 1}. ${item.product.name} - ${formatPrice(item.product.price)}\n   Qty: ${item.quantity}`
    )
    .join("\n\n");

  return `Hello,\n\nI'd like to order:\n\n${lines}\n\nTotal: ${formatPrice(total)}\n\nName:\nPhone:\nAddress:`;
}

/** wa.me deep link to send the pre-filled order message to the store's WhatsApp number. */
export function buildOrderWhatsAppUrl(cart: CartItem[], total: number): string {
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(buildOrderMessage(cart, total))}`;
}
