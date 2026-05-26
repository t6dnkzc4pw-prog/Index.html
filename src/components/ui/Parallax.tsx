"use client";

import { ReactNode, useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsMobile, useReducedMotion } from "@/lib/useReducedMotion";

interface ParallaxProps {
  children: ReactNode;
  /** how much the element travels relative to scroll, e.g. 0.3 = 30% */
  factor?: number;
  className?: string;
  /** scale on mobile (0.1 default per spec) */
  mobileFactor?: number;
}

export function Parallax({
  children,
  factor = 0.3,
  mobileFactor = 0.1,
  className = ""
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const mobile = useIsMobile();
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    const applied = mobile ? mobileFactor : factor;
    const distance = window.innerHeight * applied;

    const tween = gsap.fromTo(
      el,
      { yPercent: 0 },
      {
        yPercent: -applied * 100,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [factor, mobile, mobileFactor, reduced]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
