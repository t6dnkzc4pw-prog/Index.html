"use client";

import { ReactLenis } from "@studio-freight/react-lenis";
import { ReactNode } from "react";
import { useIsMobile, useReducedMotion } from "@/lib/useReducedMotion";

export function LenisProvider({ children }: { children: ReactNode }) {
  const mobile = useIsMobile();
  const reduced = useReducedMotion();

  if (mobile || reduced) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.4,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.2
      }}
    >
      {children}
    </ReactLenis>
  );
}
