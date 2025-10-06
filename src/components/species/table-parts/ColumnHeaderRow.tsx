import { TableHead, TableRow } from "@/components/ui/table";
import { flexRender, type Table } from "@tanstack/react-table";
import type { ExtendedSpecies } from "@/types/species";

interface ColumnHeaderRowProps {
  table: Table<ExtendedSpecies>;
}

export function ColumnHeaderRow({ table }: ColumnHeaderRowProps) {
  const imageColumnWidth = table.getAllColumns()[0]?.getSize() || 120;

  return (
    <>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow
          key={headerGroup.id}
          className="sticky top-[40px] z-30 bg-background"
        >
          {headerGroup.headers.map((header, index) => {
            const isImageColumn = index === 0;
            const isScientificNameColumn = index === 1;

            return (
              <TableHead
                key={header.id}
                className={`
                  relative
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
                  ${index > 2 ? "text-center" : ""}
                  ${header.column.id.includes("-") ? "border-l" : ""}
                `}
                style={{
                  width: header.getSize(),
                  ...(isScientificNameColumn && {
                    left: `${imageColumnWidth}px`,
                  }),
                }}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                {/* Resize handle */}
                {header.column.getCanResize() && (
                  <div
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    onDoubleClick={() => header.column.resetSize()}
                    className={`absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none bg-border hover:bg-primary/50 ${
                      header.column.getIsResizing() ? "bg-primary" : ""
                    }`}
                  />
                )}
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </>
  );
}
