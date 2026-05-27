"""IndiaMart exporter category scraper.

Scrapes IndiaMart's category listing pages for sellers tagged as exporters.

Caveats:
- IndiaMart aggressively detects bots; use fetch_stealth (Scrapling handles TLS spoofing)
- Phone numbers are hidden behind "Click to Call" — we capture the verified-merchant
  member ID; phone lookup needs the IndiaMart B2B API (requires registration)
- Free path: get company name + city + state + product + a contact "Send Inquiry" form
- Paid path (~₹5k/mo) = full contact details via Lead Manager API

For now we capture what's free; enrichment step picks up phone via:
  1. IndiaMart Public API (free quota)
  2. Truecaller-style lookup (manual / paid)
  3. Cross-reference with council/Volza records
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

# Top exporter categories by India trade volume
CATEGORIES = [
    # textiles + apparel
    "cotton-fabric-exporters",
    "readymade-garment-exporters",
    "leather-goods-exporters",
    # food + agri
    "spices-exporters",
    "basmati-rice-exporters",
    "tea-exporters",
    "coffee-exporters",
    "fresh-vegetables-exporters",
    # engineering
    "auto-parts-exporters",
    "machine-tools-exporters",
    "hand-tools-exporters",
    # pharma + chemicals
    "pharmaceutical-exporters",
    "chemical-exporters",
    "ayurvedic-medicine-exporters",
    # handicrafts
    "handicrafts-exporters",
    "brass-handicrafts-exporters",
    "marble-handicrafts-exporters",
    # gems & jewellery
    "gems-jewellery-exporters",
    "imitation-jewellery-exporters",
    # other
    "rubber-products-exporters",
    "plastic-products-exporters",
]


def scrape_category(category: str, max_pages: int = 5) -> Iterable[RawLead]:
    """Scrape one category, paginating up to max_pages."""
    client = ScraplingClient()

    for page_n in range(1, max_pages + 1):
        url = f"https://dir.indiamart.com/search.mp?ss={category}&page={page_n}"
        print(f"📡 IndiaMart · {category} · page {page_n}", file=sys.stderr)

        try:
            page = client.fetch_stealth(url)
        except Exception as e:
            print(f"❌ Failed page {page_n}: {e}", file=sys.stderr)
            break

        # IndiaMart uses .cardlinks for each seller card
        cards = page.css(".cardlinks, .lst_sup_div, .companyName")
        if not cards:
            # End of pagination or blocked
            print(f"  no cards found — stopping pagination", file=sys.stderr)
            break

        for i, card in enumerate(cards):
            try:
                company_el = card.css(".companyname, .lst-com-nm, h2 a, .company")
                if not company_el:
                    continue
                company = company_el.text.strip()

                city_el = card.css(".lst-com-loc, .loc, .city")
                city = city_el.text.strip() if city_el else None

                payload = {
                    "company": company,
                    "category": category,
                    "city": city,
                    "page_n": page_n,
                }

                yield RawLead(
                    source="indiamart",
                    source_url=url,
                    source_record_id=f"indiamart_{category}_{page_n}_{i}",
                    raw_payload=payload,
                    fetched_at=datetime.utcnow(),
                )
            except Exception as e:
                print(f"⚠️  Card {i}: {e}", file=sys.stderr)
                continue


def main() -> None:
    parser = argparse.ArgumentParser(description="Scrape IndiaMart exporter listings by category.")
    parser.add_argument(
        "--category",
        default="all",
        help=f"Category slug, or 'all' for {len(CATEGORIES)} default categories.",
    )
    parser.add_argument("--max-pages", type=int, default=5)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    args.output.parent.mkdir(parents=True, exist_ok=True)
    cats = CATEGORIES if args.category == "all" else [args.category]

    total = 0
    with args.output.open("w", encoding="utf-8") as f:
        for cat in cats:
            for lead in scrape_category(cat, args.max_pages):
                f.write(lead.model_dump_json() + "\n")
                total += 1

    print(f"\n✅ Wrote {total} IndiaMart raw leads to {args.output}", file=sys.stderr)


if __name__ == "__main__":
    main()
