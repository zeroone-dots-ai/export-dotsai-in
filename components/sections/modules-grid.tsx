import Link from "next/link";
import { modules } from "@/lib/brand";

const swatchClasses: Record<string, string> = {
  lavender: "bg-lavender-100 border-lavender-200",
  mint: "bg-mint-100 border-mint-200",
  peach: "bg-peach-100 border-peach-200",
  sky: "bg-sky-100 border-sky-200",
};

export function ModulesGrid() {
  return (
    <section id="modules" className="border-b border-line bg-paper">
      <div className="container py-24">
        <div className="max-w-2xl">
          <p className="font-data text-[10px] uppercase tracking-[0.22em] text-muted">
            Four modules · One subscription
          </p>
          <h2 className="mt-4 text-display-lg">Everything that touches a shipment.</h2>
          <p className="mt-5 text-lg text-ink/75">
            Each module replaces a specific cost center: a consultant, a portal, a spreadsheet, a
            paid directory. Use what you need.
          </p>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
          {modules.map((m, i) => (
            <article
              key={m.slug}
              className="group relative flex flex-col gap-6 bg-paper p-8 transition-colors hover:bg-secondary/40 md:p-10"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`h-2 w-2 rounded-full border ${swatchClasses[m.color]}`}
                  aria-hidden
                />
                <span className="font-data text-[10px] uppercase tracking-[0.22em] text-muted">
                  Module {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <div>
                <h3 className="text-display-md">{m.name}</h3>
                <p className="mt-3 font-serif text-xl italic text-ink/80">{m.short}</p>
                <p className="mt-4 text-base leading-relaxed text-ink/70">{m.description}</p>
              </div>

              <Link
                href={`/modules/${m.slug}`}
                className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-ink transition-colors group-hover:gap-2.5"
              >
                See the {m.name.toLowerCase()} <span aria-hidden>→</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
