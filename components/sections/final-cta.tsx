import Link from "next/link";

export function FinalCta() {
  return (
    <section className="border-b border-line bg-ink text-paper">
      <div className="container py-24 text-center">
        <p className="font-data text-[10px] uppercase tracking-[0.22em] text-paper/50">
          The dashboard for Indian exporters
        </p>
        <h2 className="mx-auto mt-5 max-w-3xl text-display-lg">
          Stop running operations from <span className="italic">seven WhatsApp groups</span>.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-paper/75">
          14 days free. No card needed. If you ship even one container while trying it, we will
          have already saved you more than ₹3,000.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3 text-sm font-medium text-ink transition-opacity hover:opacity-90"
          >
            Start free <span aria-hidden>→</span>
          </Link>
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 rounded-full border border-paper/30 px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-paper/10"
          >
            Book a 20-min walkthrough
          </Link>
        </div>

        <p className="mt-12 font-data text-[10px] uppercase tracking-[0.22em] text-paper/40">
          Built by ZeroOne D.O.T.S. AI · Ahmedabad · India
        </p>
      </div>
    </section>
  );
}
