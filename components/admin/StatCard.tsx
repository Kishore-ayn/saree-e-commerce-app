import * as Lucide from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: keyof typeof Lucide;
  variant?: "primary" | "secondary" | "success" | "warning" | "error";
  trend?: {
    value: number | string;
    label: string;
    isPositive: boolean;
  };
  href?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  variant = "primary",
  trend,
  href,
}: StatCardProps) {
  const variants: Record<
    string,
    {
      bg: string;
      text: string;
      border: string;
      hoverBg: string;
    }
  > = {
    primary: {
      bg: "bg-primary/10",
      text: "text-primary",
      border: "border-primary/20",
      hoverBg: "bg-primary/20",
    },
    secondary: {
      bg: "bg-secondary/10",
      text: "text-secondary",
      border: "border-secondary/20",
      hoverBg: "bg-secondary/20",
    },
    success: {
      bg: "bg-success/10",
      text: "text-success",
      border: "border-success/20",
      hoverBg: "bg-success/20",
    },
    warning: {
      bg: "bg-warning/10",
      text: "text-warning",
      border: "border-warning/20",
      hoverBg: "bg-warning/20",
    },
    error: {
      bg: "bg-error/10",
      text: "text-error",
      border: "border-error/20",
      hoverBg: "bg-error/20",
    },
  };

  const variantConfig = variants[variant] ?? variants.primary;

  return (
    <a
      href={href}
      className={`
        group relative flex w-full flex-col items-jusitfy-start gap-4 p-6
        ${variantConfig.bg} ${variantConfig.border} rounded-lg
        hover:${variantConfig.hoverBg} transition-colors cursor-pointer
        border
      `}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col">
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            {title}
          </p>
          <p className="mt-1 text-2xl font-semibold">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg">
          {/* Render the appropriate Lucide icon based on the icon prop */}
          {icon === "Box" && <Lucide.Box className={`h-5 w-5 ${variantConfig.text}`} />}
          {icon === "Check" && <Lucide.Check className={`h-5 w-5 ${variantConfig.text}`} />}
          {icon === "Edit" && <Lucide.Edit className={`h-5 w-5 ${variantConfig.text}`} />}
          {icon === "Folder" && <Lucide.Folder className={`h-5 w-5 ${variantConfig.text}`} />}
          {icon === "Map" && <Lucide.Map className={`h-5 w-5 ${variantConfig.text}`} />}
          {icon === "Image" && <Lucide.Image className={`h-5 w-5 ${variantConfig.text}`} />}
          {icon === "MessageSquare" && <Lucide.MessageSquare className={`h-5 w-5 ${variantConfig.text}`} />}
          {icon === "FileText" && <Lucide.FileText className={`h-5 w-5 ${variantConfig.text}`} />}
          {icon === "Calendar" && <Lucide.Calendar className={`h-5 w-5 ${variantConfig.text}`} />}
          {icon === "Users" && <Lucide.Users className={`h-5 w-5 ${variantConfig.text}`} />}
          {icon === "Building" && <Lucide.Building className={`h-5 w-5 ${variantConfig.text}`} />}
          {/* Fallback to Box icon if none matched */}
          {!["Box", "Check", "Edit", "Folder", "Map", "Image", "MessageSquare", "FileText", "Calendar", "Users", "Building"].includes(icon) && <Lucide.Box className={`h-5 w-5 ${variantConfig.text}`} />}
        </div>
      </div>

      {trend && (
        <div className="mt-2 flex w-full items-center justify-between text-xs">
          <span className={`
            flex items-center gap-1
            ${trend.isPositive ? "text-success" : "text-error"}
          `}>
            {trend.isPositive ? "▲" : "▼"} {trend.value} {trend.label}
          </span>
        </div>
      )}
    </a>
  );
}