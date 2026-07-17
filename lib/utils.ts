import { clsx, type ClassValue } from "clsx";
import { siteConfig } from "@/lib/site-config";

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
