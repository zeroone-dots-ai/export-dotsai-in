"""End-to-end pipeline runner.

Steps:
  1. Run each source scraper, write RawLeads to output/{source}.jsonl
  2. Normalize raw records into Lead objects (phone formatting, dedupe)
  3. Enrich (lookup missing email/founder via public sources) — TODO
  4. Score each Lead
  5. Push to Convex `leads` table (unless --dry-run)

Usage:
  python pipeline/run_all.py --dry-run            # local only
  python pipeline/run_all.py --push-to-convex     # push to Convex
  python pipeline/run_all.py --sources fieo,volza # subset
"""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
from pathlib import Path

OUTPUT_DIR = Path(__file__).resolve().parent.parent / "output"

DEFAULT_SOURCES = ["fieo", "eepc", "aepc", "pharmexcil", "capexil", "apeda", "indiamart", "volza"]


def run_source(source: str) -> Path:
    """Invoke a source scraper, return output path."""
    out = OUTPUT_DIR / f"{source}_raw.jsonl"

    if source in {"fieo", "eepc", "aepc", "pharmexcil", "capexil", "apeda", "mpeda", "spices", "shefexil"}:
        cmd = [sys.executable, "-m", "sources.councils", "--council", source, "--output", str(out)]
    elif source == "indiamart":
        cmd = [sys.executable, "-m", "sources.indiamart", "--category", "all", "--max-pages", "3", "--output", str(out)]
    elif source == "volza":
        cmd = [sys.executable, "-m", "sources.volza", "--chapter", "all", "--output", str(out)]
    else:
        print(f"⚠️  Unknown source: {source}", file=sys.stderr)
        return out

    print(f"\n▶ Running source: {source}", file=sys.stderr)
    subprocess.run(cmd, cwd=str(Path(__file__).resolve().parent.parent), check=False)
    return out


def normalize_records(raw_files: list[Path]) -> list[dict]:
    """Load all raw records, dedupe by company_name (case-insensitive)."""
    from .models import Lead, RawLead

    seen: dict[str, dict] = {}
    for path in raw_files:
        if not path.exists():
            continue
        with path.open(encoding="utf-8") as f:
            for line in f:
                try:
                    raw = RawLead.model_validate_json(line)
                except Exception:
                    continue

                company = raw.raw_payload.get("company") or raw.raw_payload.get("indian_exporter")
                if not company:
                    continue
                key = company.strip().lower()

                if key in seen:
                    seen[key]["sources"].append(raw.source)
                    continue

                # Best-effort field extraction; phone often missing at this stage
                phone = raw.raw_payload.get("phone") or "+918000000000"  # placeholder
                seen[key] = {
                    "company_name": company.strip(),
                    "phone": phone,
                    "email": raw.raw_payload.get("email"),
                    "city": raw.raw_payload.get("city"),
                    "products": [raw.raw_payload.get("category") or raw.raw_payload.get("product_description")],
                    "sources": [raw.source],
                    "score": 0,
                }
    return list(seen.values())


def score_all(records: list[dict]) -> list[dict]:
    from .models import Lead
    from .score import score_lead

    scored = []
    for r in records:
        try:
            lead = Lead.model_validate(r)
            lead.score = score_lead(lead)
            scored.append(lead.model_dump())
        except Exception as e:
            print(f"⚠️  Failed to validate lead {r.get('company_name')}: {e}", file=sys.stderr)
    return sorted(scored, key=lambda x: -x["score"])


def push_to_convex(records: list[dict]) -> None:
    """Push leads to Convex via the bulk mutation."""
    deploy_url = os.environ.get("CONVEX_DEPLOYMENT_URL")
    deploy_key = os.environ.get("CONVEX_DEPLOY_KEY")
    if not deploy_url or not deploy_key:
        print("❌ Set CONVEX_DEPLOYMENT_URL and CONVEX_DEPLOY_KEY env vars", file=sys.stderr)
        return

    import httpx

    BATCH = 100
    for i in range(0, len(records), BATCH):
        batch = records[i : i + BATCH]
        try:
            r = httpx.post(
                f"{deploy_url}/api/mutation",
                json={"path": "leads:bulkInsert", "args": {"leads": batch}},
                headers={"Authorization": f"Bearer {deploy_key}"},
                timeout=30.0,
            )
            r.raise_for_status()
            print(f"  ↑ pushed {len(batch)} leads (batch {i // BATCH + 1})", file=sys.stderr)
        except Exception as e:
            print(f"❌ Push failed at batch {i // BATCH + 1}: {e}", file=sys.stderr)
            return


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--sources",
        default=",".join(DEFAULT_SOURCES),
        help="Comma-separated source slugs to run.",
    )
    parser.add_argument("--dry-run", action="store_true", help="Don't push to Convex.")
    parser.add_argument("--push-to-convex", action="store_true")
    args = parser.parse_args()

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    sources = [s.strip() for s in args.sources.split(",") if s.strip()]
    raw_files = [run_source(s) for s in sources]

    print(f"\n📦 Normalizing across {len(raw_files)} source files...", file=sys.stderr)
    records = normalize_records(raw_files)
    print(f"  → {len(records)} unique records (after dedupe)", file=sys.stderr)

    print(f"\n🎯 Scoring...", file=sys.stderr)
    scored = score_all(records)
    high = sum(1 for s in scored if s["score"] >= 70)
    med = sum(1 for s in scored if 40 <= s["score"] < 70)
    low = sum(1 for s in scored if s["score"] < 40)
    print(f"  → {high} high (70+) · {med} medium (40-69) · {low} low (<40)", file=sys.stderr)

    out = OUTPUT_DIR / "leads_scored.jsonl"
    with out.open("w", encoding="utf-8") as f:
        for r in scored:
            f.write(json.dumps(r, default=str) + "\n")
    print(f"\n💾 Wrote {len(scored)} scored leads to {out}", file=sys.stderr)

    if args.push_to_convex and not args.dry_run:
        print(f"\n🚀 Pushing to Convex...", file=sys.stderr)
        push_to_convex(scored)
    elif args.dry_run:
        print(f"\n[dry run — not pushing to Convex]", file=sys.stderr)
    else:
        print(f"\n→ run with --push-to-convex to upload", file=sys.stderr)


if __name__ == "__main__":
    main()
