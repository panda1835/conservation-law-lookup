"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { SpeciesImageThumbnail } from "@/components/home/SpeciesImageThumbnail";
import ChuThich from "@/components/home/ChuThich";
import imagesData from "@/lib/images.json";
import {
  LEGAL_DOCUMENTS,
  type Species,
  type LawEntry,
} from "@/data/legalDocuments";
import {
  normalizeScientificName,
  getLongestNote,
  getLongestValue,
} from "@/lib/utils";
// Types for better type safety
interface TaxonomicDetails {
  kingdom: boolean;
  phylum: boolean;
  class: boolean;
  order: boolean;
  family: boolean;
}

interface TranslationFunction {
  (key: string): string;
}

const getSpeciesImages = (scientificName: string) => {
  const normalizedName = normalizeScientificName(scientificName);
  const images = imagesData as Record<
    string,
    Array<{ image_url: string; attribute: string }>
  >;
  return images[normalizedName] || [];
};

const DocumentSelector = ({
  selectedDocuments,
  handleDocumentChange,
  locale,
  t,
}: {
  selectedDocuments: string[];
  handleDocumentChange: (docId: string, checked: boolean) => void;
  locale: string;
  t: TranslationFunction;
}) => (
  <div className="space-y-2">
    <Label className="text-base font-semibold">
      {t("controls.legalDocuments")}
    </Label>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {LEGAL_DOCUMENTS.map((doc) => (
        <div key={doc.id} className="flex items-center space-x-2">
          <Checkbox
            id={doc.id}
            checked={selectedDocuments.includes(doc.id)}
            onCheckedChange={(checked) =>
              handleDocumentChange(doc.id, checked as boolean)
            }
          />
          <Label
            htmlFor={doc.id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {doc.name[locale as "vi" | "en"].split(":")[0]} ({doc.data.length}{" "}
            {t("results.species")})
          </Label>
        </div>
      ))}
    </div>
  </div>
);

const SearchInput = ({
  searchTerm,
  setSearchTerm,
  t,
}: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  t: TranslationFunction;
}) => (
  <div className="space-y-2">
    <Label htmlFor="search" className="text-base font-semibold">
      {t("controls.searchSpecies")}
    </Label>
    <Input
      id="search"
      placeholder={t("controls.searchPlaceholder")}
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="max-w-md"
    />
  </div>
);

const TaxonomicDetailsToggle = ({
  showTaxonomicDetails,
  setShowTaxonomicDetails,
  t,
}: {
  showTaxonomicDetails: TaxonomicDetails;
  setShowTaxonomicDetails: React.Dispatch<
    React.SetStateAction<TaxonomicDetails>
  >;
  t: TranslationFunction;
}) => (
  <div className="space-y-3">
    <Label className="text-base font-semibold">
      {t("controls.taxonomicDetails")}
    </Label>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {[
        { key: "kingdom", label: t("controls.kingdom") },
        { key: "phylum", label: t("controls.phylum") },
        { key: "class", label: t("controls.class") },
        { key: "order", label: t("controls.order") },
        { key: "family", label: t("controls.family") },
      ].map(({ key, label }) => (
        <div key={key} className="flex items-center space-x-2">
          <Checkbox
            id={key}
            checked={
              showTaxonomicDetails[key as keyof typeof showTaxonomicDetails]
            }
            onCheckedChange={(checked) =>
              setShowTaxonomicDetails((prev) => ({
                ...prev,
                [key]: checked as boolean,
              }))
            }
          />
          <Label
            htmlFor={key}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t("controls.show")} {label}
          </Label>
        </div>
      ))}
    </div>
  </div>
);

export default function Home() {
  const t = useTranslations();
  const locale = useLocale();
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([
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
    const result: Array<
      Species & {
        documentId: string;
        documentName: string;
        isSharedSpecies: boolean;
      }
    > = [];

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
            const lawName = law.name[locale as "vi" | "en"];
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
        species.common_name.value.toLowerCase().includes(searchLower) ||
        species.class_vi.toLowerCase().includes(searchLower) ||
        species.order_vi.toLowerCase().includes(searchLower) ||
        species.family_vi.toLowerCase().includes(searchLower)
    );
  }, [combinedData, searchTerm]);

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

          {/* Data Table */}
          {selectedDocuments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t("table.title")}</CardTitle>
                <CardDescription>
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
                            const doc = LEGAL_DOCUMENTS.find(
                              (d) => d.id === docId
                            );
                            if (!doc) return null;
                            const categories =
                              documentLawCategories[docId] || [];
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
                            const doc = LEGAL_DOCUMENTS.find(
                              (d) => d.id === docId
                            );
                            if (!doc) return null;
                            const categories =
                              documentLawCategories[docId] || [];

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
                              species.isSharedSpecies
                                ? "merged"
                                : species.documentId
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
                              const doc = LEGAL_DOCUMENTS.find(
                                (d) => d.id === docId
                              );
                              if (!doc) return null;
                              const categories =
                                documentLawCategories[docId] || [];
                              const shouldShowData =
                                species.isSharedSpecies ||
                                species.documentId === docId;

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
                                              : status === "IIA" ||
                                                status === "IIB"
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
                                  const relevantLaw = species.laws.find(
                                    (law) => {
                                      const lawName =
                                        typeof law.name === "string"
                                          ? law.name
                                          : law.name[locale as "vi" | "en"];
                                      return lawName === category;
                                    }
                                  );
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
                                              : status === "IIA" ||
                                                status === "IIB"
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
          )}

          {selectedDocuments.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-muted-foreground">
                  <p>{t("empty.selectDocument")}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Legal Documents Reference */}
          <ChuThich />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
