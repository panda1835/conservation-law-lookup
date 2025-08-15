import { useTranslations, useLocale } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";
export const Header = () => {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className="">
      <div className="ml-4 flex justify-end">
        <LanguageSwitcher currentLocale={locale} />
      </div>
      <div className="flex justify-center items-center mb-6 w-full">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            {t("header.title")}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t("header.subtitle")}
          </p>
        </div>
      </div>
    </div>
  );
};
