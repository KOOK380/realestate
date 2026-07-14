import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as Indian-style price (₹). Pass `compact` for lakhs/crores. */
export function formatPrice(
  value: number,
  opts: { compact?: boolean; currency?: string } = {}
): string {
  const { compact = true, currency = "₹" } = opts;
  if (!compact) {
    return `${currency}${value.toLocaleString("en-IN")}`;
  }
  // Indian real-estate convention: lakhs (1,00,000) and crores (1,00,00,000)
  if (value >= 1_00_00_000) {
    const cr = value / 1_00_00_000;
    return `${currency}${cr % 1 === 0 ? cr : cr.toFixed(2)} Cr`;
  }
  if (value >= 1_00_000) {
    const l = value / 1_00_000;
    return `${currency}${l % 1 === 0 ? l : l.toFixed(2)} L`;
  }
  if (value >= 1_000) {
    return `${currency}${(value / 1_000).toFixed(0)}K`;
  }
  return `${currency}${value}`;
}

/** Monthly rent formatting (no Cr/L). */
export function formatRent(value: number): string {
  return `₹${value.toLocaleString("en-IN")}/mo`;
}

export function formatArea(value: number, unit = "sq.ft"): string {
  return `${value.toLocaleString("en-IN")} ${unit}`;
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(text: string, max = 120): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "…";
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** EMI formula: P × r × (1+r)^n / ((1+r)^n − 1) */
export function calculateEMI(
  principal: number,
  annualRatePercent: number,
  years: number
): { emi: number; totalInterest: number; totalPayable: number } {
  const r = annualRatePercent / 12 / 100;
  const n = years * 12;
  if (r === 0) {
    const emi = principal / n;
    return { emi, totalInterest: 0, totalPayable: principal };
  }
  const pow = Math.pow(1 + r, n);
  const emi = (principal * r * pow) / (pow - 1);
  const totalPayable = emi * n;
  return { emi, totalInterest: totalPayable - principal, totalPayable };
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
