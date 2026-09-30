import { useTranslations } from "next-intl";
import { CalendarCheck, CalendarPlus, CalendarRange, Radio, Ticket, type LucideIcon } from "lucide-react";
import type { CategoryDTO } from "@/types";
import { categoryIcon } from "@/lib/categoryIcons";
import { Link } from "@/i18n/navigation";

/** Horizontally scrolling row of icon tiles: time filters first, then categories. */
export function QuickFilters({ categories }: { categories: CategoryDTO[] }) {
  const t = useTranslations("home");

  const items: { href: string; label: string; icon: LucideIcon }[] = [
    { href: "/events", label: t("happening"), icon: Radio },
    { href: "/events?when=today", label: t("today"), icon: CalendarCheck },
    { href: "/events?when=tomorrow", label: t("tomorrow"), icon: CalendarPlus },
    { href: "/events?when=weekend", label: t("thisWeekend"), icon: CalendarRange },
    { href: "/events?free=true", label: t("free"), icon: Ticket },
    ...categories.map((c) => ({ href: `/categories/${c.slug}`, label: c.name, icon: categoryIcon(c.slug) })),
  ];

  return (
    <nav aria-label={t("quickFilters")} className="-mx-4 sm:-mx-6 lg:-mx-8">
      <ul className="flex snap-x scroll-px-2 overflow-x-auto px-2 [scrollbar-width:none] sm:scroll-px-4 sm:px-4 lg:scroll-px-6 lg:px-6 [&::-webkit-scrollbar]:hidden">
        {items.map((item, i) => (
          <li key={item.href} className="flex shrink-0 snap-start items-stretch">
            {i > 0 && <span className="my-3 w-px bg-line-icon" aria-hidden />}
            <Link
              href={item.href}
              className="focus-ring group flex min-w-[92px] flex-col items-center gap-2 rounded-2xl px-3 py-2.5 text-center"
            >
              <item.icon
                className="h-9 w-9 text-ink transition-colors group-hover:text-accent-400"
                strokeWidth={1.4}
                aria-hidden
              />
              <span className="whitespace-nowrap text-[15px] text-ink/90">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
