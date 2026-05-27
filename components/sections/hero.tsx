import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="paper-grain absolute inset-0 opacity-60" aria-hidden />
      <div className="container relative pt-20 pb-24 md:pt-28 md:pb-32">
        {/* Eyebrow */}
        <p className="font-data text-[11px] uppercase tracking-[0.22em] text-muted">
          Built in India · For Indian exporters
        </p>

        {/* Display headline — editorial, Instrument Serif */}
        <h1 className="mt-5 max-w-[18ch] text-display-xl">
          One dashboard for{" "}
          <span className="italic text-ink/90">
            <span className="bg-lavender-200/70 px-1 py-0.5">your</span>
          </span>{" "}
          export operations.
        </h1>

        <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-ink/75">
          Replace your CA, your CHA, and seven government portals with one platform that handles
          licenses, paperwork, HS codes, and buyer discovery. Built for small exporters doing
          ₹50L to ₹5Cr a year.
        </p>

        {/* CTAs */}
        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-opacity hover:opacity-90"
          >
            Start free · ₹0 for 14 days
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-secondary"
          >
            Book a 20-min walkthrough
          </Link>
        </div>

        {/* Sub-CTA proof line */}
        <p className="mt-6 text-sm text-muted">
          <span className="font-data text-ink">₹3,000/mo</span> base · <span className="font-data text-ink">1%</span> per
          shipment routed through the platform. No setup fee. Cancel anytime.
        </p>

        {/* Visual: minimal stat strip — editorial, no AI-slop dashboard mockup */}
        <div className="mt-16 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-line pt-10 md:grid-cols-4">
          <Stat label="Onboarding" value="7 days" sub="IEC · AD Code · RCMC" />
          <Stat label="Documents" value="12 types" sub="auto-filled, audit-ready" />
          <Stat label="HS codes" value="98,000+" sub="India CBIC database" />
          <Stat label="Shipment data" value="40M+" sub="across 220 countries" />
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div>
      <p className="font-data text-[10px] uppercase tracking-[0.22em] text-muted">{label}</p>
      <p className="mt-2 font-serif text-3xl leading-none">{value}</p>
      <p className="mt-1.5 text-sm text-ink/70">{sub}</p>
    </div>
  );
}
