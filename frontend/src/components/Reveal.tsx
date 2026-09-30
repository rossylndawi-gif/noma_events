"use client";

import { useEffect, useRef, useState, type ElementType } from "react";
import { cn } from "@/lib/cn";

/**
 * Fades its content up 12px the first time it scrolls into view (15% visible).
 * Runs once only — never re-hides on scroll-back. `delay` staggers siblings (60ms steps).
 */
export function Reveal({
  as: Tag = "div",
  delay = 0,
  className,
  children,
  ...props
}: {
  as?: ElementType;
  delay?: number;
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-visible={visible}
      className={cn("reveal", className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...props}
    >
      {children}
    </Tag>
  );
}
