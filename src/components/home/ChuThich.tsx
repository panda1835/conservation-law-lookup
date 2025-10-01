"use client";

import { useTranslations, useLocale } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { LEGAL_DOCUMENTS } from "@/data/legalDocuments";

interface ChuThichProps {
  selectedDocuments?: string[];
}

export default function ChuThich({ selectedDocuments = [] }: ChuThichProps) {
  const t = useTranslations();
  const locale = useLocale() as "vi" | "en";

  const showIUCNLegend =
    selectedDocuments.includes("iucn") ||
    selectedDocuments.includes("vnredlist");

  const iucnCategories = [
    { code: "EX", color: "bg-black text-white" },
    { code: "EW", color: "bg-black text-white" },
    { code: "CR", color: "bg-red-700 text-white" },
    { code: "EN", color: "bg-orange-600 text-white" },
    { code: "VU", color: "bg-yellow-600 text-white" },
    { code: "NT", color: "bg-yellow-400 text-black" },
    { code: "LC", color: "bg-green-600 text-white" },
    { code: "DD", color: "bg-gray-500 text-white" },
    { code: "NE", color: "bg-gray-300 text-black" },
    { code: "NA", color: "bg-gray-300 text-black" },
  ];

  return (
    <>
      {showIUCNLegend && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>{t("iucnLegend.title")}</CardTitle>
            <CardDescription>{t("iucnLegend.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {iucnCategories.map((category) => (
                <div
                  key={category.code}
                  className="flex items-center gap-2 p-2 border rounded hover:bg-muted/50 transition-colors"
                >
                  <Badge
                    className={`${category.color} text-xs px-2 py-1 min-w-[40px] justify-center`}
                  >
                    {category.code}
                  </Badge>
                  <span className="text-sm">
                    {t(`iucnCategories.${category.code}`)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600  hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-200 hover:underline"
                      title={t("legalDocuments.openOfficialDocument")}
                    >
                      {doc.shortName[locale]}
                    </a>
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
                <p className="text-xs mb-2">{doc.name[locale]}</p>
                {/* <p className="text-xs">{doc.description[locale]}</p> */}
              </div>
            ))}
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            <p>{t("legalDocuments.note")}</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
