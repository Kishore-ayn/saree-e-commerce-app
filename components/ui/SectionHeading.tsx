import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  as: Tag = "h2",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <div className={cn("mb-8 md:mb-10", align === "center" ? "text-center" : "text-left", className)}>
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">{eyebrow}</p>
      )}
      <Tag className="text-3xl font-medium text-foreground md:text-4xl">{title}</Tag>
      {subtitle && (
        <p
          className={cn(
            "mt-3 text-sm text-muted-foreground md:text-base",
            align === "center" && "mx-auto max-w-2xl"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
