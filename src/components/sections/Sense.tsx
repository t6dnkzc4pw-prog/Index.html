import { useTranslations } from "next-intl";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { FadeIn } from "@/components/ui/FadeIn";

export function Sense() {
  const t = useTranslations("sense");

  return (
    <section className="relative w-full bg-bg-black px-6 py-32 md:py-48 lg:py-64">
      <div className="mx-auto max-w-6xl">
        <FadeIn className="text-center">
          <EyebrowLabel>{t("eyebrow")}</EyebrowLabel>
        </FadeIn>

        <FadeIn delay={0.15} className="text-center">
          <h2 className="mt-10 font-serif text-5xl md:text-6xl lg:text-7xl font-light leading-[1.1] text-text-primary">
            {t("titleStart")}{" "}
            <em className="italic">{t("titleEnd")}</em>
          </h2>
        </FadeIn>

        <div className="mt-24 grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-24">
          <FadeIn delay={0.2} className="flex flex-col">
            <span className="font-sans text-[11px] tracking-[0.3em] uppercase text-accent-amber-soft">
              {t("originLabel")}
            </span>
            <p
              className="mt-6 font-sans text-base font-light leading-relaxed text-text-secondary [&_em]:italic [&_em]:text-text-primary"
              dangerouslySetInnerHTML={{ __html: t.raw("origin1") as string }}
            />
            <p className="mt-6 font-sans text-base font-light leading-relaxed text-text-secondary">
              {t("origin2")}
            </p>
          </FadeIn>

          <FadeIn delay={0.35} className="flex flex-col">
            <span className="font-sans text-[11px] tracking-[0.3em] uppercase text-accent-amber-soft">
              {t("answerLabel")}
            </span>
            <p className="mt-6 font-sans text-base font-light leading-relaxed text-text-secondary">
              {t("answer")}
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={0.5} className="mx-auto mt-32 max-w-3xl border-y border-accent-amber/30 px-6 py-16 text-center">
          <p className="font-serif italic text-2xl md:text-3xl font-light text-text-primary">
            {t("pull")}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
