import { getTranslations, setRequestLocale } from "next-intl/server";
import { Flame, Sparkles } from "lucide-react";
import type { CategoryDTO, EventDTO } from "@/types";
import { apiGet } from "@/lib/api";
import { EventCard } from "@/components/EventCard";
import { EmptyState } from "@/components/ui/States";
import { HomeGreeting } from "@/components/home/HomeGreeting";
import { QuickFilters } from "@/components/home/QuickFilters";
import { PosterRail } from "@/components/home/PosterRail";
import { FeaturedCard } from "@/components/home/FeaturedCard";
import { Reveal } from "@/components/Reveal";
import { Link } from "@/i18n/navigation";

async function getHomeData() {
  const [eventsRes, categoriesRes] = await Promise.all([
    apiGet<EventDTO[]>("/events?limit=12&sort=date", { auth: false }).catch(() => ({ data: [] as EventDTO[] })),
    apiGet<CategoryDTO[]>("/categories", { auth: false }).catch(() => ({ data: [] as CategoryDTO[] })),
  ]);
  return { events: eventsRes.data, categories: categoriesRes.data };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const { events, categories } = await getHomeData();
  const featured = events.slice(0, 3);
  const upcoming = events.slice(3);
  const organizers = dedupeOrganizers(events).slice(0, 6);

  return (
    <div>
      <h1 className="sr-only">{t.rich("headline", { gold: (chunks) => chunks })}</h1>

      {/* Hero: greeting, quick filters, poster rail, featured posters */}
      <section className="relative isolate overflow-hidden">
        <div aria-hidden className="absolute -left-24 -top-32 -z-10 h-80 w-80 rounded-full bg-accent-500/10 blur-3xl" />
        <div className="container-page flex flex-col gap-6 pb-10 pt-5">
          <HomeGreeting />

          <QuickFilters categories={categories} />

          {events.length > 0 && (
            <div>
              <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-extrabold text-ink">
                <Flame className="h-5 w-5 text-accent-400" aria-hidden />
                {t("comingUp")}
              </h2>
              <PosterRail events={events.slice(0, 10)} />
            </div>
          )}

          <div>
            <div className="mb-4 flex items-end justify-between gap-4">
              <h2 className="flex items-center gap-2 font-display text-xl font-extrabold text-ink">
                <Sparkles className="h-5 w-5 text-accent-400" aria-hidden />
                {t("featuredEvents")}
              </h2>
              <Link href="/events" className="focus-ring rounded text-sm font-medium text-accent-400 underline-offset-4 hover:underline">
                {t("seeAll")}
              </Link>
            </div>
            {featured.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {featured.map((event, i) => (
                  <FeaturedCard key={event.id} event={event} priority={i === 0} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {upcoming.length > 0 && (
        <Reveal as="section" className="container-page pb-12">
          <h2 className="mb-5 font-display text-xl font-extrabold text-ink">{t("upcomingEvents")}</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </Reveal>
      )}


      {categories.length > 0 && (
        <section className="border-y border-line bg-footer py-12">
          <div className="container-page">
            <h2 className="mb-6 font-display text-2xl font-extrabold text-ink">{t("exploreByCategory")}</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="focus-ring flex items-center justify-center rel-card rounded-card border border-line-card bg-surface px-4 py-6 text-center text-sm font-semibold text-ink"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {organizers.length > 0 && (
        <section className="container-page py-12">
          <h2 className="mb-6 font-display text-2xl font-extrabold text-ink">{t("organizersToFollow")}</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {organizers.map((org) => (
              <Link
                key={org.id}
                href={`/organizers/${org.slug}`}
                className="focus-ring flex flex-col items-center gap-2 rel-card rounded-card border border-line-card bg-surface p-4 text-center"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sand text-lg font-bold text-ink">
                  {org.name.charAt(0)}
                </span>
                <span className="line-clamp-1 text-sm font-medium text-ink">{org.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="relative overflow-hidden border-t border-line py-16 text-ink">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full border border-accent-500/15" />
        <div className="absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-accent-500/15 blur-3xl" />
        <div className="container-page relative z-10 text-center">
          <h2 className="font-display text-2xl font-extrabold sm:text-3xl">{t("cultureHeading")}</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">{t("cultureSubheading")}</p>
          <Link
            href="/categories/culture-patrimoine"
            className="focus-ring btn-accent mt-6 inline-flex h-10 items-center rounded-full bg-accent-500 px-6 text-sm font-semibold text-accent-ink"
          >
            {t("exploreCulture")}
          </Link>
        </div>
      </section>
    </div>
  );
}

function dedupeOrganizers(events: EventDTO[]) {
  const seen = new Map<string, EventDTO["organizer"]>();
  for (const event of events) {
    if (!seen.has(event.organizer.id)) seen.set(event.organizer.id, event.organizer);
  }
  return Array.from(seen.values());
}
