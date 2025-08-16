// Types for better type safety
export interface TaxonomicDetails {
  kingdom: boolean;
  phylum: boolean;
  class: boolean;
  order: boolean;
  family: boolean;
}

export interface TranslationFunction {
  (key: string): string;
}

export interface ExtendedSpecies {
  scientific_name: { value: string; note: string };
  common_name: { value: string; note: string };
  kingdom_latin: string;
  kingdom_vi: string;
  phylum_latin: string;
  phylum_vi: string;
  class_latin: string;
  class_vi: string;
  order_latin: string;
  order_vi: string;
  family_latin: string;
  family_vi: string;
  laws: Array<{
    name: string | { vi: string; en: string };
    value: string;
    note: string;
  }>;
  note?: string;
  documentId: string;
  documentName: string;
  isSharedSpecies: boolean;
}
