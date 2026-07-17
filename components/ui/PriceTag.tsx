import { discountPercent, formatPrice } from "@/lib/utils";

export function PriceTag({
  price,
  mrp,
  size = "md",
}: {
  price: number;
  mrp: number;
  size?: "sm" | "md" | "lg";
}) {
  const discount = discountPercent(price, mrp);
  const priceClass = size === "lg" ? "text-2xl" : size === "sm" ? "text-sm" : "text-base";
  const mrpClass = size === "lg" ? "text-base" : "text-xs";

  return (
    <div className="flex items-center gap-2">
      <span className={`font-semibold text-foreground ${priceClass}`}>{formatPrice(price)}</span>
      {discount > 0 && (
        <>
          <span className={`text-muted-foreground line-through ${mrpClass}`}>{formatPrice(mrp)}</span>
          <span className="text-xs font-semibold text-success">{discount}% off</span>
        </>
      )}
    </div>
  );
}
