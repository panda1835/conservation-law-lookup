import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import type { ExtendedSpecies, TranslationFunction } from "@/types/species";
import { LEGAL_DOCUMENTS } from "@/data/legalDocuments";
import { StatusBadgeCell } from "../cells/StatusBadgeCell";

const columnHelper = createColumnHelper<ExtendedSpecies>();

interface ColumnMeta {
  docId?: string;
  isGroupHeader?: boolean;
  groupColSpan?: number;
  docUrl?: string;
  docShortName?: string;
}

function shouldShowSpeciesData(
  species: ExtendedSpecies,
  docId: string
): boolean {
  return species.isSharedSpecies
    ? species.documentIds?.has(docId) ?? false
    : species.documentId === docId;
}

function getStatusAndNote(
  species: ExtendedSpecies,
  docId: string,
  category?: string,
  locale?: string
): { status: string; note: string } {
  const shouldShow = shouldShowSpeciesData(species, docId);
  
  if (!shouldShow) {
    return { status: "", note: "" };
  }

  if (!category) {
    // Single column document
    const law = species.laws[0];
    return {
      status: law?.value || "",
      note: law?.note || "",
    };
  }

  // Multi-category document
  const relevantLaw = species.laws.find((law) => {
    const lawName =
      typeof law.name === "string"
        ? law.name
        : law.name[locale as "vi" | "en"];
    return lawName === category;
  });

  return {
    status: relevantLaw?.value || "",
    note: relevantLaw?.note || "",
  };
}

function createSingleCategoryColumn(
  docId: string,
  locale: string,
  t: TranslationFunction
) {
  const doc = LEGAL_DOCUMENTS.find((d) => d.id === docId);
  if (!doc) return null;

  const isRedList = docId === "iucn" || docId === "vnredlist";

  return columnHelper.accessor(
    (row) => getStatusAndNote(row, docId).status,
    {
      id: `${docId}-status`,
      header: ({ column }) => (
        <div className="flex items-center justify-center gap-1">
          <a
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-blue-600 dark:text-blue-400 font-medium text-sm truncate block"
            onClick={(e) => e.stopPropagation()}
          >
            {doc.shortName[locale as "vi" | "en"]}
          </a>
          <button
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }
            className="hover:text-primary"
          >
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
        </div>
      ),
      meta: {
        docId,
        isGroupHeader: false,
        docUrl: doc.url,
        docShortName: doc.shortName[locale as "vi" | "en"],
      } as ColumnMeta,
      cell: (info) => {
        const { status, note } = getStatusAndNote(info.row.original, docId);
        return <StatusBadgeCell status={status} note={note} isRedList={isRedList} t={t} />;
      },
      enableSorting: true,
      enableColumnFilter: true,
      size: 120,
      minSize: 80,
      maxSize: 200,
    }
  );
}

function createMultiCategoryColumns(
  docId: string,
  categories: string[],
  locale: string,
  t: TranslationFunction
) {
  const doc = LEGAL_DOCUMENTS.find((d) => d.id === docId);
  if (!doc) return [];

  const isRedList = docId === "iucn" || docId === "vnredlist";

  return categories.map((category, categoryIndex) =>
    columnHelper.accessor(
      (row) => getStatusAndNote(row, docId, category, locale).status,
      {
        id: `${docId}-${category}`,
        header: ({ column }) => (
          <div className="text-center">
            <div className="text-xs text-wrap mt-1 flex items-center justify-center gap-1">
              {category}
              <button
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="hover:text-primary"
              >
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
            </div>
          </div>
        ),
        meta: {
          docId,
          isGroupHeader: categoryIndex === 0 && categories.length === 2,
          groupColSpan: categories.length === 2 ? 2 : 1,
          docUrl: doc.url,
          docShortName: doc.shortName[locale as "vi" | "en"],
        } as ColumnMeta,
        cell: (info) => {
          const { status, note } = getStatusAndNote(
            info.row.original,
            docId,
            category,
            locale
          );
          return <StatusBadgeCell status={status} note={note} isRedList={isRedList} t={t} />;
        },
        enableSorting: true,
        enableColumnFilter: true,
        size: 120,
        minSize: 80,
        maxSize: 200,
      }
    )
  );
}

export function createLegalDocumentColumns(
  selectedDocuments: string[],
  documentLawCategories: Record<string, string[]>,
  locale: string,
  t: TranslationFunction
) {
  const columns: any[] = [];

  selectedDocuments.forEach((docId) => {
    const categories = documentLawCategories[docId] || [];

    if (categories.length === 0) {
      const column = createSingleCategoryColumn(docId, locale, t);
      if (column) {
        columns.push(column);
      }
    } else {
      columns.push(...createMultiCategoryColumns(docId, categories, locale, t));
    }
  });

  return columns;
}
