import { cn } from "@/lib/cn";

/** 32px gradient circle with the pointer glyph (placeholder until the final logo lands). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span className={cn("bg-grad-accent flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-accent-ink", className)}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M4.5 2.8a1 1 0 0 1 1.4-.9l14.6 7a1 1 0 0 1-.1 1.85l-6.1 2.2-2.2 6.1a1 1 0 0 1-1.85.1l-7-14.6a1 1 0 0 1 1.25-1.75z" />
      </svg>
    </span>
  );
}

/** Logo mark + "BomaEvents" wordmark (20px, 700, -0.02em). */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2 text-xl font-bold tracking-[-0.02em] text-ink", className)}>
      <LogoMark />
      BomaEvents
    </span>
  );
}
