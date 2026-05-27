# n8n Workflows — export.dotsai.in

> Orchestration layer for the EXIM-SaaS platform. n8n owns anything time-based, multi-step, multi-service.
> n8n instance: **https://n8n.dotsai.cloud** (Docker on Hostinger VPS, container `n8n`, internal port `5678`).

---

## Architecture

```
Convex (DB) ──mutation hook──► n8n webhook ──► branches: WhatsApp / Email / Slack / Scrapling / Razorpay
                                  ▲
                                  │
                  Clerk / Razorpay webhooks (signed)
                                  ▲
                                  │
                  Cron triggers (scrape leads, daily digest, IEC status check)
```

n8n is the **only** place where:
- Time delays exist (wait 2 days then send touch 2)
- Cross-service orchestration runs (WhatsApp + Email + Slack from one event)
- Partner email parsing happens
- Razorpay/Clerk webhook side effects fire

Convex stays clean: pure DB + reactive queries + thin mutations. Everything async/IO-heavy → n8n.

---

## Workflows in this folder

| # | File | Trigger | What it does |
|---|---|---|---|
| 01 | `01-razorpay-webhook.json` | Razorpay webhook → n8n | Verify HMAC. On `payment.captured` → upgrade Convex plan + WhatsApp confirmation + Slack alert + start paid-onboarding seq. On `payment.failed` → dunning. |
| 02 | `02-clerk-signup-onboarding.json` | Clerk webhook → n8n | New user → create Convex user + Company → welcome WhatsApp + Slack #work alert + start free-tier nurture |
| 03 | `03-outbound-whatsapp-sequence.json` | Convex mutation hook (`leads.bulkInsert` or `leads.statusChange`) | Branch by lead.score/status → Touch 1 → Wait 2d → Touch 2 → Wait 3d → Touch 3. Stop on any inbound message. |
| 04 | `04-email-cadence-cold.json` | Same as 03 | 5-touch cold email cadence over 14 days. IMAP polls for replies, halts sequence on reply. |
| 05 | `05-license-wizard-partner.json` | Convex mutation (`licenseWorkflows.create`) | Email partner CA → 24h follow-up cron → on CA reply (IMAP polling) parse status → update Convex → WhatsApp customer → repeat for next license type. |
| 06 | `06-lead-scrape-orchestrator.json` | Cron (every 6h councils, 24h directories) | SSH/HTTP into Scrapling service → run scraper → wait → fetch results → push to Convex `leads:bulkInsert`. Slack alert if 0 results. |
| 07 | `07-daily-ops-digest.json` | Cron (6pm IST daily) | Query Convex (calls today, demos booked, paid signups, MRR) → format → post to Slack #work + Telegram personal. |
| 08 | `08-iec-status-check.json` | Cron (weekly Monday 9am) | For each customer with IEC → HTTP to Scrapling service → check DGFT IEC status → if expired/cancelled, alert customer + ZeroOne ops. |

---

## How to import

### Option A — manual (no API key needed)

1. Sign in to https://n8n.dotsai.cloud
2. Workflows → **Import from File** → select a JSON from `n8n/workflows/`
3. Open each node → check credentials (WhatsApp Bot API, SMTP, Slack webhook, Convex deploy URL) are set
4. **Activate** the workflow (top-right toggle)
5. For webhook-triggered workflows: copy the production webhook URL from the Webhook node and paste into the env var noted in each workflow header (e.g. `N8N_WEBHOOK_RAZORPAY`)

### Option B — programmatic (needs N8N_API_KEY)

```bash
# Set in your env or .env.local
export N8N_HOST=https://n8n.dotsai.cloud
export N8N_API_KEY=<get from n8n.dotsai.cloud/settings/api>

# Import all
node n8n/scripts/import-all.mjs
```

---

## Convex → n8n integration

Each workflow exposes a webhook. Convex actions call them via the helper at
`convex/lib/n8nClient.ts`.

Example — when a lead is created/updated, Convex fires the outbound sequence workflow:

```ts
// convex/leads.ts
import { internalAction } from "./_generated/server";
import { fireN8nWebhook } from "./lib/n8nClient";

export const triggerOutboundSequence = internalAction({
  args: { leadId: v.id("leads"), event: v.string() },
  handler: async (ctx, { leadId, event }) => {
    const lead = await ctx.runQuery(internal.leads.getById, { leadId });
    await fireN8nWebhook("outbound-sequence", { leadId, event, lead });
  },
});
```

---

## Required credentials inside n8n

For each external service, add credentials once in n8n (`Credentials` → `Add new`):

| Credential | Type | Source |
|---|---|---|
| `Convex Deploy Key` | HTTP Header — `Authorization: Bearer ...` | `npx convex deploy --key` |
| `WhatsApp Bot API` | HTTP Header — `Authorization: Bearer ...` | services/whatsapp-bot/.env on VPS |
| `Slack Webhook (work)` | Slack webhook URL | meet-workstyle channels/.env → `SLACK_WEBHOOK_WORK` |
| `Telegram Bot` | Telegram credentials | meet-workstyle channels/.env → `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID_PERSONAL` |
| `Razorpay HMAC Secret` | n8n env — `RAZORPAY_WEBHOOK_SECRET` | razorpay.com → Settings → Webhooks |
| `Clerk Webhook Signing` | n8n env — `CLERK_WEBHOOK_SECRET` | clerk.com → Webhooks → Signing secret |
| `SMTP (transactional)` | SMTP credentials | TBD — Postmark / SendGrid / Resend |
| `IMAP (reply detection)` | IMAP credentials | same mailbox as SMTP |
| `Scrapling service` | HTTP — `Authorization: Bearer ...` | self-hosted; token in env |

---

## Naming conventions

- Workflow names in n8n: `export-NN-name` (matches file names here)
- All webhook paths: `/webhook/export-NN-name`
- All cron names: same as workflow name
- Tag every workflow with tag `export-dotsai-in` for grouping

---

## What's in here vs. what to build in n8n UI

This folder contains **2 reference JSONs** (Razorpay + Clerk — they're the smallest + most self-contained, perfect templates for the rest).

The other 6 are specced in `SPECS.md` — build them in the UI using the spec, then **export the JSON back into this folder** and commit. That way the repo is the source of truth.

---

## Local dev

For local Next.js dev, point at the production n8n (no separate dev n8n yet). Use n8n `webhook-test` URL during dev so you don't trigger live side effects:

```
production:  https://n8n.dotsai.cloud/webhook/export-01-razorpay
testing:     https://n8n.dotsai.cloud/webhook-test/export-01-razorpay
```

The test URL only fires when n8n's "Test workflow" button is pressed. Use it.
