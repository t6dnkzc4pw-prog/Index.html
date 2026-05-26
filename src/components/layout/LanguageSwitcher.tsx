"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { locales, type Locale } from "@/i18n/config";

export function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname();
  const t = useTranslations("switcher");

  const stripLocale = (path: string) => {
    const segments = path.split("/").filter(Boolean);
    if (segments[0] && (locales as readonly string[]).includes(segments[0])) {
      return "/" + segments.slice(1).join("/");
    }
    return path;
  };

  const rest = stripLocale(pathname);

  return (
    <nav
      aria-label={t("ariaLabel")}
      className="fixed top-6 right-6 z-50 flex items-center gap-3 text-[11px] tracking-[0.2em] font-sans"
    >
      {locales.map((loc, i) => (
        <span key={loc} className="flex items-center gap-3">
          <Link
            href={`/${loc}${rest === "/" ? "" : rest}`}
            scroll={false}
            className={`uppercase transition-opacity duration-500 ease-quiet ${
              loc === currentLocale
                ? "text-text-primary"
                : "text-text-secondary hover:opacity-70"
            }`}
            aria-current={loc === currentLocale ? "true" : undefined}
          >
            {loc}
          </Link>
          {i === 0 && <span className="text-text-secondary/40">/</span>}
        </span>
      ))}
    </nav>
  );
}
