"use client";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { LEGAL_DOCUMENTS } from "@/data/legalDocuments";
import type { TranslationFunction } from "@/types/species";

interface DocumentSelectorProps {
  selectedDocuments: string[];
  handleDocumentChange: (docId: string, checked: boolean) => void;
  locale: string;
  t: TranslationFunction;
}

export const DocumentSelector = ({
  selectedDocuments,
  handleDocumentChange,
  locale,
  t,
}: DocumentSelectorProps) => (
  <div className="space-y-2">
    <Label className="text-base font-semibold mb-3">
      {t("controls.legalDocuments")}
    </Label>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 space-y-2 md:space-y-0">
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
