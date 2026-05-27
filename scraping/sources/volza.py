"""Volza shipment data scraper (free-tier sampling).

Volza publishes a free preview of India shipment data — top exporters by HS code,
recent shipments by country. The free tier shows ~5-10 records per query before
gating, which is still useful for our purposes: we use it to identify *active*
shippers (vs. directory listings of zombie companies).

For full data we'd need a Volza paid plan (~$200/mo) — out of scope for
this MVP scraper, but the same code path will work once we have an API key.

Strategy:
  1. Generate query URLs for top 50 HS codes our ICP exports (textiles, agri,
     engineering, pharma).
  2. Visit each, scrape the free preview rows.
  3. Each row = (Indian exporter company name, last shipment date, buyer country,
     product value USD). Deduplicate by company name across queries.
"""

from __future__ import annotations

import argparse
import sys
from datetime import datetime
from pathlib import Path
from typing import Iterable

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent.parent / "meet-workstyle" / "Integration" / "scrapling"))

try:
    from scrapling_helper import ScraplingClient  # type: ignore
except ImportError as e:
    raise SystemExit(f"Install scrapling: pip install 'scrapling[fetchers]>=0.4.0' ({e})")

from pipeline.models import RawLead  # noqa: E402

# 2-digit HS chapters that dominate India's export basket
HS_CHAPTERS_TO_QUERY = [
    "09",  # spices, tea, coffee
    "10",  # cereals (basmati)
    "29",  # organic chemicals
    "30",  # pharmaceuticals
    "52",  # cotton
    "61",  # apparel (knitted)
    "62",  # apparel (woven)
    "63",  # other made-up textiles
    "64",  # footwear
    "71",  # gems & jewellery
    "72",  # iron & steel
    "73",  # iron/steel articles
    "84",  # machinery
    "85",  # electrical machinery
    "87",  # vehicles
]


def scrape_hs_chapter(chapter: str) -> Iterable[RawLead]:
    """Free Volza preview for one HS chapter — recent India exports."""
    client = ScraplingClient()
    url = f"https://www.volza.com/p/india/exports/india-export-data-of-hs-code-{chapter}/"

    print(f"📡 Volza · HS {chapter}", file=sys.stderr)

    try:
        page = client.fetch_dynamic(url)  # JS-rendered
    except Exception as e:
        print(f"❌ Failed Volza HS {chapter}: {e}", file=sys.stderr)
        return

    # Volza renders the preview table in <tr class="shipment-row"> (selectors will
    # need to be re-verified after first fetch — kept conservative here)
    rows = page.css("tr.shipment-row, table.shipment-table tr, .preview-row")
    print(f"  found {len(rows)} preview rows", file=sys.stderr)

    for i, row in enumerate(rows):
        try:
            cells = row.css("td")
            if len(cells) < 4:
                continue
            payload = {
                "hs_chapter": chapter,
                "date": cells[0].text.strip() if len(cells) > 0 else None,
                "indian_exporter": cells[1].text.strip() if len(cells) > 1 else None,
                "product_description": cells[2].text.strip() if len(cells) > 2 else None,
                "buyer_country": cells[3].text.strip() if len(cells) > 3 else None,
                "value_usd": cells[4].text.strip() if len(cells) > 4 else None,
            }
            if not payload.get("indian_exporter"):
                continue

            yield RawLead(
                source="volza",
                source_url=url,
                source_record_id=f"volza_hs{chapter}_{i}",
                raw_payload=payload,
                fetched_at=datetime.utcnow(),
            )
        except Exception as e:
            print(f"⚠️  Row {i}: {e}", file=sys.stderr)
            continue


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--chapter", default="all", help="HS chapter (2 digits) or 'all'.")
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    args.output.parent.mkdir(parents=True, exist_ok=True)
    chapters = HS_CHAPTERS_TO_QUERY if args.chapter == "all" else [args.chapter]

    total = 0
    with args.output.open("w", encoding="utf-8") as f:
        for ch in chapters:
            for lead in scrape_hs_chapter(ch):
                f.write(lead.model_dump_json() + "\n")
                total += 1

    print(f"\n✅ Wrote {total} Volza raw leads to {args.output}", file=sys.stderr)


if __name__ == "__main__":
    main()
