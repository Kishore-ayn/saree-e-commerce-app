import { cn } from "@/lib/utils";
import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-dark",
  secondary: "bg-gold text-gold-foreground hover:bg-gold-light",
  outline: "border border-primary text-primary hover:bg-primary hover:text-primary-foreground",
  ghost: "text-primary hover:bg-muted",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-sm font-medium tracking-wide transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary min-h-11";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type LinkButtonProps = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type NativeButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const clone = { ...obj };
  for (const key of keys) delete clone[key];
  return clone;
}

export function Button(props: LinkButtonProps | NativeButtonProps) {
  const { variant = "primary", size = "md", className } = props;
  const classes = cn(base, variantClasses[variant], sizeClasses[size], className);

  if (props.href) {
    const rest = omit(props, ["variant", "size", "className"]);
    return (
      <Link {...rest} className={classes}>
        {props.children}
      </Link>
    );
  }

  const rest = omit(props as NativeButtonProps, ["variant", "size", "className", "href"]);
  return (
    <button {...rest} className={classes}>
      {props.children}
    </button>
  );
}
