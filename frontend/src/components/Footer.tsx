import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BrandMark } from "@/components/BrandMark";

// Placeholders — confirm real handles and address before launch.
const CONTACT_EMAIL = "team@bomaevents.com";
const SOCIALS = [
  {
    label: "Instagram",
    href: "https://instagram.com/bomaevents",
    path: "M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm4.9-8.9a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2zM12 3.6c2.7 0 3 0 4.1.1 2.7.1 4 1.4 4.1 4.1.1 1.1.1 1.4.1 4.1s0 3-.1 4.1c-.1 2.7-1.4 4-4.1 4.1-1.1.1-1.4.1-4.1.1s-3 0-4.1-.1c-2.7-.1-4-1.4-4.1-4.1C3.7 15 3.6 14.7 3.6 12s0-3 .1-4.1c.1-2.7 1.4-4 4.1-4.1C8.9 3.7 9.3 3.6 12 3.6z",
  },
  {
    label: "X",
    href: "https://x.com/bomaevents",
    path: "M17.8 3.5h3l-6.6 7.5 7.8 9.5h-6.1l-4.8-5.9-5.5 5.9h-3l7.1-7.9L2.3 3.5h6.2l4.3 5.4 5-5.4zm-1 15.3h1.7L7.3 5.1H5.5l11.3 13.7z",
  },
  {
    label: "TikTok",
    href: "https://tiktok.com/@bomaevents",
    path: "M16.6 3c.3 2.2 1.6 3.6 3.9 3.7v2.6c-1.4.1-2.6-.3-3.9-1.1v5c0 6.3-6.9 8.3-9.6 3.8-1.8-2.9-.7-8 5-8.2v2.8c-.4.1-.9.2-1.3.3-1.3.4-2 1.3-1.8 2.8.4 2.7 5.3 3.5 4.9-1.8V3h2.8z",
  },
];

const linkClass = "text-muted transition-colors hover:text-accent-400";

export function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className="mt-16 border-t border-line bg-footer">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <BrandMark />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{t("tagline")}</p>
          <div className="mt-5 flex gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${s.label} @bomaevents`}
                className="focus-ring icon-btn flex h-10 w-10 items-center justify-center rounded-full border border-line-icon bg-icon-btn text-ink/80"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-ink">{t("discoverHeading")}</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/events" className={linkClass}>{t("allEvents")}</Link></li>
            <li><Link href="/events?free=true" className={linkClass}>{t("freeEvents")}</Link></li>
            <li><Link href="/cities/libreville" className={linkClass}>Libreville</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-ink">{t("organizersHeading")}</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/organizer" className={linkClass}>{t("createEvent")}</Link></li>
            <li><Link href="/register" className={linkClass}>{t("becomeOrganizer")}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-ink">{t("supportHeading")}</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/help" className={linkClass}>{t("helpFaq")}</Link></li>
            <li><Link href="/help#refund" className={linkClass}>{t("refunds")}</Link></li>
            <li><a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>{CONTACT_EMAIL}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line px-6 py-5 text-center text-xs text-disabled">
        {t("copyright", { year: new Date().getFullYear() })}
      </div>
    </footer>
  );
}
