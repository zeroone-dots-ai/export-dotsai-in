import Link from "next/link";

const tiers = [
  {
    name: "Free",
    sub: "For your first month — or forever, if you just want the tools.",
    price: "₹0",
    cadence: "/forever",
    features: [
      "HS code + duty calculator (10 lookups/day)",
      "Document templates (2 docs/month)",
      "Buyer discovery preview (3 results/search)",
      "Full EXIM glossary + guides",
    ],
    cta: { label: "Start free", href: "/sign-up" },
    style: "ghost",
  },
  {
    name: "Operator",
    sub: "For exporters shipping every month. The everyday account.",
    price: "₹3,000",
    cadence: "/month",
    plus: "+ 1% per shipment routed through us",
    features: [
      "Unlimited HS code + duty calculations",
      "Unlimited document generation",
      "Buyer discovery — full results",
      "Compliance calendar with WhatsApp pings",
      "Partner CA available for ad-hoc filings",
      "Shipment ledger + AD Code mapping",
    ],
    cta: { label: "Start free for 14 days", href: "/sign-up?plan=operator" },
    style: "primary",
    badge: "Most exporters",
  },
  {
    name: "First shipment",
    sub: "Brand new to exporting? We get you from zero to your first BL.",
    price: "₹15,000",
    cadence: "one-time",
    plus: "+ Operator plan free for 3 months",
    features: [
      "IEC, AD Code, RCMC, GST LUT — all filed by us",
      "ICEGATE registration + first shipping bill",
      "Partner CHA introduction at your nearest port",
      "Buyer outreach templates",
      "1:1 onboarding with our team",
    ],
    cta: { label: "Book a 20-min walkthrough", href: "/demo" },
    style: "ghost",
  },
] as const;

export function Pricing() {
  return (
    <section id="pricing" className="border-b border-line bg-paper">
      <div className="container py-24">
        <div className="max-w-2xl">
          <p className="font-data text-[10px] uppercase tracking-[0.22em] text-muted">
            Honest pricing — no annual contracts, no setup fees
          </p>
          <h2 className="mt-4 text-display-lg">Pay for what you ship.</h2>
          <p className="mt-5 text-lg text-ink/75">
            We make money when your shipments go out. Small monthly base, plus 1% on shipments
            routed through the platform. If you don't ship, you pay almost nothing.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {tiers.map((tier) => (
            <article
              key={tier.name}
              className={`relative flex flex-col rounded-2xl border p-8 ${
                tier.style === "primary"
                  ? "border-ink bg-ink text-paper"
                  : "border-line bg-paper text-ink"
              }`}
            >
              {"badge" in tier && tier.badge && (
                <span className="absolute -top-3 left-8 rounded-full bg-peach-300 px-3 py-1 font-data text-[10px] uppercase tracking-[0.18em] text-ink">
                  {tier.badge}
                </span>
              )}
              <h3 className={`font-serif text-3xl ${tier.style === "primary" ? "" : "text-ink"}`}>
                {tier.name}
              </h3>
              <p className={`mt-2 text-sm ${tier.style === "primary" ? "text-paper/70" : "text-ink/70"}`}>
                {tier.sub}
              </p>

              <div className="mt-8 flex items-baseline gap-2">
                <span className="font-serif text-5xl">{tier.price}</span>
                <span
                  className={`text-sm ${tier.style === "primary" ? "text-paper/70" : "text-muted"}`}
                >
                  {tier.cadence}
                </span>
              </div>
              {"plus" in tier && tier.plus && (
                <p
                  className={`mt-2 font-data text-xs ${
                    tier.style === "primary" ? "text-paper/70" : "text-muted"
                  }`}
                >
                  {tier.plus}
                </p>
              )}

              <ul
                className={`mt-8 space-y-3 text-sm ${
                  tier.style === "primary" ? "text-paper/90" : "text-ink/80"
                }`}
              >
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <span
                      className={`mt-2 h-1 w-1 shrink-0 rounded-full ${
                        tier.style === "primary" ? "bg-paper/70" : "bg-ink/50"
                      }`}
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={tier.cta.href}
                className={`mt-10 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-opacity ${
                  tier.style === "primary"
                    ? "bg-paper text-ink hover:opacity-90"
                    : "border border-ink text-ink hover:bg-secondary"
                }`}
              >
                {tier.cta.label} <span aria-hidden>→</span>
              </Link>
            </article>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-muted">
          All prices in INR. GST extra at 18%. Cancel anytime — no penalty, no contract.
        </p>
      </div>
    </section>
  );
}
