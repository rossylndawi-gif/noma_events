"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Clock } from "lucide-react";
import { cn } from "@/lib/cn";

/** Live [days, hours, minutes, seconds] until `startAt`; null until mounted so server and client markup match. */
function useCountdown(startAt: string) {
  const target = new Date(startAt).getTime();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  if (now === null) return { parts: null, started: false };
  const s = Math.max(0, Math.floor((target - now) / 1000));
  return {
    parts: [Math.floor(s / 86400), Math.floor((s % 86400) / 3600), Math.floor((s % 3600) / 60), s % 60],
    started: now >= target,
  };
}

const pad = (n: number | undefined) => (n === undefined ? "--" : String(n).padStart(2, "0"));

/** Event page: centered "● STARTS IN" card with a live DD : HH : MM : SS readout. Hidden once the event starts. */
export function Countdown({ startAt }: { startAt: string }) {
  const t = useTranslations("eventDetail");
  const { parts, started } = useCountdown(startAt);
  if (started) return null;

  const labels = [t("countdownDays"), t("countdownHours"), t("countdownMinutes"), t("countdownSeconds")];

  return (
    <div className="rounded-card border border-white/10 bg-white/[0.04] px-5 pb-4 pt-3.5 text-center backdrop-blur-xl">
      <p className="flex items-center justify-center gap-2 text-sm font-medium uppercase tracking-[0.14em] text-ink/70">
        <span className="countdown-dot" aria-hidden />
        {t("startsIn")}
      </p>
      <div className="mt-1.5 flex items-start justify-center gap-2 tabular-nums" role="timer" aria-live="off">
        {labels.map((label, i) => (
          <div key={label} className="flex items-start gap-2">
            {i > 0 && <span className="text-[28px] font-bold leading-9 text-ink/60">:</span>}
            <div className="flex min-w-[2.6ch] flex-col items-center">
              <span className="text-[28px] font-bold leading-9 tracking-tight text-ink">{pad(parts?.[i])}</span>
              <span className="text-xs font-medium text-ink/70">{label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Poster overlay: frosted clock + Days : Hrs : Min chip. Hidden once the event starts. */
export function CompactCountdown({ startAt, className }: { startAt: string; className?: string }) {
  const t = useTranslations("eventDetail");
  const { parts, started } = useCountdown(startAt);
  if (started) return null;

  const labels = [t("countdownDays"), t("countdownHours"), t("countdownMinutes")];

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-[18px] border border-white/10 bg-black/45 px-3.5 py-2 backdrop-blur-xl",
        className,
      )}
    >
      <Clock className="h-6 w-6 shrink-0 text-ink/90" strokeWidth={1.75} aria-hidden />
      <div className="flex items-start gap-1.5 tabular-nums" role="timer" aria-live="off">
        {labels.map((label, i) => (
          <div key={label} className="flex items-start gap-1.5">
            {i > 0 && <span className="text-lg font-bold leading-6 text-ink/50">:</span>}
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold leading-6 text-ink">{pad(parts?.[i])}</span>
              <span className="text-[11px] font-medium text-ink/75">{label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
