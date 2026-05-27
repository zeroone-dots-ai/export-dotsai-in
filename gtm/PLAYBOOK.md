# GTM Playbook — export.dotsai.in

> Operating cadence for Meet + Jayesh + future sales hires. Pin this to your wall.

---

## North star

**Goal:** 100 paying Operator-plan customers (₹3k/mo each) within the first push. That's ₹3L MRR before counting the 1% commission upside.

**Funnel math (assumed; revise after first 30 days of real data):**

| Stage | Conv rate | Volume needed for 100 paid |
|---|---|---|
| Raw leads | 100% | 10,000 |
| Calls connected | 25% | 2,500 |
| Demos booked | 25% of connected | 625 |
| Demos held | 80% of booked | 500 |
| Demo → paid | 20% of held | 100 |

→ We need ~10,000 qualified leads at the top of the funnel. That's why lead scraping is non-negotiable.

---

## Lead sources (priority order)

| # | Source | Why | Difficulty |
|---|---|---|---|
| 1 | **Volza** — India shippers, last 12 mo | Real shipment data, fresh, high intent | Medium (free tier limit, paid is ~$200/mo) |
| 2 | **Council member lists** (FIEO, EEPC, AEPC, Pharmexcil, Capexil, APEDA) | Existing exporters by definition | Easy (public PDFs and pages) |
| 3 | **IndiaMart "Exporter" categories** | High volume, includes contact info | Medium (anti-bot, but Scrapling handles) |
| 4 | **DGFT IEC database** | Authoritative; if scrapeable, gold | Hard (govt portal, often down) |
| 5 | **ExportersIndia** | B2B directory, similar to IndiaMart | Medium |
| 6 | **MSME Udyam directory** by NIC code (export-oriented codes) | Government-issued, low cost MSMEs | Medium |
| 7 | **LinkedIn searches** ("export manager Ahmedabad" etc.) | Direct human contact | Easy manual, hard scraping |

Run order: scrape #2 first (easiest, highest signal), then #1 (best data), then #3 (volume).

---

## Daily cadence (per sales rep)

Morning (9 — 12):
- 40 cold calls from yesterday's "new" leads in the dashboard
- Update each lead with outcome (connected, voicemail, wrong number, not interested, callback)
- Send WhatsApp follow-up to anyone who didn't pick up

Afternoon (2 — 6):
- 4 — 6 demos (booked from prior days)
- Send post-demo PDF + pricing within 1 hour of every demo
- Update CRM: stage advance, next action date

End of day:
- Slack #work channel: today's numbers (calls / connected / demos / paid)
- Telegram personal channel for any "hot lead" needing decision

Weekly:
- Monday 9am: sales sync with Jayesh + Meet. Review funnel, decide ICP shifts, retire dead leads, plan source rotation for next week.

---

## Cold call rules

1. **First 8 seconds matter.** "Hi {name}, I'm calling from ZeroOne Export — we make a dashboard that handles export documents, HS codes, and buyer discovery. Are you exporting right now?" — pause and listen.
2. **Don't pitch on call #1.** Goal is to qualify (do they export? what products? what's their biggest pain?) and book a 20-min walkthrough.
3. **Use the painkiller — not the feature list.** "How many WhatsApp groups are you in with consultants right now?" is a better opener than "We have 4 modules".
4. **The walkthrough is the close.** Pitch deck + live demo. By minute 15 they either get it or they don't.
5. **Always send a WhatsApp recap within 5 minutes of the call.** "Hi {name}, great talking. Here's the walkthrough link: {url}. Talk Wednesday at 11am as discussed."

---

## Demo script (20 minutes)

**0:00 — 2:00 — Setup**
- "Tell me about your current export operations. What do you ship, where, how often?"
- Listen for: number of consultants used, manual processes, complaints.

**2:00 — 5:00 — Painkiller match**
- "Sounds like you spend X hours/week on Y. Right?" — repeat their pain back, in their words.

**5:00 — 15:00 — Live walkthrough**
- HS code calc with their actual product → "watch this, 30 seconds."
- Document generator → fill a fake invoice for their next buyer → PDF in 90 seconds.
- Buyer discovery → search their HS code + target country → show 5 real buyers.
- License wizard if they're first-timers.

**15:00 — 18:00 — Pricing**
- "₹3,000 a month + 1% per shipment we orchestrate. Cap is ₹25k per shipment. Cancel anytime."
- "If you ship 5 containers this month at average ₹15L per container, that's ₹3k base + ₹75k commission. Your old setup was X."
- For first-timers: pivot to ₹15k First Shipment plan.

**18:00 — 20:00 — Close**
- "Want to start the 14-day free trial right now? I'll set it up while we're talking."
- Or: "Let me send you the trial link on WhatsApp. Take 24 hours. I'll check in tomorrow."

---

## Objection handling

| Objection | Response |
|---|---|
| "I already have a CA / CHA" | "Keep them. We don't replace your CA. We replace the Excel files and WhatsApp threads you use to coordinate with them. Your CA will love getting clean documents." |
| "Too expensive" | "₹3,000/month is one rejected shipment. One missed RoDTEP claim. The trial is free for 14 days — try it on your next shipment, then decide." |
| "I don't trust software with my data" | "Fair. We're a registered Pvt. Ltd. with CIN. Data is on our own VPS in Mumbai, not US servers. Privacy doc at /security. You own your data — full export anytime." |
| "Let me think about it" | "Of course. What specifically would help you decide?" — listen, then schedule callback. |
| "I'll talk to my partner / brother" | "Want me to do the walkthrough with both of you next week? Send them this 2-minute Loom." |

---

## Channel routing (per meet-workstyle channels)

- **Slack #work:** New demos booked, new paid signups, daily numbers, weekly report
- **Telegram personal:** Hot lead requiring real-time decision ("buyer wants enterprise pricing")
- **Discord:** Content / blog / social post drops
- **WhatsApp Bot:** Lead WhatsApp followups, demo reminders, post-demo recap with PDF

---

## Inbound (SEO + lead magnets)

**Free tools as wedges:**
- HS code lookup (no signup, 10/day)
- Duty calculator (no signup, 10/day)
- IEC application guide PDF (email-gated)
- "Export to USA in 30 days" mini-course (email-gated, 5-email drip)

**SEO targets (rank top 3 in 6 months):**
- "how to get IEC code"
- "HS code finder India"
- "RCMC application FIEO"
- "AD code registration"
- "DGFT LUT renewal"
- "export documents required India"

Blog cadence: 2 posts/week, deep how-tos written for the actual exporter (not for Google's keyword scoring).

---

## Metrics dashboard (update weekly)

| Metric | Target Wk 4 | Target Wk 12 |
|---|---|---|
| Raw leads in CRM | 2,000 | 10,000 |
| Calls placed | 200 | 1,500 |
| Demos held | 20 | 100 |
| Paid signups | 4 | 30 |
| MRR | ₹12k | ₹90k |
| Commission revenue | ₹0 | ₹50k |

Visualized in Convex dashboard + Slack weekly report.
