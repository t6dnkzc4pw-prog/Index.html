import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { ReactNode } from "react";
import { locales, type Locale } from "@/i18n/config";
import { LenisProvider } from "@/components/layout/LenisProvider";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Preloader } from "@/components/sections/Preloader";
import "../globals.css";

const displaySerif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap"
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-sans",
  display: "swap"
});

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "meta" });

  const otherLocale = params.locale === "en" ? "it" : "en";

  return {
    title: t("title"),
    description: t("description"),
    metadataBase: new URL("https://madiabox.com"),
    alternates: {
      canonical: `/${params.locale}`,
      languages: {
        en: "/en",
        it: "/it",
        [otherLocale]: `/${otherLocale}`
      }
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      locale: params.locale,
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "MADIA" }]
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/og-image.jpg"]
    },
    icons: {
      icon: "/logo-mark.svg"
    }
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  if (!(locales as readonly string[]).includes(locale)) notFound();
  unstable_setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${displaySerif.variable} ${sans.variable}`}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Preloader />
          <LanguageSwitcher currentLocale={locale as Locale} />
          <LenisProvider>
            <main>{children}</main>
          </LenisProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
