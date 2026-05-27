"""Pydantic models for lead pipeline records."""

from __future__ import annotations

from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field, field_validator

LeadSource = Literal[
    "fieo",
    "eepc",
    "aepc",
    "pharmexcil",
    "capexil",
    "apeda",
    "mpeda",
    "spices_board",
    "shefexil",
    "indiamart",
    "exportersindia",
    "volza",
    "msme_udyam",
    "manual",
    "inbound",
]

LeadStatus = Literal[
    "new",
    "attempted",
    "connected",
    "demo_scheduled",
    "demo_done",
    "won",
    "lost",
    "nurture",
]


class RawLead(BaseModel):
    """A lead as extracted from a source, before normalization."""

    source: LeadSource
    source_url: str
    source_record_id: Optional[str] = None
    raw_payload: dict
    fetched_at: datetime = Field(default_factory=datetime.utcnow)


class Lead(BaseModel):
    """A normalized lead ready for scoring + push to Convex."""

    company_name: str
    founder_name: Optional[str] = None
    phone: str  # E.164 — e.g. +918320065658
    email: Optional[EmailStr] = None
    city: Optional[str] = None
    state: Optional[str] = None
    products: list[str] = Field(default_factory=list)
    hs_codes: list[str] = Field(default_factory=list)
    estimated_revenue_inr: Optional[int] = None
    has_iec: Optional[bool] = None
    iec_number: Optional[str] = None
    website: Optional[str] = None
    sources: list[LeadSource] = Field(default_factory=list)
    last_shipment_date: Optional[datetime] = None
    score: int = 0  # 0..100, populated by scorer
    notes: Optional[str] = None

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        import phonenumbers

        try:
            parsed = phonenumbers.parse(v, "IN")
            if not phonenumbers.is_valid_number(parsed):
                raise ValueError(f"Invalid phone number: {v}")
            return phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.E164)
        except phonenumbers.NumberParseException as e:
            raise ValueError(f"Could not parse phone: {v} ({e})") from e
