import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { LucideIcon } from "lucide-react";
import React from "react";

// Define background variants with class-variance-authority
const backgroundVariant = cva("flex items-center justify-center rounded-full", {
  variants: {
    variant: {
      default: "bg-purple-100",
      success: "bg-emerald-100",
    },
    size: {
      default: "h-7 w-7", // increase height and width
      sm: "h-4 w-4", // add small size
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

// Define icon variants with class-variance-authority
const iconVariants = cva("", {
  variants: {
    variant: {
      default: "text-purple-700",
      success: "text-emerald-700",
    },
    size: {
      default: "h-8 w-8",
      sm: "h-4 w-4",
    },
  },
  defaultVariants: {
    size: "default",
    variant: "default",
  },
});

type BackgroundVariantProps = VariantProps<typeof backgroundVariant>;
type IconVariantProps = VariantProps<typeof iconVariants>;

interface IconBadgeProps extends BackgroundVariantProps, IconVariantProps {
  icon: LucideIcon;
  className?: string; // Adding className support
}

// IconBadge component
export const IconBadge = ({
  icon: Icon,
  variant,
  size,
  className,
}: IconBadgeProps) => {
  return (
    <div className={cn(backgroundVariant({ variant, size }), className)}>
      <Icon className={cn(iconVariants({ variant, size }))} />
    </div>
  );
};
