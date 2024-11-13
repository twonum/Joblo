"use client";

import { LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "../../../lib/utils";
import React from "react";

interface SidebarRouteItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

export const SidebarRouteItem = ({
  icon: Icon,
  label,
  href,
}: SidebarRouteItemProps) => {
  const pathname = usePathname();

  // Determine if the exact route is active
  const isActive = pathname === href;

  return (
    <Link href={href} passHref>
      <button
        className={cn(
          "w-full flex items-center gap-x-2 text-neutral-500 text-sm font-medium py-3 px-4 transition-all", // Adjusted padding and font size for mobile
          "hover:bg-neutral-300/20 hover:text-neutral-600",
          isActive && "text-purple-700 bg-purple-200/20 hover:bg-purple-700/20",
          "sm:px-6 sm:py-4 sm:text-base" // Larger padding and font size on desktop
        )}
      >
        <div className="flex items-center gap-x-2">
          {/* Icon size changes responsively */}
          <Icon
            className={cn("text-neutral-500", isActive && "text-purple-700")}
            size={20}
          />
          <span className="hidden sm:inline">{label}</span>{" "}
          {/* Hide label on mobile, show on desktop */}
        </div>
        {/* Highlighter bar when active */}
        {isActive && (
          <div className="ml-auto h-full border-l-2 border-purple-700" />
        )}
      </button>
    </Link>
  );
};
