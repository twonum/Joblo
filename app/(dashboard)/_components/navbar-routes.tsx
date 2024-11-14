"use client";

import { SearchContainer } from "../../../components/search-container";
import { Button } from "../../../components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

// NavbarRoutes component with customizable button colors
export const NavbarRoutes = ({
  buttonTextColor = "text-neutral-800", // Default text color
  buttonBorderColor = "border-neutral-500", // Default border color
  buttonHoverColor = "hover:bg-neutral-200", // Default hover color
}) => {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");
  const isPlayerPage = pathname?.startsWith("/jobs");
  const isSearchPage = pathname?.startsWith("/search");

  return (
    <div className="flex w-full items-center justify-between px-2 md:px-4 py-1">
      {/* Search Container: Shown on medium screens and larger */}
      {isSearchPage && (
        <div className="flex-1 hidden md:flex items-center gap-x-4">
          <SearchContainer />
        </div>
      )}
      {/* Action Buttons and User Icon */}
      <div className="flex gap-x-4 ml-auto items-center">
        {/* Conditional rendering based on the page */}
        {isAdminPage || isPlayerPage ? (
          <Link href="/">
            <Button
              variant="outline"
              size="sm"
              className={`text-xs md:text-sm ${buttonBorderColor} ${buttonTextColor} ${buttonHoverColor} transition-all`}
            >
              <LogOut className="mr-1 h-4 w-4" />
              Exit
            </Button>
          </Link>
        ) : (
          <Link href="/admin/jobs">
            <Button
              variant="outline"
              size="sm"
              className={`text-xs md:text-sm ${buttonBorderColor} ${buttonTextColor} ${buttonHoverColor} transition-all`}
            >
              Admin Mode
            </Button>
          </Link>
        )}
        {/* User Button */}
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};
