import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { EventDTO } from "@/types";
import { apiGet, ApiRequestError } from "@/lib/api";
import { formatDate, formatDateShort, formatTime } from "@/lib/format";
import { CategoryIcon } from "@/lib/categoryIcons";
import { Badge } from "@/components/ui/Badge";
import { EventCard } from "@/components/EventCard";
import { EventPurchasePanel } from "@/components/EventPurchasePanel";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ShareButton } from "@/components/ShareButton";
import { Reveal } from "@/components/Reveal";
import { Countdown } from "@/components/event/Countdown";
import { PosterCarousel } from "@/components/event/PosterCarousel";
import { Link } from "@/i18n/navigation";

async function getEvent(slug: string): Promise<EventDTO | null> {
  try {
    const { data } = await apiGet<EventDTO>(`/events/${slug}`, { auth: false });
    return data;
  } catch (err) {
    if (err instanceof ApiRequestError && err.status === 404) return null;
    throw err;
  }
}

/** Evaluated per request (the page is dynamic). */
function hasNotStarted(iso: string) {
  return new Date(iso).getTime() > Date.now();
}

async function getRelatedEvents(event: EventDTO): Promise<EventDTO[]> {
  if (!event.category) return [];
  try {
    const { data } = await apiGet<EventDTO[]>(`/events?category=${encodeURIComponent(event.category.slug)}&limit=5&sort=date`, {
      auth: false,
    });
    return data.filter((e) => e.id !== event.id).slice(0, 4);
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const event = await getEvent(slug);
  if (!event) {
    const t = await getTranslations({ locale, namespace: "eventDetail" });
    return { title: t("eventNotFound") };
  }
  return {
    title: event.title,
    description: event.summary,
    openGraph: {
      title: event.title,
      description: event.summary,
      images: event.coverImage ? [{ url: event.coverImage }] : undefined,
      type: "website",
    },
    alternates: { canonical: `/${locale}/events/${event.slug}` },
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("eventDetail");
  const event = await getEvent(slug);
  if (!event) notFound();
  const related = await getRelatedEvents(event);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.startAt,
    endDate: event.endAt,
    eventStatus:
      event.status === "CANCELLED" ? "https://schema.org/EventCancelled" : "https://schema.org/EventScheduled",
    location: event.venue
      ? {
          "@type": "Place",
          name: event.venue.name,
          address: { "@type": "PostalAddress", streetAddress: event.venue.address, addressLocality: event.venue.city, addressCountry: "GA" },
        }
      : undefined,
    image: event.coverImage ? [event.coverImage] : undefined,
    description: event.summary,
    offers:
      event.ticketTypes?.map((tt) => ({
        "@type": "Offer",
        price: tt.priceXaf,
        priceCurrency: "XAF",
        availability: tt.remaining > 0 ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
        url: `https://noma.events/events/${event.slug}`,
      })) ?? [],
    organizer: { "@type": "Organization", name: event.organizer.name },
  };

  const images = [event.coverImage, ...(event.gallery ?? [])].filter((src): src is string => Boolean(src));
  const locationLine = [event.venue?.address, event.venue?.city ?? event.city].filter(Boolean).join(", ");
  const mapQuery = event.venue?.coordinates
    ? `${event.venue.coordinates.lat},${event.venue.coordinates.lng}`
    : [event.venue?.name, locationLine].filter(Boolean).join(", ");
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
  const showCountdown = event.status === "PUBLISHED" && hasNotStarted(event.startAt);
  const [day, monthRaw = ""] = formatDateShort(event.startAt).split(" ");
  const month = monthRaw.replace(".", "");

  return (
    <div className="relative isolate overflow-x-clip pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Ambient poster glow behind the top of the page */}
      {event.coverImage && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent)]"
        >
          <Image src={event.coverImage} alt="" fill sizes="64px" className="scale-125 object-cover blur-3xl saturate-150" />
        </div>
      )}

      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 pt-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-10 lg:px-8 lg:pt-10">
        {/* Hero: countdown → poster → chips + actions → title → organizer → date & location */}
        <div className="flex flex-col gap-5 lg:col-start-1">
          {showCountdown && <Countdown startAt={event.startAt} />}

          <PosterCarousel images={images} title={event.title} />

          <div className="flex items-center gap-2">
            <div className="flex min-w-0 flex-wrap gap-2">
              {event.category && (
                <Link
                  href={`/categories/${event.category.slug}`}
                  className="focus-ring chip inline-flex h-10 items-center gap-2 rounded-full border border-line-chip bg-field px-4 text-[15px] text-ink"
                >
                  <CategoryIcon slug={event.category.slug} className="h-4 w-4 text-accent-400" aria-hidden />
                  {event.category.name}
                </Link>
              )}
              {event.status === "CANCELLED" && <Badge tone="danger">{t("eventCancelledBadge")}</Badge>}
              {event.status === "COMPLETED" && <Badge tone="neutral">{t("eventEndedBadge")}</Badge>}
            </div>
            <span className="ml-auto flex shrink-0 gap-2">
              <FavoriteButton eventId={event.id} className="h-11 w-11" />
              <ShareButton title={event.title} />
            </span>
          </div>

          <h1 className="font-display text-[28px] font-extrabold leading-[32px] text-ink sm:text-4xl sm:leading-[1.1]">
            {event.title}
          </h1>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3.5">
              <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-surface text-lg font-bold text-ink">
                {event.organizer.logoUrl ? (
                  <Image src={event.organizer.logoUrl} alt="" width={52} height={52} className="h-full w-full object-cover" />
                ) : (
                  event.organizer.name.charAt(0).toUpperCase()
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-ink/80">{t("organizerLabel")}</p>
                <Link
                  href={`/organizers/${event.organizer.slug}`}
                  className="link-grad line-clamp-1 text-lg font-semibold leading-7"
                >
                  {event.organizer.name}
                </Link>
              </div>
            </div>
            <Link
              href={`/organizers/${event.organizer.slug}`}
              className="focus-ring btn-secondary inline-flex h-11 w-full items-center justify-center rounded-full border border-line-icon bg-sand text-[15px] font-semibold text-ink"
            >
              {t("viewProfile")}
            </Link>
          </div>

          <dl className="flex flex-col gap-4 pt-1">
            <div className="flex items-center gap-4">
              <span
                aria-hidden
                className="flex h-14 w-14 shrink-0 flex-col overflow-hidden rounded-box border border-line-icon bg-icon-btn text-center"
              >
                <span className="bg-[#333333] py-0.5 text-[11px] font-semibold uppercase tracking-wide text-ink">{month}</span>
                <span className="flex flex-1 items-center justify-center text-lg font-bold leading-none text-ink">{day}</span>
              </span>
              <div>
                <dt className="sr-only">{t("dateTime")}</dt>
                <dd className="text-[17px] font-medium capitalize text-ink">
                  {formatDate(event.startAt, { weekday: "long", year: undefined })}
                </dd>
                <dd className="text-[15px] text-muted">
                  {formatTime(event.startAt)} – {formatTime(event.endAt)}
                </dd>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-box border border-line-icon bg-icon-btn text-ink">
                <MapPin className="h-6 w-6" strokeWidth={1.75} aria-hidden />
              </span>
              <div className="min-w-0">
                <dt className="sr-only">{t("venue")}</dt>
                <dd className="line-clamp-1 text-[17px] font-medium text-ink">{event.venue?.name ?? event.city}</dd>
                <dd>
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring inline-flex items-center gap-0.5 rounded text-[15px] text-muted transition-colors hover:text-accent-400"
                  >
                    {locationLine || t("view")}
                    <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden />
                  </a>
                </dd>
              </div>
            </div>
          </dl>
        </div>

        {/* Get tickets — sticky right column on desktop, inline after date/location on mobile */}
        <div className="lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start">
          <EventPurchasePanel event={event} />
        </div>

        <div className="flex flex-col lg:col-start-1">
          <Reveal as="section">
            <h2 className="font-display text-xl font-extrabold text-ink">{t("aboutEvent")}</h2>
            <p className="mt-3 whitespace-pre-line text-[15px] leading-[22px] text-muted">{event.description}</p>
            <p className="mt-5 rounded-box border border-line bg-surface p-4 text-xs leading-relaxed text-disabled">
              {t("refundPolicy")}
            </p>
          </Reveal>

          <div className="my-8 h-px bg-line" />

          <Reveal as="section" delay={60}>
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-display text-xl font-extrabold text-ink">{t("location")}</h2>
              <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="link-grad text-sm font-semibold">
                {t("viewOnMap")}
              </a>
            </div>
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${t("viewOnMap")}: ${event.venue?.name ?? event.city}`}
              className="focus-ring relative mt-4 block h-[135px] overflow-hidden rounded-[20px] bg-map"
            >
              <svg className="absolute inset-0 h-full w-full text-white/[0.07]" aria-hidden>
                <defs>
                  <pattern id="map-grid" width="44" height="44" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
                    <path d="M0 0H44M0 0V44" stroke="currentColor" strokeWidth="6" fill="none" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#map-grid)" />
              </svg>
              <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-full flex-col items-center">
                <svg width="28" height="36" viewBox="0 0 28 36" aria-hidden>
                  <path d="M14 0C6.3 0 0 6.2 0 13.9 0 24.3 14 36 14 36s14-11.7 14-22.1C28 6.2 21.7 0 14 0z" fill="var(--color-accent-500)" />
                  <circle cx="14" cy="14" r="5" fill="var(--color-accent-ink)" />
                </svg>
              </span>
              <span className="absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] truncate rounded-full bg-black/60 px-3 py-1 text-xs text-ink backdrop-blur">
                {event.venue?.name ?? event.city}
              </span>
            </a>
          </Reveal>
        </div>
      </div>

      {related.length > 0 && (
        <Reveal as="section" className="mx-auto mt-14 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-5 font-display text-xl font-extrabold text-ink">{t("relatedEvents")}</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {related.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </Reveal>
      )}
    </div>
  );
}
