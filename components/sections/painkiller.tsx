const pains = [
  {
    before: "Chasing your CA on WhatsApp for the LUT renewal at 2am.",
    after: "Compliance calendar pings you 14 days early. One click renews.",
  },
  {
    before: "Re-typing buyer details into 4 different invoice templates.",
    after: "Type once. Auto-fills Commercial Invoice, Packing List, BL instructions, COO.",
  },
  {
    before: "Asking 3 different consultants what HS code your product is.",
    after: "Describe it in plain English. Get the 8-digit code + India and destination duty.",
  },
  {
    before: "Buying buyer lists from IndiaMart that turn out to be cold for 6 months.",
    after: "Filter by real, recent shipment data. Companies that imported your product last quarter.",
  },
  {
    before: "Spending ₹40,000 across CA + consultant + courier just for an IEC + AD Code.",
    after: "Wizard with a partner CA. Flat ₹15,000 all-in. Done in a week.",
  },
];

export function Painkiller() {
  return (
    <section className="border-b border-line bg-paper">
      <div className="container py-24">
        <div className="max-w-2xl">
          <p className="font-data text-[10px] uppercase tracking-[0.22em] text-muted">
            What you currently do · What we replace
          </p>
          <h2 className="mt-4 text-display-lg">The five things that waste your week.</h2>
          <p className="mt-5 text-lg text-ink/75">
            We watched 30+ small exporters work for a month before we wrote a line of code. Same
            five problems, every single time.
          </p>
        </div>

        <div className="mt-16 divide-y divide-line border-y border-line">
          {pains.map((pain, i) => (
            <div key={i} className="grid gap-6 py-8 md:grid-cols-[80px_1fr_1fr] md:items-baseline md:gap-10">
              <span className="font-data text-[11px] uppercase tracking-[0.22em] text-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-base text-ink/60 line-through decoration-peach-300 decoration-2 underline-offset-4">
                {pain.before}
              </p>
              <p className="font-serif text-xl leading-snug text-ink">{pain.after}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
