"use client";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { TaxonomicDetails, TranslationFunction } from "@/types/species";

interface TaxonomicDetailsToggleProps {
  showTaxonomicDetails: TaxonomicDetails;
  setShowTaxonomicDetails: React.Dispatch<
    React.SetStateAction<TaxonomicDetails>
  >;
  t: TranslationFunction;
}

export const TaxonomicDetailsToggle = ({
  showTaxonomicDetails,
  setShowTaxonomicDetails,
  t,
}: TaxonomicDetailsToggleProps) => (
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
