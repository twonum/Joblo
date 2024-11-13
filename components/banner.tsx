import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { AlertTriangle, CheckCircle } from "lucide-react";
import React from "react";

// Define banner variants
const bannerVariants = cva(
  "border text-center p-4 text-sm flex items-center w-full rounded-md shadow-md",
  {
    variants: {
      variant: {
        warning: "bg-yellow-200/80 border-yellow-300 text-primary",
        success: "bg-emerald-700/80 border-emerald-300 text-secondary",
      },
    },
    defaultVariants: {
      variant: "warning",
    },
  }
);

// Define icon map
const iconMap = {
  warning: AlertTriangle,
  success: CheckCircle,
};

interface BannerProps extends VariantProps<typeof bannerVariants> {
  label: string;
  className?: string;
}

export const Banner = ({
  variant = "warning",
  label,
  className,
}: BannerProps) => {
  // Ensure that variant has a valid value
  const Icon = iconMap[variant as keyof typeof iconMap];

  return (
    <div className={cn(bannerVariants({ variant }), className)}>
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </div>
  );
};
