"use client";

import { useMemo } from "react";
import {
  LEGAL_DOCUMENTS,
  type Species,
  type LawEntry,
} from "@/data/legalDocuments";
import { getLongestNote, getLongestValue } from "@/lib/utils";
import type { ExtendedSpecies } from "@/types/species";

interface UseSpeciesDataProps {
  selectedDocuments: string[];
  searchTerm: string;
}

export const useSpeciesData = ({
  selectedDocuments,
  searchTerm,
}: UseSpeciesDataProps) => {
  // Create combined data from all selected documents with proper merging
  const combinedData = useMemo(() => {
    if (selectedDocuments.length === 0) return [];

    // First, collect all unique species by scientific name
    const speciesMap = new Map<
      string,
      {
        allVariants: Species[];
        documentIds: Set<string>;
        documentNames: Set<string>;
        allLaws: LawEntry[];
      }
    >();

    selectedDocuments.forEach((docId) => {
      const doc = LEGAL_DOCUMENTS.find((d) => d.id === docId);
      if (doc) {
        doc.data.forEach((species) => {
          const key = species.scientific_name.value;

          if (speciesMap.has(key)) {
            // Merge with existing species
            const existing = speciesMap.get(key)!;
            existing.allVariants.push(species);
            existing.documentIds.add(docId);
            existing.documentNames.add(doc.shortName.vi);
            // Merge laws arrays
            const existingLawNames = new Set(
              existing.allLaws.map((law) =>
                typeof law.name === "string" ? law.name : law.name.vi
              )
            );
            species.laws.forEach((law) => {
              const lawName =
                typeof law.name === "string" ? law.name : law.name.vi;
              if (!existingLawNames.has(lawName)) {
                existing.allLaws.push(law);
              }
            });
          } else {
            // Add new species
            speciesMap.set(key, {
              allVariants: [species],
              documentIds: new Set([docId]),
              documentNames: new Set([doc.shortName.vi]),
              allLaws: [...species.laws],
            });
          }
        });
      }
    });

    // Convert to array and create individual rows
    const result: ExtendedSpecies[] = [];

    speciesMap.forEach((speciesGroup, scientificName) => {
      // A species is shared only if it appears in multiple documents AND we have multiple documents selected
      const isSharedSpecies =
        selectedDocuments.length > 1 && speciesGroup.documentIds.size > 1;

      if (isSharedSpecies) {
        // For shared species, use the longest values for display
        const mergedSpecies: Species = {
          scientific_name: {
            value: scientificName,
            note: getLongestNote(
              speciesGroup.allVariants.map((s) => s.scientific_name.note)
            ),
          },
          common_name: {
            value: getLongestValue(
              speciesGroup.allVariants.map((s) => s.common_name.value)
            ),
            note: getLongestNote(
              speciesGroup.allVariants.map((s) => s.common_name.note)
            ),
          },
          kingdom_latin: getLongestValue(
            speciesGroup.allVariants.map((s) => s.kingdom_latin)
          ),
          kingdom_vi: getLongestValue(
            speciesGroup.allVariants.map((s) => s.kingdom_vi)
          ),
          phylum_latin: getLongestValue(
            speciesGroup.allVariants.map((s) => s.phylum_latin)
          ),
          phylum_vi: getLongestValue(
            speciesGroup.allVariants.map((s) => s.phylum_vi)
          ),
          class_latin: getLongestValue(
            speciesGroup.allVariants.map((s) => s.class_latin)
          ),
          class_vi: getLongestValue(
            speciesGroup.allVariants.map((s) => s.class_vi)
          ),
          order_latin: getLongestValue(
            speciesGroup.allVariants.map((s) => s.order_latin)
          ),
          order_vi: getLongestValue(
            speciesGroup.allVariants.map((s) => s.order_vi)
          ),
          family_latin: getLongestValue(
            speciesGroup.allVariants.map((s) => s.family_latin)
          ),
          family_vi: getLongestValue(
            speciesGroup.allVariants.map((s) => s.family_vi)
          ),
          laws: speciesGroup.allLaws,
          note: getLongestValue(
            speciesGroup.allVariants.map((s) => s.note || "")
          ),
        };

        result.push({
          ...mergedSpecies,
          documentId: "merged",
          documentName: Array.from(speciesGroup.documentNames).join(", "),
          isSharedSpecies: true,
        });
      } else {
        // For non-shared species, show each individual entry (do not merge duplicates within same document)
        speciesGroup.allVariants.forEach((species) => {
          const docId =
            selectedDocuments.find((id) => {
              const doc = LEGAL_DOCUMENTS.find((d) => d.id === id);
              return doc?.data.some((s) => s === species);
            }) || selectedDocuments[0];

          const doc = LEGAL_DOCUMENTS.find((d) => d.id === docId);

          result.push({
            ...species,
            documentId: docId,
            documentName: doc?.shortName.vi || "",
            isSharedSpecies: false,
          });
        });
      }
    });

    // Sort by scientific name for consistency
    return result.sort((a, b) =>
      a.scientific_name.value.localeCompare(b.scientific_name.value)
    );
  }, [selectedDocuments]);

  // Get law categories for each document
  const documentLawCategories = useMemo(() => {
    const docCategories: Record<string, string[]> = {};
    selectedDocuments.forEach((docId) => {
      const doc = LEGAL_DOCUMENTS.find((d) => d.id === docId);
      if (doc) {
        const categories = new Set<string>();
        doc.data.forEach((species) => {
          species.laws.forEach((law) => {
            const lawName =
              typeof law.name === "string" ? law.name : law.name.vi;
            categories.add(lawName);
          });
        });
        docCategories[docId] = Array.from(categories);
      }
    });
    return docCategories;
  }, [selectedDocuments]);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return combinedData;

    const searchLower = searchTerm.toLowerCase();
    return combinedData.filter(
      (species) =>
        species.scientific_name.value.toLowerCase().includes(searchLower) ||
        species.scientific_name.note.toLowerCase().includes(searchLower) ||
        species.common_name.value.toLowerCase().includes(searchLower) ||
        species.common_name.note.toLowerCase().includes(searchLower) ||
        species.class_vi.toLowerCase().includes(searchLower) ||
        species.order_vi.toLowerCase().includes(searchLower) ||
        species.family_vi.toLowerCase().includes(searchLower)
    );
  }, [combinedData, searchTerm]);

  return {
    combinedData,
    filteredData,
    documentLawCategories,
  };
};
