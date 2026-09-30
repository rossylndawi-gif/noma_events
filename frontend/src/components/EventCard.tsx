import Image from "next/image";
import { useTranslations } from "next-intl";
import { MapPin, Ticket } from "lucide-react";
import type { EventDTO } from "@/types";
import { formatDateShort, formatXaf } from "@/lib/format";
import { Skeleton } from "@/components/ui/Skeleton";
import { Link } from "@/i18n/navigation";

/**
 * Event card. The frame, date tab and info area take the poster's dominant colour,
 * approximated by a heavily blurred copy of the poster behind a dark scrim.
 */
export function EventCard({ event }: { event: EventDTO }) {
  const t = useTranslations("eventCard");
  const [day, month] = formatDateShort(event.startAt).split(" ");
  return (
    <Link
      href={`/events/${event.slug}`}
      className="focus-ring rel-card group relative isolate flex flex-col overflow-hidden rounded-card border border-line-card bg-surface"
    >
      {event.coverImage && (
        <>
          <Image
            src={event.coverImage}
            alt=""
            aria-hidden
            fill
            sizes="64px"
            className="-z-10 scale-150 object-cover opacity-70 blur-2xl saturate-150"
          />
          <div className="absolute inset-0 -z-10 bg-black/55" />
        </>
      )}

      <div className="p-2">
        <div className="card-media relative aspect-square w-full rounded-[18px] bg-sand">
          {event.coverImage ? (
            <Image
              src={event.coverImage}
              alt={event.title}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-1.5 text-ink/25">
              <Ticket className="h-8 w-8" strokeWidth={1.5} />
              <span className="text-xs font-medium">BomaEvents</span>
            </div>
          )}
          <div className="absolute left-0 top-0 rounded-br-[16px] bg-black/60 px-3 py-2 text-center leading-none backdrop-blur-md">
            <div className="font-display text-lg font-extrabold text-ink">{day}</div>
            <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink/70">{month}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 px-3 pb-4 pt-1">
        <p className="flex items-center gap-1 text-xs text-ink/70">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="line-clamp-1">
            {event.venue?.name ? `${event.venue.name}, ` : ""}
            {event.city}
          </span>
        </p>
        <h3 className="line-clamp-2 font-display text-base font-extrabold leading-tight text-ink">{event.title}</h3>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
          {event.organizer && (
            <span className="flex min-w-0 max-w-full items-center gap-1.5 rounded-full bg-black/35 py-1 pl-1 pr-2.5 text-xs text-ink/85">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-500 text-[10px] font-bold text-accent-ink">
                {event.organizer.name.charAt(0).toUpperCase()}
              </span>
              <span className="truncate">{event.organizer.name}</span>
            </span>
          )}
          <span className="text-sm font-semibold text-ink">
            {event.isFree ? t("free") : event.minPriceXaf !== null ? t("fromPrice", { price: formatXaf(event.minPriceXaf) }) : "—"}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function EventCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-card border border-line-card bg-surface p-2">
      <Skeleton className="aspect-square w-full rounded-[18px]" />
      <div className="flex flex-col gap-2 px-1 pb-2 pt-3">
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
}
