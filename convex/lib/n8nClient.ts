/**
 * Fire-and-forget client for n8n webhooks.
 *
 * Use from Convex `internalAction`s (NOT mutations — mutations are deterministic
 * and cannot perform network I/O). Pattern:
 *
 *   import { internalAction } from "../_generated/server";
 *   import { fireN8nWebhook } from "./lib/n8nClient";
 *
 *   export const onNewLead = internalAction({
 *     args: { leadId: v.id("leads") },
 *     handler: async (ctx, { leadId }) => {
 *       const lead = await ctx.runQuery(internal.leads.getById, { leadId });
 *       await fireN8nWebhook("export-03-whatsapp-sequence", { lead });
 *     },
 *   });
 *
 * Webhook paths follow the convention: `export-NN-name` (see n8n/SPECS.md).
 * Each workflow's Webhook node uses that path; n8n exposes it at
 *   {N8N_HOST}/webhook/{path}     (production)
 *   {N8N_HOST}/webhook-test/{path} (test — only fires while UI test is active)
 *
 * Required Convex env vars (set via `npx convex env set ...`):
 *   N8N_HOST           — e.g. https://n8n.dotsai.cloud
 *   N8N_WEBHOOK_SECRET — shared bearer token; n8n verifies via Header Auth credential
 *   N8N_MODE           — "production" (default) | "test"
 */

const HOST = process.env.N8N_HOST?.replace(/\/$/, "");
const SECRET = process.env.N8N_WEBHOOK_SECRET;
const MODE = (process.env.N8N_MODE || "production") as "production" | "test";

const PATH_PREFIX = MODE === "test" ? "/webhook-test" : "/webhook";

export type WebhookPath =
  | "export-01-razorpay"
  | "export-02-clerk-signup"
  | "export-03-whatsapp-sequence"
  | "export-04-email-cold"
  | "export-05-license-wizard"
  | "export-06-lead-scrape"
  | "export-07-daily-digest"
  | "export-08-iec-status-check";

export interface FireOptions {
  /** Don't throw on network/non-2xx errors. Default true (fire-and-forget). */
  swallow?: boolean;
  /** Wait for n8n response. Default false. */
  awaitResponse?: boolean;
  /** Override timeout in ms. Default 8_000. */
  timeoutMs?: number;
  /** Idempotency key — n8n workflow can use this to de-dupe replays. */
  idempotencyKey?: string;
}

/**
 * POST a JSON payload to an n8n webhook. Fire-and-forget by default.
 *
 * Returns the parsed JSON response if `awaitResponse: true`, else `null`.
 * Throws only when `swallow: false` AND a network/HTTP error occurs.
 */
export async function fireN8nWebhook<TResp = unknown>(
  path: WebhookPath,
  payload: Record<string, unknown>,
  opts: FireOptions = {},
): Promise<TResp | null> {
  const { swallow = true, awaitResponse = false, timeoutMs = 8_000, idempotencyKey } = opts;

  if (!HOST) {
    const msg = "[n8nClient] N8N_HOST not set — skipping webhook " + path;
    if (swallow) {
      console.warn(msg);
      return null;
    }
    throw new Error(msg);
  }

  const url = `${HOST}${PATH_PREFIX}/${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "User-Agent": "convex-export-dotsai-in/1",
  };
  if (SECRET) headers["Authorization"] = `Bearer ${SECRET}`;
  if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      const err = `[n8nClient] ${path} → HTTP ${res.status}: ${body.slice(0, 300)}`;
      if (swallow) {
        console.error(err);
        return null;
      }
      throw new Error(err);
    }

    if (!awaitResponse) return null;
    return (await res.json()) as TResp;
  } catch (e) {
    const msg = `[n8nClient] ${path} fetch failed: ${(e as Error).message}`;
    if (swallow) {
      console.error(msg);
      return null;
    }
    throw e;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Helper: fire multiple webhooks in parallel. Always swallows individual errors.
 */
export async function fireMany(
  fires: Array<{ path: WebhookPath; payload: Record<string, unknown>; key?: string }>,
): Promise<void> {
  await Promise.allSettled(
    fires.map(({ path, payload, key }) =>
      fireN8nWebhook(path, payload, { swallow: true, idempotencyKey: key }),
    ),
  );
}
