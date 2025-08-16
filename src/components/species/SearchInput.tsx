"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TranslationFunction } from "@/types/species";

interface SearchInputProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  t: TranslationFunction;
}

export const SearchInput = ({
  searchTerm,
  setSearchTerm,
  t,
}: SearchInputProps) => (
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
