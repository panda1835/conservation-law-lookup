import { TableHead, TableRow } from "@/components/ui/table";
import type { Table } from "@tanstack/react-table";
import type { ExtendedSpecies } from "@/types/species";

interface ColumnMeta {
  docId?: string;
  isGroupHeader?: boolean;
  groupColSpan?: number;
  docUrl?: string;
  docShortName?: string;
}

interface GroupedHeaderRowProps {
  table: Table<ExtendedSpecies>;
}

export function GroupedHeaderRow({ table }: GroupedHeaderRowProps) {
  const imageColumnWidth = table.getAllColumns()[0]?.getSize() || 120;

  return (
    <TableRow className="sticky top-0 z-30 bg-background border-b">
      {table.getAllColumns().map((column, index) => {
        const isImageColumn = index === 0;
        const isScientificNameColumn = index === 1;

        const meta = column.columnDef.meta as ColumnMeta;
        const isGroupHeader = meta?.isGroupHeader;
        const groupColSpan = meta?.groupColSpan || 1;

        // Skip rendering if this is the second column of a grouped header
        if (index > 0) {
          const prevColumn = table.getAllColumns()[index - 1];
          const prevMeta = prevColumn?.columnDef.meta as ColumnMeta;
          if (prevMeta?.isGroupHeader && prevMeta?.groupColSpan === 2) {
            return null;
          }
        }

        return (
          <TableHead
            key={column.id}
            colSpan={groupColSpan}
            className={`
              relative text-center
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
              width:
                groupColSpan > 1
                  ? column.getSize() * groupColSpan
                  : column.getSize(),
              ...(isScientificNameColumn && { left: `${imageColumnWidth}px` }),
            }}
          >
            {isGroupHeader ? (
              <div className="flex items-center justify-center gap-1">
                <a
                  href={meta.docUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-blue-600 dark:text-blue-400 font-medium text-sm truncate block"
                  onClick={(e) => e.stopPropagation()}
                >
                  {meta.docShortName}
                </a>
              </div>
            ) : column.id.includes("-") ? (
              <div className="flex items-center justify-center gap-1">
                {meta?.docUrl && meta?.docShortName && (
                  <a
                    href={meta.docUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-blue-600 dark:text-blue-400 font-medium text-sm truncate block"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {meta.docShortName}
                  </a>
                )}
              </div>
            ) : null}
          </TableHead>
        );
      })}
    </TableRow>
  );
}
