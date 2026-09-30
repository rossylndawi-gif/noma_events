import Image from "next/image";
import { Ticket } from "lucide-react";
import type { EventDTO } from "@/types";
import { Link } from "@/i18n/navigation";

/** Story-style rail of circular posters, each linking to its event. */
export function PosterRail({ events }: { events: EventDTO[] }) {
  return (
    <ul className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 [&::-webkit-scrollbar]:hidden">
      {events.map((event) => (
        <li key={event.id} className="w-[100px] shrink-0">
          <Link href={`/events/${event.slug}`} className="focus-ring group block rounded-2xl">
            <span className="block rounded-full border-2 border-line-card p-1 transition-colors group-hover:border-accent-500">
              <span className="relative block aspect-square overflow-hidden rounded-full bg-sand">
                {event.coverImage ? (
                  <Image
                    src={event.coverImage}
                    alt=""
                    fill
                    sizes="100px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <Ticket className="absolute inset-0 m-auto h-7 w-7 text-ink/30" aria-hidden />
                )}
              </span>
            </span>
            <span className="mt-2 line-clamp-2 text-center text-xs leading-4 text-ink/80">{event.title}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
