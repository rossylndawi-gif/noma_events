"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Ticket } from "lucide-react";
import { cn } from "@/lib/cn";

/** 1:1 poster carousel with 40px circular arrows (arrows only when there is more than one image). */
export function PosterCarousel({ images, title }: { images: string[]; title: string }) {
  const t = useTranslations("eventDetail");
  const [index, setIndex] = useState(0);
  const count = images.length;

  if (count === 0) {
    return (
      <div className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-card border border-line-card bg-surface text-ink/25">
        <Ticket className="h-10 w-10" strokeWidth={1.5} />
        <span className="text-sm font-medium">BomaEvents</span>
      </div>
    );
  }

  const go = (delta: number) => setIndex((i) => (i + delta + count) % count);
  const arrowClass =
    "focus-ring btn-secondary absolute top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line-icon bg-sand/90 text-ink backdrop-blur";

  return (
    <div className="relative" aria-roledescription="carousel">
      <div className="relative aspect-square w-full overflow-hidden rounded-card bg-surface">
        {images.map((src, i) => (
          <Image
            key={src + i}
            src={src}
            alt={count > 1 ? `${title} — ${t("imageOf", { current: i + 1, total: count })}` : title}
            fill
            priority={i === 0}
            sizes="(max-width: 1024px) 100vw, 560px"
            className={cn("object-cover transition-opacity duration-300", i === index ? "opacity-100" : "opacity-0")}
            aria-hidden={i !== index}
          />
        ))}
      </div>
      {count > 1 && (
        <>
          <button type="button" onClick={() => go(-1)} aria-label={t("previousImage")} className={cn(arrowClass, "left-3")}>
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button type="button" onClick={() => go(1)} aria-label={t("nextImage")} className={cn(arrowClass, "right-3")}>
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <span key={i} className={cn("h-1.5 rounded-full transition-all", i === index ? "w-4 bg-ink" : "w-1.5 bg-ink/40")} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
