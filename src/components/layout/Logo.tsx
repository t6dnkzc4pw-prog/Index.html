import { HTMLAttributes } from "react";

type Variant = "mark" | "wordmark" | "lockup";

interface LogoProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  size?: number;
}

// TODO: replace with custom font + finalized mark from designer.
export function Logo({ variant = "lockup", size = 64, className = "", ...rest }: LogoProps) {
  return (
    <div className={`inline-flex flex-col items-center gap-3 ${className}`} {...rest}>
      {(variant === "mark" || variant === "lockup") && <LogoMark size={size} />}
      {(variant === "wordmark" || variant === "lockup") && <Wordmark />}
    </div>
  );
}

function LogoMark({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className="text-accent-amber"
    >
      <circle cx="32" cy="32" r="29" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
      <circle cx="32" cy="32" r="23" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      <circle cx="32" cy="32" r="17" stroke="currentColor" strokeWidth="0.5" opacity="0.7" />
      <circle cx="32" cy="32" r="11" stroke="currentColor" strokeWidth="0.5" opacity="0.85" />
      <path
        d="M32 22 L32 38 M29 30 L35 30"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
      <circle cx="32" cy="28" r="2.4" stroke="currentColor" strokeWidth="0.9" fill="none" />
    </svg>
  );
}

function Wordmark() {
  return (
    <span className="font-serif text-2xl tracking-[0.35em] text-text-primary font-light">
      MADIA
    </span>
  );
}
