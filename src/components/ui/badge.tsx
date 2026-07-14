import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary/10 text-primary",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        accent: "border-transparent bg-teal/15 text-teal-700 dark:text-teal-300",
        gold: "border-transparent bg-gold/15 text-gold-700 dark:text-gold-400",
        success:
          "border-transparent bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
        destructive:
          "border-transparent bg-destructive/15 text-destructive",
        outline: "border-border text-foreground",
        glass:
          "border-white/20 bg-white/10 text-white backdrop-blur-md",
        dark: "border-transparent bg-ink-900/85 text-white backdrop-blur",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
