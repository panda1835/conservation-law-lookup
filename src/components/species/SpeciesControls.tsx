"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DocumentSelector } from "./DocumentSelector";
import { SearchInput } from "./SearchInput";
import { TaxonomicDetailsToggle } from "./TaxonomicDetailsToggle";
import type { TaxonomicDetails, TranslationFunction } from "@/types/species";

interface SpeciesControlsProps {
  selectedDocuments: string[];
  handleDocumentChange: (docId: string, checked: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showTaxonomicDetails: TaxonomicDetails;
  setShowTaxonomicDetails: React.Dispatch<
    React.SetStateAction<TaxonomicDetails>
  >;
  locale: string;
  t: TranslationFunction;
}

export const SpeciesControls = ({
  selectedDocuments,
  handleDocumentChange,
  searchTerm,
  setSearchTerm,
  showTaxonomicDetails,
  setShowTaxonomicDetails,
  locale,
  t,
}: SpeciesControlsProps) => (
  <Card>
    <CardContent className="space-y-4">
      {/* Legal Document Selection */}
      <DocumentSelector
        selectedDocuments={selectedDocuments}
        handleDocumentChange={handleDocumentChange}
        locale={locale}
        t={t}
      />

      <Separator />

      {/* Search */}
      <SearchInput
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        t={t}
      />

      <Separator />

      {/* Taxonomic Details Toggle */}
      <TaxonomicDetailsToggle
        showTaxonomicDetails={showTaxonomicDetails}
        setShowTaxonomicDetails={setShowTaxonomicDetails}
        t={t}
      />
    </CardContent>
  </Card>
);
