"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function ShareButton({ title }: { title: string }) {
  const t = useTranslations("eventDetail");
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // fall through to clipboard
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleShare}
      aria-label={t("share")}
      className="focus-ring icon-btn relative flex h-11 w-11 items-center justify-center rounded-full border border-line-icon bg-icon-btn text-ink/80"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="M8.6 13.5l6.8 3.9M15.4 6.6L8.6 10.5" />
      </svg>
      {copied && (
        <span role="status" className="absolute top-full right-0 mt-2 whitespace-nowrap rounded-full bg-band px-2.5 py-1 text-xs text-ink">
          {t("copied")}
        </span>
      )}
    </button>
  );
}
