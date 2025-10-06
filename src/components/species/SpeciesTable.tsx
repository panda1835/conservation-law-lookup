"use client";

import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type SortingState,
  type ColumnFiltersState,
  type ColumnResizeMode,
} from "@tanstack/react-table";
import { Table, TableHeader } from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type {
  ExtendedSpecies,
  TaxonomicDetails,
  TranslationFunction,
} from "@/types/species";

// Import column factories
import {
  createImageColumn,
  createScientificNameColumn,
  createCommonNameColumn,
} from "./columns/basic-columns";
import { createTaxonomicColumns } from "./columns/taxonomic-columns";
import { createLegalDocumentColumns } from "./columns/legal-document-columns";

// Import table part components
import { GroupedHeaderRow } from "./table-parts/GroupedHeaderRow";
import { ColumnHeaderRow } from "./table-parts/ColumnHeaderRow";
import { FilterRow } from "./table-parts/FilterRow";
import { SpeciesTableBody } from "./table-parts/SpeciesTableBody";

interface SpeciesTableProps {
  filteredData: ExtendedSpecies[];
  selectedDocuments: string[];
  documentLawCategories: Record<string, string[]>;
  showTaxonomicDetails: TaxonomicDetails;
  searchTerm: string;
  locale: string;
  t: TranslationFunction;
  onExportCSV: () => void;
}

export const SpeciesTable = ({
  filteredData,
  selectedDocuments,
  documentLawCategories,
  showTaxonomicDetails,
  searchTerm,
  locale,
  t,
  // onExportCSV is kept for future use with export button
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onExportCSV,
}: SpeciesTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnResizeMode] = useState<ColumnResizeMode>("onChange");

  // Define columns dynamically based on selected documents and taxonomic details
  const columns = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cols: any[] = [];

    // Basic columns
    cols.push(createImageColumn(t));
    cols.push(createScientificNameColumn(t));
    cols.push(createCommonNameColumn(t));

    // Taxonomic columns
    cols.push(...createTaxonomicColumns(showTaxonomicDetails, t));

    // Legal document columns
    cols.push(
      ...createLegalDocumentColumns(
        selectedDocuments,
        documentLawCategories,
        locale,
        t
      )
    );

    return cols;
  }, [
    selectedDocuments,
    showTaxonomicDetails,
    documentLawCategories,
    locale,
    t,
  ]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    columnResizeMode,
    enableColumnResizing: true,
  });

  if (selectedDocuments.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <p>{t("empty.selectDocument")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle>{t("table.title")}</CardTitle>
            <CardDescription className="mt-2">
              <p className="text">
                {t("results.showing")}{" "}
                <span className="font-bold">
                  {table.getRowModel().rows.length}
                </span>{" "}
                {t("results.species")}
                {searchTerm && (
                  <span>
                    {" "}
                    {t("results.matching")} &ldquo;
                    <span className="italic">{searchTerm}</span>&rdquo;
                  </span>
                )}
              </p>
            </CardDescription>
          </div>
          {/* <Button
            onClick={onExportCSV}
            disabled={filteredData.length === 0}
            className="ml-4 shrink-0 hidden md:block w-fit"
            variant="default"
          >
            <div className="flex items-center">
              <Download className="w-4 h-4 mr-3" />
              {t("table.exportCSV")}
            </div>
          </Button> */}
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto overflow-y-auto max-h-[600px] border rounded-md">
          <div style={{ minWidth: "1200px" }}>
            <Table style={{ tableLayout: "fixed" }}>
              <TableHeader>
                <GroupedHeaderRow table={table} />
                <ColumnHeaderRow table={table} />
                <FilterRow table={table} locale={locale} />
              </TableHeader>
              <SpeciesTableBody
                table={table}
                columnsLength={columns.length}
                t={t}
              />
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
