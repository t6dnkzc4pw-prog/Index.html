import { useTranslations } from "next-intl";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { FadeIn } from "@/components/ui/FadeIn";

export function Roots() {
  const t = useTranslations("roots");

  return (
    <section className="relative w-full bg-bg-deep px-6 py-32 md:py-48 lg:py-64">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <FadeIn>
          <EyebrowLabel>{t("eyebrow")}</EyebrowLabel>
        </FadeIn>

        <FadeIn delay={0.15}>
          <h2 className="mt-10 font-serif text-5xl md:text-6xl lg:text-7xl font-light leading-[1.1] text-text-primary">
            {t("titleStart")} <em className="italic">{t("titleEnd")}</em>
          </h2>
        </FadeIn>

        <FadeIn delay={0.3} className="mt-16 max-w-2xl">
          <p className="font-sans text-base md:text-lg font-light leading-relaxed text-text-secondary">
            {t("p1")}
          </p>
        </FadeIn>

        <FadeIn delay={0.45} className="mt-24 flex w-full items-center justify-center gap-6">
          <span className="h-px flex-1 max-w-[80px] bg-accent-amber/40" />
          <p className="font-serif italic text-2xl md:text-3xl lg:text-4xl font-light text-accent-amber whitespace-nowrap">
            {t("pull")}
          </p>
          <span className="h-px flex-1 max-w-[80px] bg-accent-amber/40" />
        </FadeIn>

        <FadeIn delay={0.6} className="mt-24 max-w-2xl">
          <p className="font-sans text-base md:text-lg font-light leading-relaxed text-text-secondary">
            {t("p2")}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
