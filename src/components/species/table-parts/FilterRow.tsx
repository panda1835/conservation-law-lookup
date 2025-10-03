import { TableHead, TableRow } from "@/components/ui/table";
import type { Table } from "@tanstack/react-table";
import type { ExtendedSpecies } from "@/types/species";
import { ColumnFilter } from "../ColumnFilter";

interface FilterRowProps {
  table: Table<ExtendedSpecies>;
  locale: string;
}

export function FilterRow({ table, locale }: FilterRowProps) {
  const imageColumnWidth = table.getAllColumns()[0]?.getSize() || 90;

  return (
    <TableRow className="sticky top-[80px] z-30 bg-background border-b">
      {table.getAllColumns().map((column, index) => {
        const isImageColumn = index === 0;
        const isScientificNameColumn = index === 1;

        return (
          <TableHead
            key={`filter-${column.id}`}
            className={`
              p-1
              ${
                isImageColumn
                  ? "sticky left-0 bg-background z-40 border-r shadow-md"
                  : ""
              }
              ${
                isScientificNameColumn
                  ? "sticky bg-background z-40 border-r shadow-md"
                  : ""
              }
              ${index === 2 ? "bg-background border-r shadow-md" : ""}
              ${column.id.includes("-") ? "border-l" : ""}
            `}
            style={{
              width: column.getSize(),
              ...(isScientificNameColumn && { left: `${imageColumnWidth}px` }),
            }}
          >
            {column.getCanFilter() ? (
              <ColumnFilter
                column={column}
                placeholder={locale === "en" ? "Filter..." : "Lọc..."}
              />
            ) : null}
          </TableHead>
        );
      })}
    </TableRow>
  );
}
