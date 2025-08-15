"use client";

import { useTranslations, useLocale } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { LEGAL_DOCUMENTS } from "@/data/legalDocuments";

export default function ChuThich() {
  const t = useTranslations();
  const locale = useLocale() as "vi" | "en";
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>{t("legalDocuments.title")}</CardTitle>
        <CardDescription>{t("legalDocuments.description")}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {LEGAL_DOCUMENTS.map((doc) => (
            <div
              key={doc.id}
              className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm">
                  {doc.shortName[locale]}
                </h4>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                  title={t("legalDocuments.openOfficialDocument")}
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                {doc.name[locale]}
              </p>
              <p className="text-xs">{doc.description[locale]}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
          <p>{t("legalDocuments.note")}</p>
        </div>
      </CardContent>
    </Card>
  );
}
