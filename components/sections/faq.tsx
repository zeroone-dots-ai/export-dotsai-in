const faqs = [
  {
    q: "Are you a customs broker or freight forwarder?",
    a: "No. We're a software company (ZeroOne D.O.T.S. AI Pvt. Ltd., registered in India). We build the dashboard. For licensed work — customs clearance, freight booking, license filing — we work with partner CHAs, CAs, and forwarders. You see them on every quote so you know who's doing what.",
  },
  {
    q: "I already have an IEC and a CHA I trust. Why switch?",
    a: "You don't have to switch your CHA. The platform handles documents, HS codes, buyer discovery, and compliance — the parts you currently do yourself in Excel and WhatsApp. Your CHA keeps doing customs clearance and gets cleaner instructions from us.",
  },
  {
    q: "How is the 1% per shipment calculated?",
    a: "1% of the invoice value, capped at ₹25,000 per shipment. Only on shipments where we generate the documents and orchestrate the workflow — not on shipments you process outside the platform. You see the fee upfront before confirming each shipment.",
  },
  {
    q: "Is my data safe?",
    a: "All data lives in our Convex backend and a private PostgreSQL instance on our own VPS in Mumbai. We do not sell data. We do not share buyer lists. Detailed security write-up at /security.",
  },
  {
    q: "What if I'm a first-time exporter with nothing set up yet?",
    a: "The 'First shipment' plan is built for you. Flat ₹15,000 to get your IEC, AD Code, RCMC, GST LUT, and ICEGATE registration done — plus 3 months of the Operator plan free. We file every form. You sign and pay government fees.",
  },
  {
    q: "Which export councils (RCMC) do you cover?",
    a: "All 36 Export Promotion Councils notified by DGFT. Most common we've filed: FIEO, EEPC, AEPC, Pharmexcil, Capexil, SHEFEXIL, Spices Board, APEDA, MPEDA. If your product needs a specific council, we route to the right partner.",
  },
  {
    q: "Do you handle imports too, or just exports?",
    a: "Phase 1 is exports. Imports — Bill of Entry, BIS, FSSAI, customs duty optimization — is on the roadmap for Q3. You can join the import waitlist from the dashboard.",
  },
  {
    q: "Can I just use the free HS code calculator without signing up?",
    a: "Yes. The HS code lookup and duty calculator are free, 10 searches per day, no account needed. Sign up if you want history, AI suggestions, or unlimited use.",
  },
];

export function Faq() {
  return (
    <section className="border-b border-line bg-paper">
      <div className="container py-24">
        <div className="grid gap-12 md:grid-cols-[1fr_2fr] md:gap-20">
          <div>
            <p className="font-data text-[10px] uppercase tracking-[0.22em] text-muted">FAQ</p>
            <h2 className="mt-4 text-display-lg">Honest answers.</h2>
            <p className="mt-5 text-base text-ink/70">
              Still have questions?{" "}
              <a className="underline decoration-line underline-offset-4 hover:decoration-ink" href="/contact">
                Email us
              </a>{" "}
              or WhatsApp +91 83200 65658.
            </p>
          </div>

          <dl className="divide-y divide-line border-y border-line">
            {faqs.map((f) => (
              <div key={f.q} className="grid gap-3 py-6 md:grid-cols-[1fr_1.5fr] md:gap-8">
                <dt className="font-serif text-xl leading-snug">{f.q}</dt>
                <dd className="text-base leading-relaxed text-ink/75">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
