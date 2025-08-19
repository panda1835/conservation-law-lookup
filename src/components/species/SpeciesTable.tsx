"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { SpeciesImageThumbnail } from "@/components/home/SpeciesImageThumbnail";
import { LEGAL_DOCUMENTS } from "@/data/legalDocuments";
import { getSpeciesImages } from "@/utils/species";
import type {
  ExtendedSpecies,
  TaxonomicDetails,
  TranslationFunction,
} from "@/types/species";

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
  onExportCSV,
}: SpeciesTableProps) => {
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
                <span className="font-bold">{filteredData.length}</span>{" "}
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
          <Button
            onClick={onExportCSV}
            disabled={filteredData.length === 0}
            className="ml-4 shrink-0 hidden md:block w-fit"
            variant="default"
          >
            <div className="flex items-center">
              <Download className="w-4 h-4 mr-3" />
              {t("table.exportCSV")}
            </div>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto overflow-y-auto max-h-[600px] border rounded-md">
          <div style={{ minWidth: "1200px" }}>
            <Table>
              <TableHeader className="sticky top-0 z-30">
                <TableRow>
                  {/* Image column - frozen */}
                  <TableHead
                    rowSpan={2}
                    className="w-32 sticky left-0 bg-background z-40 border-r shadow-md"
                  >
                    <div className="flex justify-center w-full">
                      {t("table.image")}
                    </div>
                  </TableHead>

                  {/* Scientific name column - frozen */}
                  <TableHead
                    rowSpan={2}
                    className="w-48 sticky left-32 bg-background z-40 border-r shadow-md"
                  >
                    {t("table.scientificName")}
                  </TableHead>

                  {/* Common name column - NOT frozen */}
                  <TableHead
                    rowSpan={2}
                    className="w-56 bg-background border-r shadow-md"
                  >
                    {t("table.commonName")}
                  </TableHead>

                  {/* Taxonomic columns */}
                  {showTaxonomicDetails.kingdom && (
                    <>
                      <TableHead
                        rowSpan={2}
                        className="max-w-[80px] truncate text-xs text-center"
                      >
                        {t("table.kingdomLatin")}
                      </TableHead>
                      <TableHead
                        rowSpan={2}
                        className="max-w-[80px] truncate text-xs text-center"
                      >
                        {t("table.kingdomVietnamese")}
                      </TableHead>
                    </>
                  )}
                  {showTaxonomicDetails.phylum && (
                    <>
                      <TableHead
                        rowSpan={2}
                        className="max-w-[80px] truncate text-xs text-center"
                      >
                        {t("table.phylumLatin")}
                      </TableHead>
                      <TableHead
                        rowSpan={2}
                        className="max-w-[80px] truncate text-xs text-center"
                      >
                        {t("table.phylumVietnamese")}
                      </TableHead>
                    </>
                  )}
                  {showTaxonomicDetails.class && (
                    <>
                      <TableHead
                        rowSpan={2}
                        className="max-w-[80px] truncate text-xs text-center"
                      >
                        {t("table.classLatin")}
                      </TableHead>
                      <TableHead
                        rowSpan={2}
                        className="max-w-[80px] truncate text-xs text-center"
                      >
                        {t("table.classVietnamese")}
                      </TableHead>
                    </>
                  )}
                  {showTaxonomicDetails.order && (
                    <>
                      <TableHead
                        rowSpan={2}
                        className="max-w-[80px] truncate text-xs text-center"
                      >
                        {t("table.orderLatin")}
                      </TableHead>
                      <TableHead
                        rowSpan={2}
                        className="max-w-[80px] truncate text-xs text-center"
                      >
                        {t("table.orderVietnamese")}
                      </TableHead>
                    </>
                  )}
                  {showTaxonomicDetails.family && (
                    <>
                      <TableHead
                        rowSpan={2}
                        className="max-w-[80px] truncate text-xs text-center"
                      >
                        {t("table.familyLatin")}
                      </TableHead>
                      <TableHead
                        rowSpan={2}
                        className="max-w-[80px] truncate text-xs text-center"
                      >
                        {t("table.familyVietnamese")}
                      </TableHead>
                    </>
                  )}

                  {/* Legal document columns */}
                  {selectedDocuments.map((docId) => {
                    const doc = LEGAL_DOCUMENTS.find((d) => d.id === docId);
                    if (!doc) return null;
                    const categories = documentLawCategories[docId] || [];
                    const colSpan = Math.max(1, categories.length);

                    return (
                      <TableHead
                        key={docId}
                        colSpan={colSpan}
                        className="text-center border-l w-auto"
                      >
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline text-blue-600 dark:text-blue-400 font-medium text-sm truncate block"
                        >
                          {doc.shortName[locale as "vi" | "en"]}
                        </a>
                      </TableHead>
                    );
                  })}
                </TableRow>

                {/* Second header row for legal subcategories */}
                <TableRow className="sticky top-[40px] z-30 bg-background">
                  {selectedDocuments.map((docId) => {
                    const doc = LEGAL_DOCUMENTS.find((d) => d.id === docId);
                    if (!doc) return null;
                    const categories = documentLawCategories[docId] || [];

                    if (categories.length === 0) {
                      return (
                        <TableHead
                          key={`${docId}-sub`}
                          className="text-xs border-l max-w-[80px] text-center p-2 truncate"
                        >
                          {t("table.status")}
                        </TableHead>
                      );
                    }

                    return categories.map((category, idx) => (
                      <TableHead
                        key={`${docId}-${category}-${idx}`}
                        className="text-xs border-l max-w-[80px] text-center p-2 "
                      >
                        <div className="text-wrap">{category}</div>
                      </TableHead>
                    ));
                  })}
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredData.map((species, index) => (
                  <TableRow
                    key={`${species.scientific_name}-${
                      species.isSharedSpecies ? "merged" : species.documentId
                    }-${index}`}
                  >
                    {/* Image - frozen */}
                    <TableCell className="sticky left-0 bg-background z-20 border-r p-2 ">
                      <div className="flex justify-center w-full">
                        <SpeciesImageThumbnail
                          images={getSpeciesImages(
                            species.scientific_name.value
                          )}
                          speciesName={species.scientific_name.value}
                        />
                      </div>
                    </TableCell>

                    {/* Scientific name - frozen */}
                    <TableCell className="font-medium italic sticky left-32 bg-background z-20 border-r p-2">
                      <div className="w-60">
                        <div
                          className="truncate"
                          title={species.scientific_name.value}
                        >
                          <div className=" text-wrap">
                            {species.scientific_name.value}
                          </div>
                          {species.scientific_name.note && (
                            <div className="text-blue-400 text-xs mt-1 text-wrap">
                              {species.scientific_name.note}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="left-84 bg-background z-20 border-r p-2">
                      <div
                        className="w-72 text-sm"
                        title={species.common_name.value}
                      >
                        <div className="text-wrap">
                          {species.common_name.value}
                        </div>
                        {species.common_name.note && (
                          <div className="text-blue-400 text-xs text-wrap mt-1">
                            {species.common_name.note}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Taxonomic data */}
                    {showTaxonomicDetails.kingdom && (
                      <>
                        <TableCell
                          className="text-xs italic p-2 truncate max-w-[80px]"
                          title={species.kingdom_latin || ""}
                        >
                          {species.kingdom_latin || ""}
                        </TableCell>
                        <TableCell
                          className="text-xs p-2 truncate max-w-[80px]"
                          title={species.kingdom_vi || ""}
                        >
                          {species.kingdom_vi || ""}
                        </TableCell>
                      </>
                    )}
                    {showTaxonomicDetails.phylum && (
                      <>
                        <TableCell
                          className="text-xs italic p-2 truncate max-w-[80px]"
                          title={species.phylum_latin || ""}
                        >
                          {species.phylum_latin || ""}
                        </TableCell>
                        <TableCell
                          className="text-xs p-2 truncate max-w-[80px]"
                          title={species.phylum_vi || ""}
                        >
                          {species.phylum_vi || ""}
                        </TableCell>
                      </>
                    )}
                    {showTaxonomicDetails.class && (
                      <>
                        <TableCell
                          className="text-xs italic p-2 truncate max-w-[80px]"
                          title={species.class_latin}
                        >
                          {species.class_latin}
                        </TableCell>
                        <TableCell
                          className="text-xs p-2 truncate max-w-[80px]"
                          title={species.class_vi}
                        >
                          {species.class_vi}
                        </TableCell>
                      </>
                    )}
                    {showTaxonomicDetails.order && (
                      <>
                        <TableCell
                          className="text-xs italic p-2 truncate max-w-[80px]"
                          title={species.order_latin}
                        >
                          {species.order_latin}
                        </TableCell>
                        <TableCell
                          className="text-xs p-2 truncate max-w-[80px]"
                          title={species.order_vi}
                        >
                          {species.order_vi}
                        </TableCell>
                      </>
                    )}
                    {showTaxonomicDetails.family && (
                      <>
                        <TableCell
                          className="text-xs italic p-2 truncate max-w-[80px]"
                          title={species.family_latin}
                        >
                          {species.family_latin}
                        </TableCell>
                        <TableCell
                          className="text-xs p-2 truncate max-w-[80px]"
                          title={species.family_vi}
                        >
                          {species.family_vi}
                        </TableCell>
                      </>
                    )}

                    {/* Legal status columns */}
                    {selectedDocuments.map((docId) => {
                      const doc = LEGAL_DOCUMENTS.find((d) => d.id === docId);
                      if (!doc) return null;
                      const categories = documentLawCategories[docId] || [];

                      // Fix Issue 2: Only show data if the species actually exists in this document
                      // For shared species, check if this specific document contains the species
                      const shouldShowData = species.isSharedSpecies
                        ? species.documentIds?.has(docId) ?? false
                        : species.documentId === docId;

                      if (categories.length === 0) {
                        let status = "";
                        let note = "";
                        if (shouldShowData && species.laws.length > 0) {
                          status = species.laws[0]?.value || "";
                          note = species.laws[0]?.note || "";
                        }
                        return (
                          <TableCell
                            key={`${docId}`}
                            className="border-l text-center p-2 max-w-[80px] truncate"
                          >
                            {status && (
                              <div>
                                <Badge
                                  className={`text-xs px-2 py-1 ${
                                    status === "IB" || status === "IA"
                                      ? "bg-red-600"
                                      : status === "IIA" || status === "IIB"
                                      ? "bg-yellow-600"
                                      : "bg-transparent text-black"
                                  }`}
                                >
                                  {status}
                                </Badge>
                                <div className="text-blue-400 text-xs">
                                  {note}
                                </div>
                              </div>
                            )}
                          </TableCell>
                        );
                      }

                      return categories.map((category, idx) => {
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
                        return (
                          <TableCell
                            key={`${docId}-${category}-${idx}`}
                            className="border-l text-center p-2 max-w-[80px] truncate "
                          >
                            {status && (
                              <div>
                                <Badge
                                  className={`text-xs px-2 py-1 ${
                                    status === "IB" || status === "IA"
                                      ? "bg-red-600"
                                      : status === "IIA" || status === "IIB"
                                      ? "bg-yellow-600"
                                      : "bg-transparent text-black"
                                  }`}
                                >
                                  {status}
                                </Badge>
                                <div className="text-blue-400 mt-2 text-xs text-wrap">
                                  {note}
                                </div>
                              </div>
                            )}
                          </TableCell>
                        );
                      });
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
