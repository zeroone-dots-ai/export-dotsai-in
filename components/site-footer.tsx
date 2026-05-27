import Link from "next/link";

const cols = [
  {
    heading: "Platform",
    links: [
      { href: "/#modules", label: "Modules" },
      { href: "/pricing", label: "Pricing" },
      { href: "/how-it-works", label: "How it works" },
      { href: "/changelog", label: "Changelog" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { href: "/hs-code", label: "Free HS code lookup" },
      { href: "/duty-calculator", label: "Duty calculator" },
      { href: "/guides/iec", label: "How to get an IEC" },
      { href: "/guides/ad-code", label: "AD Code at port" },
      { href: "/guides/rcmc", label: "RCMC by council" },
      { href: "/glossary", label: "EXIM glossary" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About ZeroOne" },
      { href: "/contact", label: "Contact" },
      { href: "/partners", label: "Partner with us" },
      { href: "https://dotsai.in", label: "ZeroOne D.O.T.S. AI" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/terms", label: "Terms" },
      { href: "/privacy", label: "Privacy" },
      { href: "/refund", label: "Refund policy" },
      { href: "/security", label: "Security" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="container py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-xl leading-none">ZeroOne</span>
              <span className="font-data text-[10px] uppercase tracking-[0.18em] text-muted">Export</span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              The dashboard for Indian exporters. Built by ZeroOne D.O.T.S. AI in Ahmedabad.
            </p>
          </div>

          {cols.map((col) => (
            <div key={col.heading}>
              <h4 className="font-data text-[10px] uppercase tracking-[0.18em] text-muted">{col.heading}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-ink/80 transition-colors hover:text-ink"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-line pt-8 md:flex-row md:items-center">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} ZeroOne D.O.T.S. AI Pvt. Ltd. CIN registered in India.
          </p>
          <p className="font-data text-[10px] uppercase tracking-[0.18em] text-muted">
            Made in India · For Indian exporters
          </p>
        </div>
      </div>
    </footer>
  );
}
