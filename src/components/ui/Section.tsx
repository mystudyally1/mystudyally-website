import { type ElementType, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type SectionProps<T extends ElementType> = {
  as?: T;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className">;

export function Section<T extends ElementType = "section">({
  as,
  className,
  ...props
}: SectionProps<T>) {
  const Component = as ?? "section";
  return (
    <Component
      className={cn("py-16 px-4 sm:px-6 lg:px-8", className)}
      {...props}
    />
  );
}
