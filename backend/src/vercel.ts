import express from "express";
import { createApp } from "./app";
import { logger } from "./config/logger";
import { connectDatabase } from "./database/connection";
import { runSweeps, SWEEP_INTERVAL_MS } from "./jobs/sweeps";

// Vercel entry point (the "backend" service's entrypoint in /vercel.json).
// Module state survives between requests on a warm instance, so the app and
// the MongoDB connection are created once and reused rather than rebuilt per
// request.
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

// Vercel's Express preset expects the entrypoint to import express and
// default-export an app, so the DB/sweep guard is an outer app that mounts
// the real one.
const vercelApp = express();

vercelApp.use(async (_req, res, next) => {
  try {
    await ensureDatabase();
    await maybeRunSweeps();
  } catch (err) {
    logger.error({ err }, "Database connection failed");
    res.status(503).json({ success: false, error: { code: "DB_UNAVAILABLE", message: "Database unavailable" } });
    return;
  }
  next();
});
vercelApp.use(app);

export default vercelApp;
