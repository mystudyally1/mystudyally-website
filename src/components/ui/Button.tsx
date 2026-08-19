import { type ElementType, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

const VARIANTS = {
  primary:
    "bg-primary text-white shadow-press hover:bg-primary-hover active:translate-y-1 active:shadow-none",
  white:
    "bg-white text-link-hover shadow-press-white hover:bg-surface-alt active:translate-y-1 active:shadow-none",
  outline:
    "border-2 border-border bg-transparent text-ink hover:border-ink",
  ghost: "bg-transparent text-body hover:text-ink",
} as const;

const SIZES = {
  sm: "px-4 py-2 text-13 rounded-md",
  md: "px-6 py-3.5 text-15 rounded-lg",
  lg: "px-7 py-4 text-16 rounded-xl",
} as const;

type ButtonProps<T extends ElementType> = {
  as?: T;
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className">;

export function Button<T extends ElementType = "button">({
  as,
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps<T>) {
  const Component = as ?? "button";
  return (
    <Component
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap font-extrabold transition-colors",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    />
  );
}
