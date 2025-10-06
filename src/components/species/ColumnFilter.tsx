"use client";

import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useLocale } from "next-intl";
import type { Column } from "@tanstack/react-table";

interface ColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
  placeholder?: string;
}

export function ColumnFilter<TData, TValue>({
  column,
  placeholder,
}: ColumnFilterProps<TData, TValue>) {
  const filterValue = (column.getFilterValue() ?? "") as string;
  const locale = useLocale();

  return (
    <div className="relative">
      <Input
        type="text"
        value={filterValue}
        onChange={(e) => column.setFilterValue(e.target.value)}
        placeholder={placeholder || (locale === "en" ? "Filter..." : "Lọc...")}
        className="h-7 text-xs w-full pr-6"
        onClick={(e) => e.stopPropagation()}
      />
      {filterValue && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            column.setFilterValue("");
          }}
          className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
