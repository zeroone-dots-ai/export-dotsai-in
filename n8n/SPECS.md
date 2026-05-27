# n8n Workflow Specifications

> Detailed specs for each workflow. Build in n8n UI (https://n8n.dotsai.cloud) using these specs.
> Export the JSON back to `workflows/` after each one works.

---

## 01 · Razorpay Webhook Handler

**File:** `workflows/01-razorpay-webhook.json` (provided as template)

**Trigger:** Webhook node — path `export-01-razorpay`
**Auth:** Razorpay HMAC signature in `X-Razorpay-Signature` header. Verify against `RAZORPAY_WEBHOOK_SECRET`.

**Flow:**
1. Webhook receives Razorpay event
2. **HMAC verify** node — if invalid, return 400 + stop
3. **Switch** on `event` field:
   - `payment.captured` → branch A
   - `payment.failed` → branch B
   - `subscription.activated` → branch C
   - else → ignore (200 OK)
4. **Branch A (payment.captured):**
   a. HTTP POST → Convex `companies:upgradePlan` mutation with `{ companyId, plan: "operator" }`
   b. HTTP POST → WhatsApp Bot: "Payment confirmed ✅ Your Operator plan is live."
   c. HTTP POST → Slack #work webhook: "💰 New paid signup: {company name} · ₹{amount} · {plan}"
   d. Set Convex `leads.status = "won"` if linked lead exists
5. **Branch B (payment.failed):**
   a. HTTP POST → WhatsApp Bot: payment retry message with new payment link
   b. Schedule (Wait node): 24h then retry
   c. After 3 retries → downgrade to free, notify Slack #work

**Output:** Returns `{ ok: true }` to Razorpay (must be < 5 seconds).

---

## 02 · Clerk Signup Onboarding

**File:** `workflows/02-clerk-signup-onboarding.json` (provided as template)

**Trigger:** Webhook — path `export-02-clerk-signup`
**Auth:** Clerk Svix signature in `svix-signature` header. Verify against `CLERK_WEBHOOK_SECRET`.

**Flow:**
1. Webhook receives Clerk event
2. Verify Svix signature
3. **Switch** on `type`:
   - `user.created` → branch A
   - `session.created` → branch B (just log)
4. **Branch A (user.created):**
   a. HTTP POST → Convex `users:create` mutation with Clerk user data
   b. HTTP POST → Convex `companies:createEmpty` mutation, link to user
   c. HTTP POST → WhatsApp Bot: welcome message (if phone provided)
   d. HTTP POST → Slack #work: "👤 New signup: {email}"
   e. Trigger workflow `04-email-cadence-cold` (free-tier nurture branch)

---

## 03 · Outbound WhatsApp Sequence Engine

**Trigger:** Webhook — path `export-03-whatsapp-sequence`
**Auth:** Convex Bearer token

**Flow:**
1. Webhook receives `{ leadId, event: "new" | "demo_held" | "lost" }`
2. **Switch** on event → select sequence template
3. Each sequence is a chain of:
   - **HTTP Request → WhatsApp Bot** (send message)
   - **Wait** node (2d, 3d, 5d as per `gtm/whatsapp-sequences.md`)
   - Between each send: **HTTP Request → Convex `leads:getById`** to check if `status === "won" | "lost" | "demo_done"` — if so, **stop**
4. Log every send to Convex `leadActivities:create`

**Sequences to implement:**
- Cold outbound (3 touches over 5 days)
- Post-demo (3 touches over 5 days)
- Free-tier nurture (3 touches over 14 days)
- Paid onboarding (3 touches over 30 days)
- Lost-deal recovery (1 touch at 60 days)

---

## 04 · Email Cadence — Cold

**Trigger:** Webhook — path `export-04-email-cold`
**Auth:** Convex Bearer token

**Flow:**
1. Receive `{ leadId, sequence: "cold" | "post_demo" | "nurture" }`
2. Run sequence from `gtm/email-sequences.md`
3. After each send, **IMAP** node polls inbox for reply matching the lead's email
4. If reply detected → stop sequence + update Convex `leads.status = "connected"` + Slack alert
5. Use **transactional SMTP** (Postmark/SendGrid/Resend) for sends, **NOT** Gmail (deliverability)

---

## 05 · License Wizard Partner Orchestration

**Trigger:** Webhook — path `export-05-license-wizard`
**Auth:** Convex Bearer token

**Flow:**
1. Receive `{ workflowId, type: "iec"|"ad_code"|"rcmc"|"lut"|"icegate", companyData, documents }`
2. **Email to partner CA** (look up by company city via Convex `partners:byCity`)
   - Attach uploaded documents (URLs from MyCloud)
   - Use a template per license type
3. **Set Wait** 24h → check Convex `licenseWorkflows.status`. If still `pending_documents`, send reminder to CA.
4. **IMAP polling** for CA reply → parse status (regex on subject line: "filed", "issued", "rejected")
5. Update Convex `licenseWorkflows.status`
6. **WhatsApp** customer with status update
7. If `issued` and there's a next license type pending → loop back to step 2 for next type
8. When all licenses done → mark company `onboardingComplete: true` + WhatsApp + Slack

---

## 06 · Lead Scrape Orchestrator

**Trigger:** Cron — multiple schedules
- Councils: every 6h
- IndiaMart: every 24h (4am IST)
- Volza: every 24h (5am IST)

**Flow per source:**
1. **HTTP POST** to Scrapling service on VPS: `https://scrape.internal:8080/run/{source}` with auth header
2. **Wait** until response (long-poll up to 5 min) or scrape job ID returned
3. **HTTP GET** results from Scrapling service
4. **Function node** — normalize records, score them (port logic from `scraping/pipeline/score.py`)
5. **HTTP POST** → Convex `leads:bulkInsert` (batches of 100)
6. **If** count is 0 OR much lower than last run (>50% drop) → Slack alert "Scraper {source} may be broken"
7. **End-of-day summary** → Slack #work: "Today: {N} new leads, {high} high-score"

Note: Scrapling needs to be exposed as a small HTTP wrapper service. See `scraping/service/` (to be built).

---

## 07 · Daily Ops Digest

**Trigger:** Cron — every day at 6pm IST

**Flow:**
1. HTTP queries to Convex:
   - `leadActivities:countToday` (calls today, by actor)
   - `leads:countByStatus` (demos booked today, deals won today)
   - `companies:countByPlanChangeToday`
   - `shipments:sumCommissionToday`
2. Format markdown block
3. POST to Slack #work webhook + Telegram personal
4. Save digest to Convex `dailyDigests` (for history)

---

## 08 · IEC Status Check

**Trigger:** Cron — every Monday 9am IST

**Flow:**
1. **Convex query** — get all customers with `companies.iec != null` and `plan != "free"`
2. **For each:** HTTP POST to Scrapling service → check IEC status on dgft.gov.in
3. **If** status != "active" → update Convex `companies.iec_status` + alert customer via WhatsApp + alert ops via Slack
4. **If** status approaches expiry (90 days) → start renewal nurture sequence (call workflow 03)

---

## Common patterns

**Convex authentication:** All HTTP calls to Convex use `Authorization: Bearer <CONVEX_DEPLOY_KEY>` header. Set this credential once in n8n.

**Error handling:** Every workflow has an "Error Trigger" branch that posts to Slack #work-alerts on unhandled errors.

**Idempotency:** All Convex mutations should be idempotent (check before insert). Use `externalId` field where appropriate to prevent duplicates from retried webhooks.

**Retry policy:** HTTP nodes set to retry 3x with exponential backoff on 5xx errors.
