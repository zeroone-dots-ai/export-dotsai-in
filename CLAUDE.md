# export.dotsai.in — App Context

> **App ID:** `a12_export-dotsai-in`
> **Domain:** `export.dotsai.in` (DNS live, points to VPS `72.62.229.16`)
> **Test:** `test.export.dotsai.in`
> **Parent:** ZeroOne D.O.T.S. AI Pvt. Ltd. (CIN registered, software company)
> **Repo:** `github.com/zeroone-dots-ai/import-export`

---

## What this app is

**EXIM-SaaS platform** for Indian small exporters. We are *not* a CHA, not a freight forwarder, not a customs broker. We're a software company that productizes the EXIM workflow and orchestrates partner services (CA, CHA, freight forwarder, banks) underneath.

**The pitch in one line:**
*"Run your export operations from one dashboard — we handle the paperwork, you handle the orders. ₹3k/mo + 1% per shipment."*

---

## Positioning

- **ICP (first 100 customers):** Existing small exporters doing ₹50L–₹5Cr/yr, currently juggling a CA + CHA + freight forwarder + bank manager + 7 government portals. They're shipping but drowning.
- **ICP (phase 2):** First-time exporters — wedge via the License Wizard.
- **Pricing:** ₹3,000/mo base + 1% per shipment routed through us. First-shipment plan: ₹15,000 one-time + 3 months Operator free.
- **What we DO:** Software (dashboard, workflows, AI for HS/docs), buyer-data scraping, partner orchestration, lead-gen for partners.
- **What we DON'T DO (yet):** Hold customs license, run our own freight, give trade finance directly.

---

## Modules (MVP)

| # | Module | Slug | Status |
|---|---|---|---|
| 1 | License & Registration Wizard | `/dashboard/license` | TODO |
| 2 | Document Generator | `/dashboard/documents` | TODO |
| 3 | HS Code + Duty Calculator | `/dashboard/hs-code` | TODO |
| 4 | Buyer Discovery | `/dashboard/buyers` | TODO |

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 + React 19 (App Router, Server Components, Turbopack dev) |
| UI | shadcn/ui + Tailwind CSS 3.4 + Motion (Emil Kowalski style) |
| Backend | Convex (real-time, type-safe) |
| Auth | Clerk |
| Payments | Razorpay (India) |
| AI | Anthropic Claude Sonnet 4.6 (HS code suggestion, doc drafting, buyer matching) |
| Scraping | Scrapling (Python service, runs in Docker on VPS) |
| Analytics mirror | PostgreSQL on VPS, fed by Convex cron every 5 min |
| Object storage | MyCloud (MinIO, S3-compatible) at `cloud.zeroonedotsai.consulting` |
| Deploy | ZeroOne Auto-Deploy System (`deploy.dotsai.cloud`) — `git push` → live |

---

## Branding (per ZEROOONE-BRAND.md)

- **Colors:** Lavender `#C8B6FF`, Mint `#B8E0D2`, Peach `#FFCDB2`, Sky `#A2D2FF`, Paper `#FDFBF7`, Ink `#1A1A1A`
- **Fonts:** Instrument Serif (headlines), DM Sans (body), Space Mono (data/labels)
- **Voice:** Confident, plain language, outcome-driven, no buzzwords
- **Motion:** 150ms hover, 300-400ms transitions, `cubic-bezier(0.22, 1, 0.36, 1)`
- **No AI slop:** no gradient-glow buttons, no glassmorphism, no "innovative solutions". Editorial. Hairline borders. Soft cream paper.

---

## Branching (per meet-workstyle CLAUDE.md)

| Branch | Environment | Domain |
|---|---|---|
| `master` | Testing | `test.export.dotsai.in` |
| `main` | Production | `export.dotsai.in` |

Flow: feature branch → PR → `master` (verify on test) → PR → `main` (auto-deploys).

---

## Deploy

1. **Register (one-time):**
   ```bash
   node ~/Desktop/meet-workstyle/scripts/meet-deploy.js register import-export \
     --domain export.dotsai.in \
     --test-domain test.export.dotsai.in \
     --type nextjs
   ```
2. **Push env secrets:**
   ```bash
   node ~/Desktop/meet-workstyle/scripts/meet-deploy.js secrets push import-export --file .env.local
   ```
3. **Daily deploy:**
   ```bash
   node ~/Desktop/meet-workstyle/scripts/meet-deploy.js ship          # → master (test)
   node ~/Desktop/meet-workstyle/scripts/meet-deploy.js ship main     # → main (production)
   ```

---

## Folder Map

```
export.dotsai.in/
├── app/
│   ├── (marketing)/        — public site routes
│   ├── (app)/dashboard/    — auth-gated platform (4 modules)
│   ├── api/                — webhooks (Razorpay, Clerk, Convex)
│   ├── layout.tsx          — root (fonts, metadata)
│   ├── page.tsx            — landing
│   └── globals.css         — Tailwind + brand tokens
├── components/
│   ├── sections/           — landing page sections
│   ├── ui/                 — shadcn/ui primitives
│   ├── site-header.tsx
│   └── site-footer.tsx
├── lib/
│   ├── brand.ts            — single source for brand strings + module list
│   └── utils.ts            — cn, formatINR, slug
├── convex/                 — backend functions + schema
├── scraping/               — Python + Scrapling lead pipeline (not deployed with Next.js)
│   ├── dgft/
│   ├── indiamart/
│   ├── volza/
│   └── councils/
├── gtm/                    — sales materials (pitch deck, scripts, sequences)
│   ├── RESEARCH.md         — competitive + market research
│   ├── PLAYBOOK.md         — GTM playbook
│   ├── cold-call-script.md
│   ├── whatsapp-sequences.md
│   └── email-sequences.md
└── content/                — MDX (blog, glossary, guides)
```

---

## Sales / GTM (lead motion)

- **Outbound:** Cold-call + WhatsApp existing exporters scraped from Volza, IndiaMart, council member lists, DGFT exporter DB. Script in `gtm/cold-call-script.md`.
- **Inbound:** Free HS code calculator + free duty calculator + glossary → SEO. Lead magnet: "How to get IEC in 7 days" PDF.
- **Partner motion:** Get 5 CAs in Gujarat/Mumbai/Delhi as filing partners. They get filing fees, we get the platform stickiness.

---

## Compliance

- All document templates audit-ready against DGFT + ICEGATE + RBI FEMA requirements
- Pricing transparent — show 1% commission cap of ₹25k per shipment up-front
- Privacy: no selling of buyer lists, no data shared with third parties beyond what the user explicitly requests (e.g., shipping the doc to CHA)
- Terms: cancellation anytime, no penalty
- Refunds: documented in `/refund`

---

## Memory & Learnings

See `MEMORY.md` for things we've learned about Indian exporters, customs, council quirks. Update after every customer call.
