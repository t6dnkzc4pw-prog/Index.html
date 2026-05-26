"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsMobile, useReducedMotion } from "@/lib/useReducedMotion";

export function Hero() {
  const t = useTranslations("hero");
  const imageRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const mobile = useIsMobile();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const img = imageRef.current;
    const txt = textRef.current;
    if (!img || !txt) return;

    const imgTravel = mobile ? -10 : -30;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        img,
        { yPercent: 0, scale: 1.05 },
        {
          yPercent: imgTravel,
          ease: "none",
          scrollTrigger: {
            trigger: img.parentElement!,
            start: "top top",
            end: "bottom top",
            scrub: true
          }
        }
      );

      gsap.fromTo(
        txt,
        { yPercent: 0, opacity: 1 },
        {
          yPercent: -8,
          opacity: 0.85,
          ease: "none",
          scrollTrigger: {
            trigger: img.parentElement!,
            start: "top top",
            end: "bottom top",
            scrub: true
          }
        }
      );
    });

    return () => ctx.revert();
  }, [mobile, reduced]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-bg-black">
      <div ref={imageRef} className="absolute inset-0 h-[120%]">
        <Image
          src="/images/hero.jpg"
          alt="A wooden MADIA box being presented at breakfast on a yacht deck, with warm pastries inside"
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-bg-black/40 via-bg-black/30 to-bg-black/80"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.55) 100%)"
          }}
        />
      </div>

      <div
        ref={textRef}
        className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6 text-center"
      >
        <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl font-light tracking-[0.18em] text-text-primary">
          {t("wordmark")}
        </h1>
        <p className="mt-8 max-w-xl font-serif italic text-lg md:text-2xl text-text-primary/85 font-light tracking-wide">
          {t("tagline")}
        </p>
      </div>

      <div className="pointer-events-none absolute bottom-10 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-3">
        <span className="font-sans text-[10px] tracking-[0.5em] text-text-primary/60">
          {t("scroll")}
        </span>
        <span className="block h-12 w-px bg-text-primary/40 origin-top animate-[scrollPulse_2.6s_cubic-bezier(0.22,1,0.36,1)_infinite]" />
      </div>
    </section>
  );
}
