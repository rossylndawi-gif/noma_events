import { logger } from "../config/logger";
import { sweepExpiredOrders } from "../modules/orders/orders.service";
import { sweepCompletedEvents } from "../modules/events/events.service";

export const SWEEP_INTERVAL_MS = 60 * 1000;

export async function runSweeps(): Promise<void> {
  try {
    const [expiredOrders, completedEvents] = await Promise.all([sweepExpiredOrders(), sweepCompletedEvents()]);
    if (expiredOrders > 0 || completedEvents > 0) {
      logger.info({ expiredOrders, completedEvents }, "Periodic sweep completed");
    }
  } catch (err) {
    logger.error({ err }, "Periodic sweep failed");
  }
}
