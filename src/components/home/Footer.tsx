import { useLocale } from "next-intl";
export function Footer() {
  const locale = useLocale();
  return (
    <footer className="mt-12 py-8 border-t ">
      <div className="max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
        <p className="mb-2">
          Built by <span className="font-medium text-foreground">Phuc</span>{" "}
          with ❤️
        </p>
        <p className="mb-2">© {new Date().getFullYear()} All rights reserved</p>
        <div className="flex justify-center gap-4 text-xs">
          <a
            href="mailto:lehoangphuc1820@gmail.com"
            className="hover:text-foreground transition-colors"
          >
            lehoangphuc1820@gmail.com
          </a>
          <span>•</span>
          <a
            href="tel:+84941090606"
            className="hover:text-foreground transition-colors"
          >
            0941 09 0606
          </a>
          <span>•</span>
          <a
            href={`https://www.borua.dev/${locale}`}
            className="hover:text-foreground transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Website
          </a>
        </div>
        <p className="mt-2">
          <a
            href={`/${locale}/privacy-policy`}
            className="hover:text-foreground transition-colors text-xs"
            target="_blank"
            rel="noopener noreferrer"
          >
            {locale === "vi" ? "Chính sách Bảo mật" : "Privacy Policy"}
          </a>
        </p>
      </div>
    </footer>
  );
}
