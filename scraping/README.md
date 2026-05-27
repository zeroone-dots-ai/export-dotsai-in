# Lead Scraping Pipeline

Python + Scrapling pipeline for filling the `leads` table in Convex.

## Architecture

```
sources/             — one scraper per data source
  councils.py        — FIEO, EEPC, AEPC, Pharmexcil, Capexil, APEDA, MPEDA, Spices, SHEFEXIL
  indiamart.py       — IndiaMart exporter category listings
  volza.py           — Volza free-tier shipment data
  exportersindia.py  — ExportersIndia directory
  msme.py            — MSME Udyam (export-oriented NIC codes)

pipeline/
  normalize.py       — Standardize records (phone formats, company name dedupe)
  enrich.py          — Find email, founder name, LinkedIn (via Apollo / public sources)
  score.py           — Score lead 0-100 based on signals
  push_to_convex.py  — Push to Convex `leads` table

output/              — CSV exports (gitignored)
cache/               — Raw HTML cache (gitignored)
```

## Setup

```bash
cd scraping
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
scrapling install   # Playwright browsers (for JS-rendered sites)
```

## Usage

```bash
# Scrape one source
python -m sources.councils --council FIEO --output output/fieo_members.csv

# Run the full pipeline (all sources → normalize → enrich → score → push to Convex)
python pipeline/run_all.py --push-to-convex

# Dry run (no Convex push)
python pipeline/run_all.py --dry-run
```

## Convex push

Requires `CONVEX_DEPLOYMENT_URL` and `CONVEX_DEPLOY_KEY` in env. The script calls the `leads:bulkInsert` mutation in batches of 100.

## Deploy (run as cron on VPS)

```bash
# Build Docker image
docker build -t export-lead-scraper .

# Run as cron via VPS scheduler
# (configured via meet-workstyle/cron/ — see export-lead-scraper.md)
```

## Scoring rules

Each lead gets a 0-100 score. Score 70+ goes to "call today", 40-69 to "call this week", below to "nurture":

| Signal | Points |
|---|---|
| Has IEC (confirmed) | +20 |
| Last shipment within 6 months | +20 |
| Listed in 2+ sources (council + directory) | +15 |
| Phone number verified (E.164 format, India) | +10 |
| Email present | +10 |
| Founder/decision-maker name identified | +10 |
| Estimated revenue ₹50L–₹5Cr (sweet spot) | +10 |
| In target city (Ahmedabad/Mumbai/Surat/Delhi/Chennai/Bengaluru) | +5 |

Calls: do high-score leads first. Don't waste airtime on cold lists.
