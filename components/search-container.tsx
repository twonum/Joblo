"use client";

import { Search, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "../hooks/use-debounce";
import qs from "query-string";

export const SearchContainer = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentCategoryId = searchParams.get("categoryId");
  const currentTitle = searchParams.get("title");
  const currentShiftTiming = searchParams.get("shiftTiming");
  const createdAtFilter = searchParams.get("createdAtFilter");
  const currentWorkMode = searchParams.get("workMode");

  const [value, setValue] = useState(currentTitle || "");
  const debouncedValue = useDebounce(value); // 500ms delay

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: debouncedValue,
          categoryId: currentCategoryId,
          shiftTiming: currentShiftTiming,
          createdAtFilter: createdAtFilter,
          workMode: currentWorkMode,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );
    router.push(url); // Update the URL without refreshing the page
  }, [
    debouncedValue,
    currentCategoryId,
    currentShiftTiming,
    createdAtFilter,
    currentWorkMode,
    router,
    pathname,
  ]);

  return (
    <div className="relative flex-1">
      <Search className="h-4 w-4 text-neutral-600 absolute left-3 top-1/2 transform -translate-y-1/2" />
      <Input
        placeholder="Search for a job title"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full md:w-[calc(100%-90px)] pl-9 rounded-lg bg-neutral-100 focus-visible:ring-neutral-200 text-sm" // Adjust width on md screens
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => setValue("")}
          className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 hover:bg-transparent"
        >
          <X className="h-4 w-4 text-neutral-600" />
        </Button>
      )}
    </div>
  );
};
