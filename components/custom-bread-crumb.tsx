"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";
import { Home } from "lucide-react";
import React from "react";

interface CustomBreadCrumbProps {
  breadcrumbPage: string;
  breadCrumbItem?: { link: string; label: string }[];
}
export const CustomBreadCrumb = ({
  breadcrumbPage,
  breadCrumbItem,
}: CustomBreadCrumbProps) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="flex items-center justify-center">
            <Home className="w-3 h-3 mr-2" />
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>

        {breadCrumbItem && (
          <>
            {breadCrumbItem.map((item, index) => (
              <>
                <BreadcrumbSeparator key={index} />
                <BreadcrumbItem key={index}>
                  <BreadcrumbLink href={item.link}>{item.label}</BreadcrumbLink>
                </BreadcrumbItem>
              </>
            ))}
          </>
        )}
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{breadcrumbPage}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
