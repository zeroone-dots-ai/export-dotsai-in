# export.dotsai.in

**The dashboard for Indian exporters.** Run your export operations — IEC, AD Code, RCMC, documents, HS codes, buyer discovery — from one platform.

> Built by [ZeroOne D.O.T.S. AI](https://dotsai.in) — Pvt. Ltd., registered in India.

---

## Quick start

```bash
# 1. Install deps
npm install

# 2. Set env
cp .env.example .env.local
# Fill in Convex, Clerk, Razorpay, Anthropic keys

# 3. Start Convex backend (in one terminal)
npx convex dev

# 4. Start Next.js (in another)
npm run dev
# → http://localhost:3000
```

## Stack

- **Frontend:** Next.js 15 + React 19 + Tailwind 3.4 + shadcn/ui + Motion
- **Backend:** Convex (real-time, type-safe) + PostgreSQL mirror on VPS for analytics
- **Auth:** Clerk
- **Payments:** Razorpay (India)
- **AI:** Claude Sonnet 4.6 (HS code suggestion, document drafting, buyer matching)
- **Scraping:** Scrapling (Python — `scraping/` folder, runs in Docker on VPS)
- **Deploy:** ZeroOne Auto-Deploy System (`git push` → `deploy.dotsai.cloud` → live)

## Branches

| Branch | Env | Domain |
|---|---|---|
| `master` | Test | test.export.dotsai.in |
| `main` | Production | export.dotsai.in |

All work goes to `master` first. Merge to `main` only after testing on test subdomain.

## Folder structure

See `CLAUDE.md` for the full map.

## Contributing

This is private to ZeroOne. Collaborators: `@zeroone-dots-ai`, `@SHARMAJAYESH`.

Open a PR to `master`. Never push directly to `main`.

## License

Proprietary — ZeroOne D.O.T.S. AI Pvt. Ltd. All rights reserved.
