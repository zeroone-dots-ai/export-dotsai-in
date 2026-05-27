import Link from "next/link";
import { brand, navLinks } from "@/lib/brand";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-paper/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-baseline gap-1.5 text-base">
          <span className="font-serif text-xl leading-none">ZeroOne</span>
          <span className="font-data text-[10px] uppercase tracking-[0.18em] text-muted">Export</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="hidden text-sm text-muted transition-colors hover:text-ink md:inline"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-opacity hover:opacity-90"
          >
            Start free <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
