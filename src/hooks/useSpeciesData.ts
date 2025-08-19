"use client";

import { useMemo } from "react";
import {
  LEGAL_DOCUMENTS,
  type Species,
  type LawEntry,
} from "@/data/legalDocuments";
import type { ExtendedSpecies } from "@/types/species";

// Helper function to extract year from document ID or name
const extractDocumentYear = (docId: string): number => {
  const doc = LEGAL_DOCUMENTS.find((d) => d.id === docId);
  if (!doc) return 0;

  // Extract year from shortName (e.g., "NĐ 160/2013", "TT 27/2025")
  const yearMatch = doc.shortName.vi.match(/(\d{4})/);
  if (yearMatch) {
    return parseInt(yearMatch[1], 10);
  }

  // Fallback: try to extract from ID (e.g., "nd84" might indicate 2084, but we know it's 2021)
  // This is a fallback that shouldn't normally be needed
  return 0;
};

// Helper function to get the most recent species data based on document chronology
const getMostRecentSpeciesData = (
  variants: Species[],
  documentIds: Set<string>
): Species => {
  // Sort document IDs by year in descending order (most recent first)
  const sortedDocIds = Array.from(documentIds).sort((a, b) => {
    const yearA = extractDocumentYear(a);
    const yearB = extractDocumentYear(b);
    return yearB - yearA; // Descending order (2025 -> 2021 -> 2019 -> 2013)
  });

  // Find the species from the most recent document
  for (const docId of sortedDocIds) {
    const doc = LEGAL_DOCUMENTS.find((d) => d.id === docId);
    if (doc) {
      const speciesFromDoc = variants.find((species) =>
        doc.data.some((s) => s === species)
      );
      if (speciesFromDoc) {
        return speciesFromDoc;
      }
    }
  }

  // Fallback to first variant if no match found
  return variants[0];
};

interface UseSpeciesDataProps {
  selectedDocuments: string[];
  searchTerm: string;
  locale: string;
}

export const useSpeciesData = ({
  selectedDocuments,
  searchTerm,
  locale,
}: UseSpeciesDataProps) => {
  // Create combined data from all selected documents with proper merging
  const combinedData = useMemo(() => {
    if (selectedDocuments.length === 0) return [];

    // Create a map keyed by scientific name only for merging
    // Species with the same scientific name will be merged, using data from the most recent document
    const speciesMap = new Map<
      string,
      {
        allVariants: Species[];
        documentIds: Set<string>;
        documentNames: Set<string>;
        allLaws: LawEntry[];
        originalSpecies: Species; // Keep track of the original species for accurate document mapping
      }
    >();

    selectedDocuments.forEach((docId) => {
      const doc = LEGAL_DOCUMENTS.find((d) => d.id === docId);
      if (doc) {
        doc.data.forEach((species) => {
          // Use only scientific name as the key for merging
          // This ensures species with same scientific name but different common names get merged
          const key = species.scientific_name.value;

          if (speciesMap.has(key)) {
            // Merge with existing species (same scientific name AND common name)
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
              originalSpecies: species,
            });
          }
        });
      }
    });

    // Convert to array and create individual rows
    const result: ExtendedSpecies[] = [];

    speciesMap.forEach((speciesGroup, scientificName) => {
      // The key is already the scientific name

      // A species is shared only if it appears in multiple documents AND we have multiple documents selected
      const isSharedSpecies =
        selectedDocuments.length > 1 && speciesGroup.documentIds.size > 1;

      if (isSharedSpecies) {
        // For shared species, use data from the most recent document based on chronological order
        const mostRecentSpecies = getMostRecentSpeciesData(
          speciesGroup.allVariants,
          speciesGroup.documentIds
        );

        const mergedSpecies: Species = {
          scientific_name: {
            value: scientificName,
            note: mostRecentSpecies.scientific_name.note,
          },
          common_name: {
            value: mostRecentSpecies.common_name.value,
            note: mostRecentSpecies.common_name.note,
          },
          kingdom_latin: mostRecentSpecies.kingdom_latin,
          kingdom_vi: mostRecentSpecies.kingdom_vi,
          phylum_latin: mostRecentSpecies.phylum_latin,
          phylum_vi: mostRecentSpecies.phylum_vi,
          class_latin: mostRecentSpecies.class_latin,
          class_vi: mostRecentSpecies.class_vi,
          order_latin: mostRecentSpecies.order_latin,
          order_vi: mostRecentSpecies.order_vi,
          family_latin: mostRecentSpecies.family_latin,
          family_vi: mostRecentSpecies.family_vi,
          laws: speciesGroup.allLaws,
          note: mostRecentSpecies.note,
        };

        result.push({
          ...mergedSpecies,
          documentId: "merged",
          documentName: Array.from(speciesGroup.documentNames).join(", "),
          isSharedSpecies: true,
          // Add metadata to track which documents actually contain this exact species variant
          documentIds: speciesGroup.documentIds,
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
              typeof law.name === "string"
                ? law.name
                : law.name[locale as "vi" | "en"];
            categories.add(lawName);
          });
        });
        docCategories[docId] = Array.from(categories);
      }
    });
    return docCategories;
  }, [selectedDocuments, locale]);

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
