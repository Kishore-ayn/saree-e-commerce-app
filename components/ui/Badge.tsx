import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type BadgeVariant = "sale" | "new" | "bestseller" | "outline";

const variantClasses: Record<BadgeVariant, string> = {
  sale: "bg-destructive text-destructive-foreground",
  new: "bg-primary text-primary-foreground",
  bestseller: "bg-gold text-gold-foreground",
  outline: "border border-border text-foreground bg-card",
};

export function Badge({
  children,
  variant = "outline",
  className,
}: {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-1 text-[11px] font-semibold uppercase tracking-wider",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
