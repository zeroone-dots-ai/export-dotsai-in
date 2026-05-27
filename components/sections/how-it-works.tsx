const steps = [
  {
    n: "01",
    label: "Sign up",
    title: "Tell us about your business.",
    body: "Company name, what you export, where you ship, and where you are right now — whether you already have an IEC or you're starting from scratch.",
    time: "3 minutes",
  },
  {
    n: "02",
    label: "Onboarding call",
    title: "A 20-minute call with our team.",
    body: "We map your existing setup — your CA, your shipping partner, your bank — and figure out where each module saves you time. No sales pitch.",
    time: "Same day",
  },
  {
    n: "03",
    label: "License setup",
    title: "We file what's missing.",
    body: "Don't have IEC, AD Code, RCMC, or LUT? Our partner CA files them. You upload documents through the wizard — we handle the portals.",
    time: "7 days",
  },
  {
    n: "04",
    label: "Daily operations",
    title: "Your team works inside the dashboard.",
    body: "New order? Generate documents in 90 seconds. Need an HS code? Type the product, get the code. Need buyers? Filter shipment data by country.",
    time: "Ongoing",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-line bg-secondary/30">
      <div className="container py-24">
        <div className="max-w-2xl">
          <p className="font-data text-[10px] uppercase tracking-[0.22em] text-muted">
            From sign-up to first shipment routed through us
          </p>
          <h2 className="mt-4 text-display-lg">How it works.</h2>
        </div>

        <ol className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <li key={s.n} className="flex flex-col gap-4 bg-paper p-8">
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-4xl text-ink/30">{s.n}</span>
                <span className="font-data text-[10px] uppercase tracking-[0.18em] text-muted">
                  {s.time}
                </span>
              </div>
              <p className="font-data text-[10px] uppercase tracking-[0.22em] text-muted">
                {s.label}
              </p>
              <h3 className="font-serif text-2xl leading-tight">{s.title}</h3>
              <p className="text-sm leading-relaxed text-ink/70">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
