import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

// Labels on accent fills use accent-ink, never white (contrast rule).
const variantClasses: Record<Variant, string> = {
  primary: "btn-accent bg-accent-500 font-semibold text-accent-ink disabled:opacity-40",
  secondary: "btn-secondary border border-line-icon bg-sand text-ink disabled:opacity-40",
  outline: "btn-secondary border border-line-icon text-ink bg-transparent disabled:opacity-40",
  ghost: "bg-transparent text-ink hover:bg-white/5 disabled:opacity-40",
  danger: "bg-danger text-white hover:bg-danger-dark disabled:opacity-40",
};

// Fixed heights, always pill-shaped.
const sizeClasses: Record<Size, string> = {
  sm: "h-9 text-sm px-4 gap-1.5",
  md: "h-10 text-sm px-5 gap-2",
  lg: "h-12 text-base px-6 gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "focus-ring inline-flex items-center justify-center rounded-full font-medium transition-colors disabled:cursor-not-allowed",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

/** Class string for links styled as the primary accent pill button. */
export const accentPillClasses =
  "focus-ring btn-accent inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-accent-500 px-5 text-sm font-semibold text-accent-ink";
