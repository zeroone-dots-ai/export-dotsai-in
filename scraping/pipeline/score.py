"""Scoring rules for outbound prioritization.

Score 70+ → call today
Score 40-69 → call this week
Score < 40 → nurture / deprioritize
"""

from __future__ import annotations

from datetime import datetime, timedelta

from .models import Lead

TARGET_CITIES = {
    "ahmedabad",
    "mumbai",
    "surat",
    "delhi",
    "new delhi",
    "chennai",
    "bengaluru",
    "bangalore",
    "vadodara",
    "rajkot",
    "pune",
    "hyderabad",
    "kolkata",
    "noida",
    "gurugram",
}

REVENUE_SWEET_SPOT_MIN = 5_000_000     # ₹50L
REVENUE_SWEET_SPOT_MAX = 50_000_000    # ₹5Cr


def score_lead(lead: Lead) -> int:
    """Return integer score 0..100."""
    score = 0

    # Has IEC = confirmed exporter
    if lead.has_iec is True:
        score += 20

    # Recent shipment activity (within 6 months)
    if lead.last_shipment_date and lead.last_shipment_date > datetime.utcnow() - timedelta(days=180):
        score += 20

    # Cross-source confirmation (multi-source = more confidence)
    if len(lead.sources) >= 2:
        score += 15

    # Phone validated (model already enforces E.164)
    if lead.phone:
        score += 10

    # Email present
    if lead.email:
        score += 10

    # Decision-maker identified
    if lead.founder_name:
        score += 10

    # Revenue in our sweet spot
    if (
        lead.estimated_revenue_inr
        and REVENUE_SWEET_SPOT_MIN <= lead.estimated_revenue_inr <= REVENUE_SWEET_SPOT_MAX
    ):
        score += 10

    # In target city for outbound (we have partner CAs there)
    if lead.city and lead.city.strip().lower() in TARGET_CITIES:
        score += 5

    return min(100, score)
