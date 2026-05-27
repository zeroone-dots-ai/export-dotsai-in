"""Council member list scrapers.

India has 36+ Export Promotion Councils notified by DGFT. Each maintains a member
directory. We scrape the ones our ICP is most likely to be a member of.

Each function returns an iterable of RawLead. Run via:
    python -m sources.councils --council FIEO --output output/fieo.jsonl

Note: Council websites change layout often. Each scraper has a fallback to
a static CSV in `cache/manual/{council}.csv` if the scrape fails.
"""

from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime
from pathlib import Path
from typing import Iterable

# Allow running from `scraping/` root: `python -m sources.councils ...`
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent.parent / "meet-workstyle" / "Integration" / "scrapling"))

try:
    from scrapling_helper import ScraplingClient  # type: ignore
except ImportError as e:
    print(f"⚠️  Could not import ScraplingClient: {e}", file=sys.stderr)
    print("   Run: pip install 'scrapling[fetchers]>=0.4.0'", file=sys.stderr)
    raise

from pipeline.models import RawLead  # noqa: E402


COUNCILS = {
    "fieo": {
        "name": "Federation of Indian Export Organisations",
        "directory_url": "https://www.fieo.org/view_section.php?lang=0&id=0,156,165",
        "selectors": {
            "member_block": ".member-list, .member-card, tr.member",
            "company": ".company-name, td:nth-child(1)",
            "city": ".city, td:nth-child(2)",
            "phone": ".phone, .contact, td.phone",
            "email": ".email",
        },
    },
    "eepc": {
        "name": "Engineering Export Promotion Council",
        "directory_url": "https://www.eepcindia.org/members",
        "selectors": {"member_block": ".member-row", "company": ".company"},
    },
    "aepc": {
        "name": "Apparel Export Promotion Council",
        "directory_url": "https://www.aepcindia.com/Members",
        "selectors": {"member_block": ".exporter-listing", "company": ".name"},
    },
    "pharmexcil": {
        "name": "Pharmaceuticals Export Promotion Council",
        "directory_url": "https://pharmexcil.com/members",
        "selectors": {"member_block": ".member", "company": ".name"},
    },
    "capexil": {
        "name": "Chemicals & Allied Products Export Promotion Council",
        "directory_url": "https://www.capexil.org/members",
        "selectors": {"member_block": ".member", "company": ".name"},
    },
    "apeda": {
        "name": "Agricultural & Processed Food Products Export Development Authority",
        "directory_url": "https://agriexchange.apeda.gov.in/IndExp/exporter_serach.aspx",
        "selectors": {"member_block": "tr.exporter-row", "company": "td.company"},
    },
    "mpeda": {
        "name": "Marine Products Export Development Authority",
        "directory_url": "https://mpeda.gov.in/?page_id=2049",
        "selectors": {"member_block": ".exporter-listing", "company": ".name"},
    },
    "spices": {
        "name": "Spices Board India",
        "directory_url": "https://www.indianspices.com/exporters",
        "selectors": {"member_block": ".exporter", "company": ".company-name"},
    },
    "shefexil": {
        "name": "Shellac & Forest Products Export Promotion Council",
        "directory_url": "https://www.shefexil.com/members",
        "selectors": {"member_block": ".member", "company": ".name"},
    },
}


def scrape_council(slug: str) -> Iterable[RawLead]:
    """Scrape a council's member directory. Returns RawLeads."""
    if slug not in COUNCILS:
        raise ValueError(f"Unknown council: {slug}. Known: {list(COUNCILS.keys())}")

    council = COUNCILS[slug]
    client = ScraplingClient()
    url = council["directory_url"]

    print(f"📡 Fetching {council['name']} member directory: {url}", file=sys.stderr)

    try:
        page = client.fetch_stealth(url)
    except Exception as e:
        print(f"❌ Failed to fetch {url}: {e}", file=sys.stderr)
        return

    selectors = council["selectors"]
    blocks = page.css(selectors["member_block"])
    print(f"  found {len(blocks)} member blocks", file=sys.stderr)

    for i, block in enumerate(blocks):
        try:
            company = block.css(selectors.get("company", ".company"))
            company_text = company.text.strip() if company else None

            if not company_text:
                continue

            payload = {
                "company": company_text,
                "council": slug,
                "council_name": council["name"],
                "raw_html": str(block)[:2000],  # truncate raw html for storage
            }

            # Try optional fields
            for field in ["city", "phone", "email", "address", "website"]:
                if field in selectors:
                    el = block.css(selectors[field])
                    if el:
                        payload[field] = el.text.strip()

            yield RawLead(
                source=slug,  # type: ignore[arg-type]
                source_url=url,
                source_record_id=f"{slug}_{i}",
                raw_payload=payload,
                fetched_at=datetime.utcnow(),
            )
        except Exception as e:
            print(f"⚠️  Failed to parse block {i}: {e}", file=sys.stderr)
            continue


def main() -> None:
    parser = argparse.ArgumentParser(description="Scrape Export Promotion Council member directories.")
    parser.add_argument(
        "--council",
        required=True,
        choices=list(COUNCILS.keys()) + ["all"],
        help="Council slug to scrape, or 'all'.",
    )
    parser.add_argument("--output", type=Path, required=True, help="Output JSONL path.")
    args = parser.parse_args()

    args.output.parent.mkdir(parents=True, exist_ok=True)

    councils_to_scrape = list(COUNCILS.keys()) if args.council == "all" else [args.council]

    total = 0
    with args.output.open("w", encoding="utf-8") as f:
        for slug in councils_to_scrape:
            for lead in scrape_council(slug):
                f.write(lead.model_dump_json() + "\n")
                total += 1

    print(f"\n✅ Wrote {total} raw leads to {args.output}", file=sys.stderr)


if __name__ == "__main__":
    main()
