import { createColumnHelper } from "@tanstack/react-table";
import type { ExtendedSpecies, TranslationFunction } from "@/types/species";
import { CompactSortableHeader } from "../headers/SortableHeader";

const columnHelper = createColumnHelper<ExtendedSpecies>();

function createTaxonomicColumnPair(
  latinAccessor: keyof ExtendedSpecies,
  viAccessor: keyof ExtendedSpecies,
  latinLabel: string,
  viLabel: string
) {
  return [
    columnHelper.accessor(latinAccessor, {
      header: ({ column }) => (
        <CompactSortableHeader column={column}>
          {latinLabel}
        </CompactSortableHeader>
      ),
      cell: (info) => (
        <div
          className="text-xs italic truncate text-center"
          title={String(info.getValue() || "")}
        >
          {String(info.getValue() || "")}
        </div>
      ),
      size: 100,
      minSize: 60,
      maxSize: 150,
    }),
    columnHelper.accessor(viAccessor, {
      header: ({ column }) => (
        <CompactSortableHeader column={column}>{viLabel}</CompactSortableHeader>
      ),
      cell: (info) => (
        <div
          className="text-xs truncate text-center"
          title={String(info.getValue() || "")}
        >
          {String(info.getValue() || "")}
        </div>
      ),
      size: 100,
      minSize: 60,
      maxSize: 150,
    }),
  ];
}

export function createTaxonomicColumns(
  showTaxonomicDetails: {
    kingdom: boolean;
    phylum: boolean;
    class: boolean;
    order: boolean;
    family: boolean;
  },
  t: TranslationFunction
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: any[] = [];

  const taxonomicFields: Array<{
    key: keyof typeof showTaxonomicDetails;
    latinAccessor: keyof ExtendedSpecies;
    viAccessor: keyof ExtendedSpecies;
    latinLabel: string;
    viLabel: string;
  }> = [
    {
      key: "kingdom",
      latinAccessor: "kingdom_latin",
      viAccessor: "kingdom_vi",
      latinLabel: t("table.kingdomLatin"),
      viLabel: t("table.kingdomVietnamese"),
    },
    {
      key: "phylum",
      latinAccessor: "phylum_latin",
      viAccessor: "phylum_vi",
      latinLabel: t("table.phylumLatin"),
      viLabel: t("table.phylumVietnamese"),
    },
    {
      key: "class",
      latinAccessor: "class_latin",
      viAccessor: "class_vi",
      latinLabel: t("table.classLatin"),
      viLabel: t("table.classVietnamese"),
    },
    {
      key: "order",
      latinAccessor: "order_latin",
      viAccessor: "order_vi",
      latinLabel: t("table.orderLatin"),
      viLabel: t("table.orderVietnamese"),
    },
    {
      key: "family",
      latinAccessor: "family_latin",
      viAccessor: "family_vi",
      latinLabel: t("table.familyLatin"),
      viLabel: t("table.familyVietnamese"),
    },
  ];

  taxonomicFields.forEach((field) => {
    if (showTaxonomicDetails[field.key]) {
      columns.push(
        ...createTaxonomicColumnPair(
          field.latinAccessor,
          field.viAccessor,
          field.latinLabel,
          field.viLabel
        )
      );
    }
  });

  return columns;
}
