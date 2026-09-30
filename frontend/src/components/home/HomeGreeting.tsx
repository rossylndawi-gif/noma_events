"use client";

import { useTranslations } from "next-intl";
import { MapPin, Plus, Ticket } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Link } from "@/i18n/navigation";

/** Greeting pill (avatar, "Hi {name}", country) + quick actions pill (create event, my tickets). */
export function HomeGreeting() {
  const t = useTranslations("home");
  const { user } = useAuth();
  const firstName = user?.name.split(" ")[0];

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3 rounded-full border border-line-icon bg-surface py-1.5 pl-1.5 pr-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sand text-base font-semibold text-ink/80">
          {firstName ? firstName.charAt(0).toUpperCase() : "B"}
        </span>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-[15px] font-semibold text-ink">
            {firstName ? t("greeting", { name: firstName }) : t("greetingGuest")}
          </p>
          <p className="flex items-center gap-1 text-[13px] text-ink/70">
            <MapPin className="h-3 w-3" aria-hidden />
            {t("country")}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center rounded-full border border-line-icon bg-surface p-1">
        <Link
          href="/organizer/events/new"
          aria-label={t("createEvent")}
          className="focus-ring flex h-11 w-11 items-center justify-center rounded-full text-accent-400 transition-colors hover:bg-white/5"
        >
          <Plus className="h-6 w-6" strokeWidth={2} />
        </Link>
        <Link
          href="/account/tickets"
          aria-label={t("myTickets")}
          className="focus-ring flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-white/5"
        >
          <Ticket className="h-5 w-5" strokeWidth={1.75} />
        </Link>
      </div>
    </div>
  );
}
