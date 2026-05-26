import { useTranslations } from "next-intl";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { FadeIn } from "@/components/ui/FadeIn";

export function Emotion() {
  const t = useTranslations("emotion");

  return (
    <section className="relative w-full bg-bg-black px-6 py-32 md:py-48 lg:py-64">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <FadeIn>
          <EyebrowLabel>{t("eyebrow")}</EyebrowLabel>
        </FadeIn>

        <FadeIn delay={0.15}>
          <h2 className="mt-10 font-serif text-5xl md:text-6xl lg:text-7xl font-light leading-[1.1] text-text-primary">
            {t("titleStart")}{" "}
            <em className="italic text-text-primary">{t("titleEnd")}</em>
          </h2>
        </FadeIn>

        <FadeIn delay={0.3} className="mt-16 max-w-2xl">
          <p className="font-sans text-base md:text-lg font-light leading-relaxed text-text-secondary">
            {t("p1")}
          </p>
        </FadeIn>

        <FadeIn delay={0.45} className="mt-8 max-w-2xl">
          <p
            className="font-sans text-base md:text-lg font-light leading-relaxed text-text-secondary [&_em]:italic [&_em]:text-text-primary"
            dangerouslySetInnerHTML={{ __html: t.raw("p2") as string }}
          />
        </FadeIn>

        <FadeIn delay={0.65} className="mt-24">
          <blockquote className="font-serif italic text-2xl md:text-3xl lg:text-4xl font-light text-accent-amber-soft leading-snug">
            <p>{t("quoteLine1")}</p>
            <p className="mt-1">{t("quoteLine2")}</p>
          </blockquote>
        </FadeIn>
      </div>
    </section>
  );
}
