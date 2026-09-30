"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Minus, Plus } from "lucide-react";
import type { EventDTO } from "@/types";
import { formatXaf } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";

const stepperClass =
  "focus-ring flex h-9 w-9 items-center justify-center rounded-full bg-accent-500 text-accent-ink transition-colors hover:bg-accent-400 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-accent-500";

export function EventPurchasePanel({ event }: { event: EventDTO }) {
  const t = useTranslations("eventDetail");
  const router = useRouter();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const ticketTypes = useMemo(() => event.ticketTypes ?? [], [event.ticketTypes]);

  const totalXaf = useMemo(
    () =>
      ticketTypes.reduce((sum, tt) => sum + (quantities[tt.id] ?? 0) * tt.priceXaf, 0),
    [ticketTypes, quantities],
  );
  const totalQty = useMemo(() => Object.values(quantities).reduce((a, b) => a + b, 0), [quantities]);

  const canPurchase = event.status === "PUBLISHED" && ticketTypes.some((tt) => tt.remaining > 0);

  function setQty(id: string, qty: number, max: number) {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(0, Math.min(qty, max, 20)) }));
  }

  function handleCheckout() {
    if (totalQty === 0) return;
    const params = new URLSearchParams();
    Object.entries(quantities)
      .filter(([, qty]) => qty > 0)
      .forEach(([id, qty]) => params.set(`qty_${id}`, String(qty)));
    router.push(`/checkout/${event.id}?${params.toString()}`);
  }

  if (event.status === "CANCELLED") {
    return (
      <Card>
        <CardBody className="text-center">
          <p className="font-semibold text-danger">{t("eventCancelled")}</p>
          <p className="mt-1 text-sm text-muted">{t("ticketsNoLongerValid")}</p>
        </CardBody>
      </Card>
    );
  }

  if (event.status === "COMPLETED") {
    return (
      <Card>
        <CardBody className="text-center text-muted">{t("eventEnded")}</CardBody>
      </Card>
    );
  }

  if (ticketTypes.length === 0) {
    return (
      <Card>
        <CardBody className="text-center text-muted">{t("ticketsNotAvailableYet")}</CardBody>
      </Card>
    );
  }

  return (
    <Card className="p-1">
      <div className="rounded-[20px_20px_0_0] bg-band px-5 py-4">
        <h2 className="font-display text-xl font-extrabold text-ink">{t("getTickets")}</h2>
      </div>

      <div className="px-4 pb-4 pt-5">
        <p className="text-[15px] text-ink/90">{t("chooseTicketType")}</p>

        <ul className="mt-4 space-y-3">
          {ticketTypes.map((tt) => {
            const qty = quantities[tt.id] ?? 0;
            const soldOut = tt.remaining === 0;
            const max = Math.min(tt.remaining, 20);
            const info = (
              <span className="min-w-0 text-left">
                <span className={`block text-base font-semibold ${soldOut ? "text-ink/40" : "text-ink"}`}>{tt.name}</span>
                <span className={`block text-[15px] ${soldOut ? "text-ink/40" : "text-ink/80"}`}>
                  {soldOut ? `${formatXaf(tt.priceXaf)} · ${t("soldOut")}` : formatXaf(tt.priceXaf)}
                </span>
              </span>
            );

            if (qty === 0) {
              // Unselected row: the whole row is one tap target that selects a first ticket.
              return (
                <li key={tt.id}>
                  <button
                    type="button"
                    disabled={soldOut}
                    data-disabled={soldOut}
                    onClick={() => setQty(tt.id, 1, tt.remaining)}
                    aria-label={soldOut ? undefined : `${tt.name}, ${formatXaf(tt.priceXaf)} — ${t("addTicket")}`}
                    className="ticket-row focus-ring flex min-h-[64px] w-full items-center justify-between gap-3 rounded-row border border-line-row bg-transparent px-6 py-3 disabled:cursor-not-allowed"
                  >
                    {info}
                    {!soldOut && (
                      <span className="shrink-0 text-xs text-muted">{t("remaining", { count: tt.remaining })}</span>
                    )}
                  </button>
                </li>
              );
            }

            return (
              <li
                key={tt.id}
                data-active="true"
                className="ticket-row flex min-h-[64px] items-center justify-between gap-3 rounded-row border px-6 py-3"
              >
                {info}
                <div className="flex shrink-0 items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQty(tt.id, qty - 1, tt.remaining)}
                    className={stepperClass}
                    aria-label={t("removeTicket")}
                  >
                    <Minus className="h-4 w-4" strokeWidth={2.5} />
                  </button>
                  <span className="w-6 text-center text-lg font-semibold tabular-nums text-ink" aria-live="polite">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty(tt.id, qty + 1, tt.remaining)}
                    // The row just replaced the tapped button; keep keyboard focus on it.
                    autoFocus
                    disabled={qty >= max}
                    className={stepperClass}
                    aria-label={t("addTicket")}
                  >
                    <Plus className="h-4 w-4" strokeWidth={2.5} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="mt-4 text-[15px] text-ink/90">
          {t.rich("ticketQuestions", {
            link: (chunks) => (
              <Link href={`/organizers/${event.organizer.slug}`} className="underline underline-offset-2 hover:text-accent-400">
                {chunks}
              </Link>
            ),
          })}
        </p>

        <Button className="mt-4 h-12 w-full text-base" disabled={!canPurchase || totalQty === 0} onClick={handleCheckout}>
          {totalQty > 0 ? `${t("continue")} · ${formatXaf(totalXaf)}` : t("continue")}
        </Button>
      </div>
    </Card>
  );
}
