import React from "react";
import { NavbarRoutes } from "./navbar-routes";
import { MobileSideBar } from "./mobile-sidebar";

export const Navbar = () => {
  return (
    <div className="px-3 py-2 border-b h-full flex items-center bg-white shadow-sm">
      {" "}
      {/* Adjusted padding */}
      {/* Mobile routes */}
      <MobileSideBar />
      {/* Sidebar routes */}
      <NavbarRoutes />
    </div>
  );
};
