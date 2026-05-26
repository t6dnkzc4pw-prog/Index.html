"use client";

import { ReactNode, useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export function FadeIn({
  children,
  delay = 0,
  y = 24,
  duration = 1.2,
  className = "",
  as: Tag = "div"
}: FadeInProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduced) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(el, { opacity: 0, y });
    const tween = gsap.to(el, {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        once: true
      }
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay, duration, y, reduced]);

  const Tagged = Tag as unknown as React.ElementType;
  return (
    <Tagged ref={ref as never} className={className}>
      {children}
    </Tagged>
  );
}
