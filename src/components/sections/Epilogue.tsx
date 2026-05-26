import { useTranslations } from "next-intl";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { FadeIn } from "@/components/ui/FadeIn";
import { Logo } from "@/components/layout/Logo";

export function Epilogue() {
  const t = useTranslations("epilogue");

  return (
    <section className="relative w-full bg-bg-black px-6 py-32 md:py-48 lg:py-64">
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <FadeIn>
          <EyebrowLabel>{t("eyebrow")}</EyebrowLabel>
        </FadeIn>

        <FadeIn delay={0.15}>
          <h2 className="mt-10 font-serif text-5xl md:text-6xl lg:text-7xl font-light leading-[1.1] text-text-primary">
            {t("titleStart")}{" "}
            <em className="italic">{t("titleMid")}</em> {t("titleEnd")}
          </h2>
        </FadeIn>

        <FadeIn delay={0.3} className="mt-12 max-w-3xl">
          <p className="font-serif text-xl md:text-2xl font-light leading-snug text-text-secondary">
            {t("subtitleStart")}{" "}
            <em className="italic text-text-primary">{t("subtitleEnd")}</em>
          </p>
        </FadeIn>

        <FadeIn delay={0.5} className="mt-24 w-full max-w-3xl border border-accent-amber/40 bg-bg-warm px-8 py-16 md:px-16 md:py-20">
          <blockquote className="font-serif italic text-2xl md:text-3xl font-light leading-relaxed text-text-primary">
            &ldquo;{t("quote")}&rdquo;
          </blockquote>
        </FadeIn>

        <FadeIn delay={0.7} className="mt-32 flex flex-col items-center gap-4">
          <Logo variant="lockup" size={56} />
          <p className="mt-2 font-serif italic text-sm md:text-base font-light text-text-secondary tracking-wide">
            {t("tagline")}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
