import type { IncomingMessage, ServerResponse } from "node:http";
import { createApp } from "./app";
import { logger } from "./config/logger";
import { connectDatabase } from "./database/connection";
import { runSweeps, SWEEP_INTERVAL_MS } from "./jobs/sweeps";

// Vercel serverless entry point. Module state survives between requests on a
// warm instance, so the app and the MongoDB connection are created once and
// reused rather than rebuilt per request.
const app = createApp();

let dbReady: Promise<void> | null = null;
let lastSweepAt = 0;

function ensureDatabase(): Promise<void> {
  if (!dbReady) {
    dbReady = connectDatabase().catch((err) => {
      // Let the next request retry instead of caching the failure forever.
      dbReady = null;
      throw err;
    });
  }
  return dbReady;
}

// There's no long-running process to own a setInterval, so the periodic
// sweeps piggyback on incoming traffic, at most once per SWEEP_INTERVAL_MS.
async function maybeRunSweeps(): Promise<void> {
  const now = Date.now();
  if (now - lastSweepAt < SWEEP_INTERVAL_MS) return;
  lastSweepAt = now;
  await runSweeps();
}

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  try {
    await ensureDatabase();
    await maybeRunSweeps();
  } catch (err) {
    logger.error({ err }, "Database connection failed");
    res.statusCode = 503;
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ success: false, error: { code: "DB_UNAVAILABLE", message: "Database unavailable" } }));
    return;
  }
  app(req as Parameters<typeof app>[0], res as Parameters<typeof app>[1]);
}
