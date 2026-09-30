"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth-context";
import { apiPost } from "@/lib/api";
import { cn } from "@/lib/cn";

export function FavoriteButton({
  eventId,
  initialFavorited = false,
  className,
}: {
  eventId: string;
  initialFavorited?: boolean;
  className?: string;
}) {
  const t = useTranslations("eventDetail");
  const { user } = useAuth();
  const router = useRouter();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    setLoading(true);
    try {
      const { data } = await apiPost<{ favorited: boolean }>(`/events/${eventId}/favorite`);
      setFavorited(data.favorited);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-pressed={favorited}
      aria-label={favorited ? t("removeFavorite") : t("addFavorite")}
      className={cn(
        "focus-ring icon-btn flex h-10 w-10 items-center justify-center rounded-full border",
        favorited ? "border-accent-500/40 bg-accent-500/10 text-accent-400" : "border-line-icon bg-icon-btn text-ink/80",
        className,
      )}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill={favorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
        <path d="M12 21s-6.7-4.35-9.33-8.1C.6 9.77 1.5 6 5 5c2-.55 3.7.4 4.8 1.7C10.9 5.4 12.6 4.45 14.6 5c3.5 1 4.4 4.77 2.33 7.9C18.7 16.65 12 21 12 21z" />
      </svg>
    </button>
  );
}
