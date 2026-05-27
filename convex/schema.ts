import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * export.dotsai.in — Convex schema
 *
 * Tables mirror to VPS PostgreSQL via the streaming pipeline.
 * Schema there: `meet_apps.a12_export_{table}`.
 */
export default defineSchema({
  // Application users (linked to Clerk)
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    role: v.union(v.literal("owner"), v.literal("staff"), v.literal("admin")),
    companyId: v.optional(v.id("companies")),
    onboardedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_clerk", ["clerkId"])
    .index("by_email", ["email"])
    .index("by_company", ["companyId"]),

  // Customer companies
  companies: defineTable({
    name: v.string(),
    legalName: v.optional(v.string()),
    cin: v.optional(v.string()),
    gstin: v.optional(v.string()),
    pan: v.optional(v.string()),
    iec: v.optional(v.string()),
    adCode: v.optional(v.string()),
    rcmcCouncil: v.optional(v.string()),
    rcmcNumber: v.optional(v.string()),
    lutNumber: v.optional(v.string()),
    icegateRegistered: v.boolean(),
    addressLine1: v.optional(v.string()),
    addressLine2: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    pincode: v.optional(v.string()),
    primaryProductHsCode: v.optional(v.string()),
    annualRevenueINR: v.optional(v.number()),
    plan: v.union(v.literal("free"), v.literal("operator"), v.literal("first_shipment")),
    createdAt: v.number(),
  })
    .index("by_iec", ["iec"])
    .index("by_gstin", ["gstin"]),

  // License/registration wizard state
  licenseWorkflows: defineTable({
    companyId: v.id("companies"),
    type: v.union(
      v.literal("iec"),
      v.literal("ad_code"),
      v.literal("rcmc"),
      v.literal("lut"),
      v.literal("icegate"),
    ),
    status: v.union(
      v.literal("pending_documents"),
      v.literal("documents_received"),
      v.literal("filed"),
      v.literal("in_progress"),
      v.literal("issued"),
      v.literal("rejected"),
    ),
    assignedPartnerId: v.optional(v.id("partners")),
    documents: v.array(v.string()), // MyCloud URIs
    notes: v.optional(v.string()),
    filedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_company", ["companyId"])
    .index("by_partner", ["assignedPartnerId"])
    .index("by_status", ["status"]),

  // Generated documents (CI, PL, BL, COO, etc.)
  documents: defineTable({
    companyId: v.id("companies"),
    type: v.union(
      v.literal("commercial_invoice"),
      v.literal("packing_list"),
      v.literal("bl_instruction"),
      v.literal("certificate_of_origin"),
      v.literal("cha_instruction"),
      v.literal("proforma_invoice"),
      v.literal("export_declaration"),
    ),
    shipmentId: v.optional(v.id("shipments")),
    payload: v.any(), // structured form data
    pdfUrl: v.optional(v.string()), // MyCloud URI
    buyerName: v.string(),
    buyerCountry: v.string(),
    invoiceNumber: v.string(),
    valueINR: v.number(),
    valueUSD: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_company", ["companyId"])
    .index("by_shipment", ["shipmentId"])
    .index("by_invoice", ["invoiceNumber"]),

  // Shipments (the unit of commission)
  shipments: defineTable({
    companyId: v.id("companies"),
    buyerName: v.string(),
    buyerCountry: v.string(),
    portOfLoading: v.string(),
    portOfDischarge: v.string(),
    hsCode: v.string(),
    productDescription: v.string(),
    incoterm: v.string(),
    valueINR: v.number(),
    valueUSD: v.optional(v.number()),
    commissionINR: v.number(), // 1% capped at 25k
    commissionStatus: v.union(
      v.literal("pending"),
      v.literal("invoiced"),
      v.literal("paid"),
      v.literal("waived"),
    ),
    chaPartnerId: v.optional(v.id("partners")),
    freightPartnerId: v.optional(v.id("partners")),
    status: v.union(
      v.literal("draft"),
      v.literal("documents_generated"),
      v.literal("with_cha"),
      v.literal("shipped"),
      v.literal("delivered"),
    ),
    shippedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_company", ["companyId"])
    .index("by_status", ["status"]),

  // Partner network (CA, CHA, freight, bank RM)
  partners: defineTable({
    name: v.string(),
    type: v.union(
      v.literal("ca"),
      v.literal("cha"),
      v.literal("freight_forwarder"),
      v.literal("bank_rm"),
      v.literal("council_facilitator"),
    ),
    contactName: v.string(),
    contactPhone: v.string(),
    contactEmail: v.optional(v.string()),
    cities: v.array(v.string()),
    services: v.array(v.string()), // e.g. ["iec_filing", "ad_code", "rcmc_fieo"]
    feeStructure: v.optional(v.string()), // free-form notes
    revenueShare: v.optional(v.number()), // % platform keeps
    rating: v.optional(v.number()),
    active: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_type", ["type"])
    .index("by_active", ["active"]),

  // HS code database (CBIC — ingested from CSV)
  hsCodes: defineTable({
    code: v.string(),        // 8-digit
    description: v.string(),
    chapter: v.string(),     // 2-digit
    heading: v.string(),     // 4-digit
    subheading: v.string(),  // 6-digit
    indiaImportDuty: v.optional(v.number()),
    indiaExportDuty: v.optional(v.number()),
    keywords: v.array(v.string()),
  })
    .index("by_code", ["code"])
    .index("by_chapter", ["chapter"])
    .searchIndex("search_keywords", { searchField: "description" }),

  // Destination country duties (lookup table — top 20 corridors)
  countryDuties: defineTable({
    country: v.string(),     // ISO 3
    hsCode: v.string(),
    duty: v.number(),
    notes: v.optional(v.string()),
    source: v.string(),      // e.g. "WCO 2026"
    updatedAt: v.number(),
  })
    .index("by_country_hs", ["country", "hsCode"]),

  // Buyer discovery data (from Volza/IndiaMart/scraping)
  buyerCompanies: defineTable({
    name: v.string(),
    country: v.string(),
    address: v.optional(v.string()),
    contactName: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
    website: v.optional(v.string()),
    productsImported: v.array(v.string()), // HS codes
    lastShipmentDate: v.optional(v.number()),
    totalShipments12mo: v.optional(v.number()),
    estimatedAnnualImportUSD: v.optional(v.number()),
    sourceCountries: v.array(v.string()),
    dataSource: v.string(), // "volza" | "indiamart" | "manual" | ...
    confidence: v.number(), // 0..1
    createdAt: v.number(),
  })
    .index("by_country", ["country"])
    .searchIndex("search", { searchField: "name", filterFields: ["country"] }),

  // Inbound leads (our own CRM-lite — for the ZeroOne sales team)
  leads: defineTable({
    companyName: v.string(),
    founderName: v.optional(v.string()),
    phone: v.string(),
    email: v.optional(v.string()),
    city: v.optional(v.string()),
    products: v.array(v.string()),
    estimatedRevenueINR: v.optional(v.number()),
    hasIEC: v.optional(v.boolean()),
    source: v.string(), // "dgft" | "indiamart" | "volza" | "council" | "inbound" | ...
    score: v.number(),  // 0..100 — outreach priority
    status: v.union(
      v.literal("new"),
      v.literal("attempted"),
      v.literal("connected"),
      v.literal("demo_scheduled"),
      v.literal("demo_done"),
      v.literal("won"),
      v.literal("lost"),
      v.literal("nurture"),
    ),
    assignedTo: v.optional(v.string()), // ZeroOne sales rep email
    lastContactAt: v.optional(v.number()),
    nextActionAt: v.optional(v.number()),
    notes: v.optional(v.string()),
    convertedToCompanyId: v.optional(v.id("companies")),
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_assigned", ["assignedTo"])
    .index("by_score", ["score"])
    .index("by_next_action", ["nextActionAt"])
    .searchIndex("search", { searchField: "companyName" }),

  // CRM activity log (calls, WhatsApp, emails)
  leadActivities: defineTable({
    leadId: v.id("leads"),
    actor: v.string(),
    type: v.union(
      v.literal("call_attempted"),
      v.literal("call_connected"),
      v.literal("whatsapp_sent"),
      v.literal("email_sent"),
      v.literal("demo_held"),
      v.literal("note"),
      v.literal("status_change"),
    ),
    body: v.optional(v.string()),
    outcome: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_lead", ["leadId"])
    .index("by_actor", ["actor"]),
});
