import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { flexRender, type Table } from "@tanstack/react-table";
import type { ExtendedSpecies, TranslationFunction } from "@/types/species";

interface SpeciesTableBodyProps {
  table: Table<ExtendedSpecies>;
  columnsLength: number;
  t: TranslationFunction;
}

export function SpeciesTableBody({
  table,
  columnsLength,
  t,
}: SpeciesTableBodyProps) {
  const imageColumnWidth = table.getAllColumns()[0]?.getSize() || 90;

  if (table.getRowModel().rows.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell
            colSpan={columnsLength}
            className="text-center text-muted-foreground py-10"
          >
            {t("empty.noResults")}
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {table.getRowModel().rows.map((row) => (
        <TableRow key={row.id}>
          {row.getVisibleCells().map((cell, index) => {
            const isImageColumn = index === 0;
            const isScientificNameColumn = index === 1;
            const isCommonNameColumn = index === 2;

            return (
              <TableCell
                key={cell.id}
                className={`
                  ${
                    isImageColumn
                      ? "sticky left-0 bg-background z-20 border-r p-2"
                      : ""
                  }
                  ${
                    isScientificNameColumn
                      ? "sticky bg-background z-20 border-r p-2"
                      : ""
                  }
                  ${
                    isCommonNameColumn
                      ? "bg-background z-20 border-r p-2"
                      : "p-2"
                  }
                  ${cell.column.id.includes("-") ? "border-l text-center" : ""}
                `}
                style={{
                  width: cell.column.getSize(),
                  ...(isScientificNameColumn && {
                    left: `${imageColumnWidth}px`,
                  }),
                }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </TableBody>
  );
}
