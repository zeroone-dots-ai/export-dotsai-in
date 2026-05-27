/**
 * ZeroOne D.O.T.S. AI brand constants.
 * Source of truth — do not hardcode brand values elsewhere.
 */

export const brand = {
  name: "ZeroOne Export",
  parent: "ZeroOne D.O.T.S. AI",
  domain: "export.dotsai.in",
  tagline: "Run your export operations from one dashboard.",
  longTagline:
    "We handle the paperwork — IEC, AD Code, RCMC, invoices, HS codes, buyer discovery. You handle the orders.",

  // Brand colors (hex)
  colors: {
    lavender: "#C8B6FF",
    mint: "#B8E0D2",
    peach: "#FFCDB2",
    sky: "#A2D2FF",
    paper: "#FDFBF7",
    ink: "#1A1A1A",
    muted: "#6B6B6B",
    line: "#E8E4DC",
  },

  // Voice (per ZEROOONE-BRAND.md)
  voice: {
    confident: true,
    plainLanguage: true,
    outcomeDriven: true,
    noBuzzwords: true,
  },

  // Motion timing (per Emil Kowalski principles)
  motion: {
    hover: "150ms",
    transition: "300ms",
    page: "400ms",
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
} as const;

// ZeroOne Export specific positioning
export const positioning = {
  icp: "Existing small Indian exporters (₹50L–₹5Cr/yr) drowning in paperwork.",
  hook: "Replace your CA, CHA, and 7 government portals with one dashboard.",
  pricing: {
    base: 3000,      // ₹/month
    commission: 0.01, // 1% per shipment
  },
} as const;

export const navLinks = [
  { href: "/#modules", label: "Modules" },
  { href: "/pricing", label: "Pricing" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/about", label: "About" },
] as const;

export const modules = [
  {
    slug: "license",
    name: "License Wizard",
    short: "IEC, AD Code, RCMC in 7 days flat.",
    description:
      "Step-by-step wizard with a partner CA on the other end. You upload documents, we file. Status visible at every stage.",
    icon: "FileCheck2",
    color: "lavender",
  },
  {
    slug: "documents",
    name: "Document Generator",
    short: "Commercial Invoice, Packing List, BL, COO — auto-filled, audit-ready.",
    description:
      "Type once, ship anywhere. Templates that pass customs scrutiny the first time, branded with your letterhead.",
    icon: "FileText",
    color: "mint",
  },
  {
    slug: "hs-code",
    name: "HS Code + Duty Calculator",
    short: "AI-suggested HS codes and landed cost math, in seconds.",
    description:
      "Describe the product, get the right 8-digit HS code, plus India + destination duty, freight, and a clean margin calc.",
    icon: "Calculator",
    color: "peach",
  },
  {
    slug: "buyers",
    name: "Buyer Discovery",
    short: "Find real buyers from real shipment data — not a directory.",
    description:
      "Filter by product, country, shipment volume, and recency. We surface companies actually importing what you make.",
    icon: "Search",
    color: "sky",
  },
] as const;

export type Module = (typeof modules)[number];
