"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { SpeciesControls } from "@/components/species/SpeciesControls";
import { SpeciesTable } from "@/components/species/SpeciesTable";
import ChuThich from "@/components/home/ChuThich";
import { useSpeciesData } from "@/hooks/useSpeciesData";
import { useCSVExport } from "@/hooks/useCSVExport";
import type { TaxonomicDetails } from "@/types/species";

export default function Home() {
  const t = useTranslations();
  const locale = useLocale();
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([
    "vnredlist",
    "tt27",
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showTaxonomicDetails, setShowTaxonomicDetails] =
    useState<TaxonomicDetails>({
      kingdom: false,
      phylum: false,
      class: false,
      order: false,
      family: false,
    });

  // Use custom hooks for data processing
  const { filteredData, documentLawCategories } = useSpeciesData({
    selectedDocuments,
    searchTerm,
    locale,
  });

  // Use custom hook for CSV export
  const { exportToCSV } = useCSVExport({
    filteredData,
    selectedDocuments,
    documentLawCategories,
    showTaxonomicDetails,
    locale,
    t,
  });

  const handleDocumentChange = (docId: string, checked: boolean) => {
    if (checked) {
      setSelectedDocuments((prev) => [...prev, docId]);
    } else {
      setSelectedDocuments((prev) => prev.filter((id) => id !== docId));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="container mx-auto p-6 space-y-6">
          {/* Header with Language Switcher */}
          <Header />

          {/* Controls */}
          <SpeciesControls
            selectedDocuments={selectedDocuments}
            handleDocumentChange={handleDocumentChange}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            showTaxonomicDetails={showTaxonomicDetails}
            setShowTaxonomicDetails={setShowTaxonomicDetails}
            locale={locale}
            t={t}
          />

          {/* Data Table */}
          <SpeciesTable
            filteredData={filteredData}
            selectedDocuments={selectedDocuments}
            documentLawCategories={documentLawCategories}
            showTaxonomicDetails={showTaxonomicDetails}
            searchTerm={searchTerm}
            locale={locale}
            t={t}
            onExportCSV={exportToCSV}
          />

          {/* Legal Documents Reference */}
          <ChuThich selectedDocuments={selectedDocuments} />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
