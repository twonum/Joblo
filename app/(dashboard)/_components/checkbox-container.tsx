"use client";

import { Checkbox } from "../../../components/ui/checkbox";
import { cn } from "../../../lib/utils";
import React from "react";
import { useEffect, useState } from "react";

interface AppliedFilters {
  value: string;
  label: string;
  checked?: boolean;
}
interface CheckBoxContainerProps {
  data: AppliedFilters[];
  onChange: (dataValues: string[]) => void;
}

export const CheckBoxContainer = ({
  data,
  onChange,
}: CheckBoxContainerProps) => {
  const [filters, setFilters] = useState<AppliedFilters[]>(data);

  useEffect(() => {
    setFilters(data);
  }, [data]);
  const handleCheckedChange = (applied: AppliedFilters) => {
    const updatedFilters = filters.map((item) => {
      if (item.value === applied.value) {
        return { ...item, checked: !item.checked };
      }
      return item;
    });
    setFilters(updatedFilters);
    onChange(
      updatedFilters.filter((item) => item.checked).map((item) => item.value)
    );
  };
  return (
    <div className="flex w-full flex-col items-start justify-start gap-2">
      {filters.map((item) => (
        <div
          key={item.value}
          className={cn(
            "flex items-center gap-2",
            item.checked ? "text-purple-500" : "text-muted-foreground"
          )}
        >
          <Checkbox
            checked={item.checked || false}
            onCheckedChange={() => handleCheckedChange(item)}
          />
          {item.label}
        </div>
      ))}
    </div>
  );
};
