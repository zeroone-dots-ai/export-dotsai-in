export function TrustBar() {
  return (
    <section className="border-y border-line bg-secondary/30">
      <div className="container py-8">
        <p className="text-center font-data text-[10px] uppercase tracking-[0.22em] text-muted">
          Built on systems that ZeroOne already runs for its consulting clients
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm text-ink/60">
          <span>DGFT-compliant document templates</span>
          <span className="hidden h-1 w-1 rounded-full bg-line md:inline-block" />
          <span>ICEGATE shipping bill mapping</span>
          <span className="hidden h-1 w-1 rounded-full bg-line md:inline-block" />
          <span>RBI FEMA-aligned export workflows</span>
          <span className="hidden h-1 w-1 rounded-full bg-line md:inline-block" />
          <span>Partner CA network across 6 cities</span>
        </div>
      </div>
    </section>
  );
}
