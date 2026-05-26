import { ReactNode } from "react";

export function EyebrowLabel({ children }: { children: ReactNode }) {
  return (
    <span className="block font-sans text-xs tracking-[0.3em] uppercase text-accent-amber">
      {children}
    </span>
  );
}
