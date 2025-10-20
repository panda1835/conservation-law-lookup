"use client";

import { useTranslations, useLocale } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";
import { Button } from "../ui/button";

export const Header = () => {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className="">
      <div className="ml-4 flex justify-end mb-4">
        <div className="flex items-center gap-4 text-sm ">
          <Button
            onClick={() =>
              window.open(
                "https://forms.gle/cUMpRzggPJvDqoSi9",
                "_blank",
                "noopener,noreferrer"
              )
            }
            size="sm"
            className="hover:underline"
          >
            {t("header.contributeImages")}
          </Button>
          <LanguageSwitcher currentLocale={locale} />
        </div>
      </div>
      <div className="flex justify-center items-center mb-6 w-full">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            {t("header.title")}
          </h1>
          <p className="text-xl text-muted-foreground mt-4">
            {t("header.subtitle")}
          </p>
        </div>
      </div>
    </div>
  );
};
