import Image from "next/image";
import { useTranslations } from "next-intl";
import { MapPin, Ticket } from "lucide-react";
import type { EventDTO } from "@/types";
import { formatXaf } from "@/lib/format";
import { Link } from "@/i18n/navigation";
import { FavoriteButton } from "@/components/FavoriteButton";
import { CompactCountdown } from "@/components/event/Countdown";

/** Full-bleed poster card: countdown + favourite over the image, event info on a bottom scrim. */
export function FeaturedCard({ event, priority = false }: { event: EventDTO; priority?: boolean }) {
  const t = useTranslations("eventCard");
  const price = event.isFree ? t("free") : event.minPriceXaf !== null ? formatXaf(event.minPriceXaf) : null;

  return (
    <article className="group relative isolate aspect-[4/5] overflow-hidden rounded-[28px] border border-line-card bg-surface">
      <Link href={`/events/${event.slug}`} className="focus-ring absolute inset-0 z-0 rounded-[28px]">
        <span className="card-media absolute inset-0">
          {event.coverImage ? (
            <Image
              src={event.coverImage}
              alt=""
              fill
              priority={priority}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          ) : (
            <Ticket className="absolute inset-0 m-auto h-12 w-12 text-ink/20" aria-hidden />
          )}
        </span>
        <span className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black via-black/75 to-transparent" aria-hidden />

        <span className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5">
          <span className="flex items-center gap-1.5 text-[15px] text-ink/90">
            <MapPin className="h-4 w-4 shrink-0" aria-hidden />
            <span className="line-clamp-1">{event.venue?.name ?? event.city}</span>
          </span>
          <span className="line-clamp-2 font-display text-[24px] font-extrabold leading-[28px] text-ink">{event.title}</span>
          <span className="mt-1 flex items-center justify-between gap-3">
            <span className="flex min-w-0 items-center gap-2 text-sm text-ink/75">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 bg-black/50 text-xs font-bold text-ink">
                {event.organizer.name.charAt(0).toUpperCase()}
              </span>
              <span className="truncate">@{event.organizer.slug}</span>
            </span>
            {price && <span className="shrink-0 text-sm font-semibold text-ink">{price}</span>}
          </span>
        </span>
      </Link>

      {/* Overlays sit above the link so they stay separate controls */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-2 p-3.5">
        <CompactCountdown startAt={event.startAt} />
        <FavoriteButton
          eventId={event.id}
          className="pointer-events-auto ml-auto h-11 w-11 border-white/10 bg-black/45 text-ink backdrop-blur-xl"
        />
      </div>
    </article>
  );
}
