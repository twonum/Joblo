"use client";
import { Button } from "../../../components/ui/button";
import { Category } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import React from "react";

interface AppliedFiltersProps {
  categories: Category[];
}

export const AppliedFilters = ({ categories }: AppliedFiltersProps) => {
  // const pathname = usePathname();
  // const router = useRouter();
  const searchParams = useSearchParams();
  const currentParams = Object.fromEntries(searchParams.entries());

  // Extract specific filters from search params
  const shiftTimingParams = Object.fromEntries(
    Object.entries(currentParams).filter(([key]) => key === "shiftTiming")
  );

  const workModeParams = Object.fromEntries(
    Object.entries(currentParams).filter(([key]) => key === "workMode")
  );

  const getCategoryName = (categoryId: string | null) => {
    const category = categories.find((item) => item.id === categoryId);
    return category ? category.name : null;
  };

  if (searchParams.size === 0) return null;

  return (
    <>
      <div className="mt-4 flex flex-wrap gap-4">
        {/* Shift Timing Filters */}
        {shiftTimingParams &&
          Object.entries(shiftTimingParams).map(([key, value], index) => (
            <React.Fragment key={key + index}>
              {value.split(",").map((item, subIndex) => (
                <Button
                  variant="outline"
                  type="button"
                  key={`${item}-${subIndex}`} // Ensure uniqueness
                  className="flex items-center gap-x-2 text-neutral-500 px-4 py-2 rounded-md bg-purple-50/80 border-purple-200 capitalize cursor-pointer hover:bg-purple-50 w-auto sm:w-36"
                >
                  {item}
                </Button>
              ))}
            </React.Fragment>
          ))}

        {/* Work Mode Filters */}
        {workModeParams &&
          Object.entries(workModeParams).map(([key, value], index) => (
            <React.Fragment key={key + index}>
              {value.split(",").map((item, subIndex) => (
                <Button
                  variant="outline"
                  type="button"
                  key={`${item}-${subIndex}`} // Ensure uniqueness
                  className="flex items-center gap-x-2 text-neutral-500 px-4 py-2 rounded-md bg-purple-50/80 border-purple-200 capitalize cursor-pointer hover:bg-purple-50 w-auto sm:w-36"
                >
                  {item}
                </Button>
              ))}
            </React.Fragment>
          ))}

        {/* Category Filter */}
        {searchParams.get("categoryId") && (
          <Button
            variant="outline"
            type="button"
            className="flex items-center gap-x-2 text-neutral-500 px-4 py-2 rounded-md bg-purple-50/80 border-purple-200 capitalize cursor-pointer hover:bg-purple-50 w-auto sm:w-36"
          >
            {getCategoryName(searchParams.get("categoryId"))}
          </Button>
        )}
      </div>

      {/* Title Filter Display */}
      {searchParams.get("title") && (
        <div className="flex items-center justify-center flex-col my-4">
          <h2 className="text-2xl sm:text-3xl text-muted-foreground">
            You searched for:
            <span className="font-bold text-neutral-900">
              {" "}
              {searchParams.get("title")}
            </span>
          </h2>
        </div>
      )}
    </>
  );
};
