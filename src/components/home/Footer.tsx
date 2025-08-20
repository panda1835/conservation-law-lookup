import { useLocale } from "next-intl";
export function Footer() {
  const locale = useLocale();
  return (
    <footer className="mt-12 py-8 border-t bg-muted/50">
      <div className="max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
        <p className="mb-2">
          Built by <span className="font-medium text-foreground">Phuc</span>{" "}
          with ❤️
        </p>
        <p className="mb-2">© {new Date().getFullYear()} All rights reserved</p>
        <div className="flex justify-center gap-4 text-xs">
          <a
            href="mailto:info@borua.dev"
            className="hover:text-foreground transition-colors"
          >
            info@borua.dev
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
      </div>
    </footer>
  );
}
