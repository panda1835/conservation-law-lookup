import { createColumnHelper } from "@tanstack/react-table";
import type { ExtendedSpecies, TranslationFunction } from "@/types/species";
import { SpeciesImageThumbnail } from "@/components/home/SpeciesImageThumbnail";
import { getSpeciesImages } from "@/utils/species";
import { SortableHeader } from "../headers/SortableHeader";

const columnHelper = createColumnHelper<ExtendedSpecies>();

export function createImageColumn(t?: TranslationFunction) {
  return columnHelper.accessor("scientific_name.value", {
    id: "image",
    header: () => (
      <div className="flex justify-center w-full">
        {t ? t("table.image") : "Image"}
      </div>
    ),
    cell: (info) => (
      <div className="flex justify-center w-full">
        <SpeciesImageThumbnail
          images={getSpeciesImages(info.getValue())}
          speciesName={info.getValue()}
        />
      </div>
    ),
    enableSorting: false,
    enableColumnFilter: false,
    size: 120,
    minSize: 60,
    maxSize: 200,
  });
}

export function createScientificNameColumn(t: TranslationFunction) {
  return columnHelper.accessor("scientific_name.value", {
    id: "scientificName",
    header: ({ column }) => (
      <SortableHeader column={column}>
        {t("table.scientificName")}
      </SortableHeader>
    ),
    cell: (info) => {
      const species = info.row.original;
      return (
        <div>
          <div className="text-wrap italic font-medium">{info.getValue()}</div>
          {species.scientific_name.note && (
            <div className="text-blue-400 text-xs mt-1 text-wrap">
              {species.scientific_name.note}
            </div>
          )}
          {species.note && (
            <div className="text-blue-400 text-xs mt-1 text-wrap">
              {species.note}
            </div>
          )}
        </div>
      );
    },
    size: 200,
    minSize: 120,
    maxSize: 400,
  });
}

export function createCommonNameColumn(t: TranslationFunction) {
  return columnHelper.accessor("common_name.value", {
    id: "commonName",
    header: ({ column }) => (
      <SortableHeader column={column}>{t("table.commonName")}</SortableHeader>
    ),
    cell: (info) => {
      const species = info.row.original;
      return (
        <div className="text-sm">
          <div className="text-wrap">{info.getValue()}</div>
          {species.common_name.note && (
            <div className="text-blue-400 text-xs text-wrap mt-1">
              {species.common_name.note}
            </div>
          )}
        </div>
      );
    },
    size: 220,
    minSize: 120,
    maxSize: 400,
  });
}
