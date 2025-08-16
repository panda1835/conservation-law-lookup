import { useMemo } from "react";
import { LEGAL_DOCUMENTS } from "@/data/legalDocuments";
import type {
  TaxonomicDetails,
  TranslationFunction,
  ExtendedSpecies,
} from "@/types/species";

interface UseCSVExportProps {
  filteredData: ExtendedSpecies[];
  selectedDocuments: string[];
  documentLawCategories: Record<string, string[]>;
  showTaxonomicDetails: TaxonomicDetails;
  locale: string;
  t: TranslationFunction;
}

export const useCSVExport = ({
  filteredData,
  selectedDocuments,
  documentLawCategories,
  showTaxonomicDetails,
  locale,
  t,
}: UseCSVExportProps) => {
  const exportToCSV = useMemo(
    () => () => {
      if (filteredData.length === 0) return;

      // Create CSV headers
      const headers = [t("table.scientificName"), t("table.commonName")];

      // Add taxonomic headers if enabled
      if (showTaxonomicDetails.kingdom) {
        headers.push(t("table.kingdomLatin"), t("table.kingdomVietnamese"));
      }
      if (showTaxonomicDetails.phylum) {
        headers.push(t("table.phylumLatin"), t("table.phylumVietnamese"));
      }
      if (showTaxonomicDetails.class) {
        headers.push(t("table.classLatin"), t("table.classVietnamese"));
      }
      if (showTaxonomicDetails.order) {
        headers.push(t("table.orderLatin"), t("table.orderVietnamese"));
      }
      if (showTaxonomicDetails.family) {
        headers.push(t("table.familyLatin"), t("table.familyVietnamese"));
      }

      // Add legal document headers
      selectedDocuments.forEach((docId) => {
        const doc = LEGAL_DOCUMENTS.find((d) => d.id === docId);
        if (doc) {
          const categories = documentLawCategories[docId] || [];
          if (categories.length === 0) {
            headers.push(doc.shortName[locale as "vi" | "en"]);
          } else {
            categories.forEach((category) => {
              headers.push(
                `"${doc.shortName[locale as "vi" | "en"]} - ${category}"`
              );
            });
          }
        }
      });

      // Create CSV rows
      const csvRows = [headers.join(",")];

      filteredData.forEach((species) => {
        const row = [
          `"${species.scientific_name.value}${
            species.scientific_name.note
              ? ` (${species.scientific_name.note})`
              : ""
          }"`,
          `"${species.common_name.value}${
            species.common_name.note ? ` (${species.common_name.note})` : ""
          }"`,
        ];

        // Add taxonomic data
        if (showTaxonomicDetails.kingdom) {
          row.push(
            `"${species.kingdom_latin || ""}"`,
            `"${species.kingdom_vi || ""}"`
          );
        }
        if (showTaxonomicDetails.phylum) {
          row.push(
            `"${species.phylum_latin || ""}"`,
            `"${species.phylum_vi || ""}"`
          );
        }
        if (showTaxonomicDetails.class) {
          row.push(`"${species.class_latin}"`, `"${species.class_vi}"`);
        }
        if (showTaxonomicDetails.order) {
          row.push(`"${species.order_latin}"`, `"${species.order_vi}"`);
        }
        if (showTaxonomicDetails.family) {
          row.push(`"${species.family_latin}"`, `"${species.family_vi}"`);
        }

        // Add legal status data
        selectedDocuments.forEach((docId) => {
          const doc = LEGAL_DOCUMENTS.find((d) => d.id === docId);
          if (doc) {
            const categories = documentLawCategories[docId] || [];
            const shouldShowData =
              species.isSharedSpecies || species.documentId === docId;

            if (categories.length === 0) {
              let status = "";
              let note = "";
              if (shouldShowData && species.laws.length > 0) {
                status = species.laws[0]?.value || "";
                note = species.laws[0]?.note || "";
              }
              row.push(`"${status}${note ? ` (${note})` : ""}"`);
            } else {
              categories.forEach((category) => {
                let status = "";
                let note = "";
                if (shouldShowData) {
                  const relevantLaw = species.laws.find((law) => {
                    const lawName =
                      typeof law.name === "string"
                        ? law.name
                        : law.name[locale as "vi" | "en"];
                    return lawName === category;
                  });
                  status = relevantLaw?.value || "";
                  note = relevantLaw?.note || "";
                }
                row.push(`"${status}${note ? ` (${note})` : ""}"`);
              });
            }
          }
        });

        csvRows.push(row.join(","));
      });

      // Create and download CSV file
      const csvContent = csvRows.join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
          "download",
          `${t("table.exportFileName")}-${
            new Date().toISOString().split("T")[0]
          }.csv`
        );
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
    [
      filteredData,
      selectedDocuments,
      documentLawCategories,
      showTaxonomicDetails,
      locale,
      t,
    ]
  );

  return { exportToCSV };
};
