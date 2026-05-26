"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { FadeIn } from "@/components/ui/FadeIn";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsMobile, useReducedMotion } from "@/lib/useReducedMotion";

const IMAGES = [
  "/images/scenes/yacht.jpg",
  "/images/scenes/villa.jpg",
  "/images/scenes/suite.jpg",
  "/images/scenes/jet.jpg"
];

const FACTORS = [0.8, 1.0, 1.2, 0.9];

const LAYOUT = [
  { col: "md:col-start-1 md:col-end-7", offset: "md:mt-0" },
  { col: "md:col-start-7 md:col-end-13", offset: "md:mt-40" },
  { col: "md:col-start-2 md:col-end-8", offset: "md:mt-24" },
  { col: "md:col-start-8 md:col-end-13", offset: "md:mt-56" }
];

interface SceneItem {
  numeral: string;
  title: string;
  body: string;
  alt: string;
}

export function Scenes() {
  const t = useTranslations("scenes");
  const items = t.raw("items") as SceneItem[];

  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageRefs = useRef<Array<HTMLDivElement | null>>([]);
  const mobile = useIsMobile();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || mobile) return;

    const ctx = gsap.context(() => {
      imageRefs.current.forEach((wrap, i) => {
        if (!wrap) return;
        const inner = wrap.querySelector<HTMLElement>("[data-parallax-inner]");
        if (!inner) return;
        const factor = FACTORS[i] ?? 1;
        const travel = 80 * factor;

        gsap.fromTo(
          inner,
          { yPercent: travel * 0.5, scale: 1.08 },
          {
            yPercent: -travel * 0.5,
            ease: "none",
            scrollTrigger: {
              trigger: wrap,
              start: "top bottom",
              end: "bottom top",
              scrub: true
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [mobile, reduced]);

  return (
    <section className="relative w-full bg-bg-black px-6 py-32 md:py-48 lg:py-64">
      <div ref={containerRef} className="mx-auto max-w-7xl">
        <FadeIn className="text-center">
          <EyebrowLabel>{t("eyebrow")}</EyebrowLabel>
        </FadeIn>

        <FadeIn delay={0.15} className="text-center">
          <h2 className="mx-auto mt-10 max-w-4xl font-serif text-5xl md:text-6xl lg:text-7xl font-light leading-[1.1] text-text-primary">
            {t("titleStart")} <em className="italic">{t("titleEnd")}</em>
          </h2>
        </FadeIn>

        <div className="mt-32 grid grid-cols-1 gap-24 md:grid-cols-12 md:gap-y-40">
          {items.map((item, i) => {
            const layout = LAYOUT[i] ?? LAYOUT[0]!;
            return (
              <div key={item.numeral} className={`flex flex-col ${layout.col} ${layout.offset}`}>
                <FadeIn>
                  <div
                    ref={(el) => {
                      imageRefs.current[i] = el;
                    }}
                    className="relative aspect-[4/5] w-full overflow-hidden bg-bg-warm"
                  >
                    <div data-parallax-inner className="absolute inset-0 h-[120%]">
                      <Image
                        src={IMAGES[i] ?? IMAGES[0]!}
                        alt={item.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-bg-black/40 to-transparent"
                      />
                    </div>
                  </div>
                </FadeIn>

                <FadeIn delay={0.15} className="mt-8 max-w-md">
                  <span className="block font-serif italic text-2xl text-accent-amber-soft">
                    {item.numeral}
                  </span>
                  <h3 className="mt-3 font-serif text-2xl md:text-3xl font-light text-text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-5 font-sans text-sm md:text-base font-light leading-relaxed text-text-secondary">
                    {item.body}
                  </p>
                </FadeIn>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
