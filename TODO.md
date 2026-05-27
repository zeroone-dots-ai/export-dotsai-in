# export.dotsai.in — TODO

Tracking against the master plan. Tasks coordinate with `meet-workstyle/sessions/TASKS.md`.

## In Progress (this session)

- [x] Repo scaffold — Next.js 15 + Tailwind + brand kit
- [x] Landing page sections: Hero, TrustBar, Painkiller, ModulesGrid, HowItWorks, Pricing, FAQ, FinalCta
- [ ] Convex schema + initial functions (running in parallel)
- [ ] Auto-deploy registration with `deploy.dotsai.cloud`
- [ ] Scrapling research → `gtm/RESEARCH.md` (delegated to subagent)

## Next up

### Foundation
- [ ] `npm install` + verify `npm run build` passes
- [ ] Setup Clerk auth (`/sign-in`, `/sign-up` routes + middleware)
- [ ] Setup Convex (`npx convex dev`, schema for users/companies/shipments/leads)
- [ ] Setup Razorpay (test mode first)
- [ ] Wire VPS PostgreSQL mirror (sync token, APP_ID)

### Modules (auth-gated `/dashboard`)
- [ ] **License Wizard:** state machine (IEC → AD Code → RCMC → LUT → ICEGATE), partner CA hand-off, status tracker
- [ ] **Document Generator:** Commercial Invoice, Packing List, BL Instruction, COO, CHA instruction; PDF render via react-pdf; user branding (letterhead)
- [ ] **HS Code + Duty Calculator:** CBIC HS code DB ingest, AI suggestion via Claude API, destination duty table (start with US, UAE, UK, Germany, Singapore — top 5 corridors)
- [ ] **Buyer Discovery:** scrape Volza public data + IndiaMart, filter UI (HS code, country, recency, shipment count)

### GTM
- [ ] Lead pipeline (Scrapling jobs → Convex `leads` table → CRM-lite UI for our team)
- [ ] Pitch deck PPTX (use anthropic-skills:pptx)
- [ ] Cold call script (1 page, scenario branches)
- [ ] WhatsApp outreach sequences (intro, follow-up, demo booking)
- [ ] Email sequences (5-touch nurture)
- [ ] GTM playbook (daily cadence, weekly targets, funnel math)

### Polish & Ship
- [ ] Loom demo recording
- [ ] First 500 qualified leads loaded
- [ ] Notification wires (Slack work channel, Telegram personal for hot leads)
- [ ] Compliance pages (privacy, terms, refund, security)
- [ ] SEO: sitemap, robots, structured data (Organization, Product, FAQPage)
- [ ] OG image (1200x630)

---

## Decisions log

- **2026-05-27:** Hybrid pricing locked at ₹3k/mo + 1% commission (cap ₹25k/shipment). Free tier for HS calculator + 2 docs/mo.
- **2026-05-27:** ICP locked — existing small exporters first, first-timers second (via License Wizard wedge).
- **2026-05-27:** All 4 modules in MVP (Boil the Lake), ship License + Documents + HS Calc in v1, Buyer Discovery in v1.1.
- **2026-05-27:** No own customs license. Partner network from day 1.

---

## Risks tracked

- **Partner network gap:** Need ≥3 partner CAs in place before launching License Wizard. Without this, first user complaint becomes a refund.
- **Trust on day 1:** Brand new platform. Mitigations: ZeroOne Pvt. Ltd. CIN visible, founder bios on /about, free tools as proof of competence, money-back guarantee on First-Shipment plan.
- **Cogoport / Drip risk:** Well-funded incumbents. We don't compete on freight or trade finance — we compete on workflow + small-business UX.
- **Govt portal scraping fragility:** DGFT exporter DB scraping may be brittle. Mitigations: multiple lead sources, paid Volza if free hits limits.
