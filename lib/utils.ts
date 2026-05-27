import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format INR amounts with proper Indian comma grouping. */
export function formatINR(amount: number, opts?: { compact?: boolean }) {
  if (opts?.compact) {
    if (amount >= 10_000_000) return `₹${(amount / 10_000_000).toFixed(amount % 10_000_000 === 0 ? 0 : 2)}Cr`;
    if (amount >= 100_000) return `₹${(amount / 100_000).toFixed(amount % 100_000 === 0 ? 0 : 2)}L`;
    if (amount >= 1_000) return `₹${(amount / 1_000).toFixed(0)}k`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Slugify for HS code lookups, buyer names, etc. */
export function slug(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Truthy guard for filtering. */
export const isDefined = <T,>(v: T | null | undefined): v is T => v !== null && v !== undefined;
