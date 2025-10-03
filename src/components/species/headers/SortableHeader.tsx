import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import type { Column } from "@tanstack/react-table";

interface SortableHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  children: React.ReactNode;
  className?: string;
}

export function SortableHeader<TData, TValue>({
  column,
  children,
  className = "",
}: SortableHeaderProps<TData, TValue>) {
  return (
    <button
      className={`flex items-center gap-2 hover:text-primary transition-colors w-full ${className}`}
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {children}
      {column.getIsSorted() === "asc" ? (
        <ArrowUp className="h-4 w-4" />
      ) : column.getIsSorted() === "desc" ? (
        <ArrowDown className="h-4 w-4" />
      ) : (
        <ArrowUpDown className="h-4 w-4 opacity-50" />
      )}
    </button>
  );
}

interface CompactSortableHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  children: React.ReactNode;
}

export function CompactSortableHeader<TData, TValue>({
  column,
  children,
}: CompactSortableHeaderProps<TData, TValue>) {
  return (
    <button
      className="flex items-center gap-1 hover:text-primary transition-colors text-xs w-full justify-center"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {children}
      {column.getIsSorted() ? (
        column.getIsSorted() === "asc" ? (
          <ArrowUp className="h-3 w-3" />
        ) : (
          <ArrowDown className="h-3 w-3" />
        )
      ) : (
        <ArrowUpDown className="h-3 w-3 opacity-50" />
      )}
    </button>
  );
}
