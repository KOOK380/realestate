"use client";

import Link from "next/link";
import {
  Building2,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SITE, FOOTER_COLUMNS } from "@/lib/constants";
import { toast } from "sonner";
import * as React from "react";

const SOCIAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Linkedin,
};

export function SiteFooter() {
  const [email, setEmail] = React.useState("");

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("You're subscribed! 🎉", {
      description: "We'll send you the best new listings every week.",
    });
    setEmail("");
  };

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-border bg-ink-950 text-white">
      <div className="absolute inset-0 bg-gradient-luxe opacity-90" />
      <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-brand-600/30 blur-3xl" />
      <div className="absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-teal-500/20 blur-3xl" />

      <div className="container-luxe relative">
        {/* Newsletter */}
        <div className="grid gap-8 border-b border-white/10 py-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h3 className="font-display text-2xl font-bold sm:text-3xl">
              Get the best listings first.
            </h3>
            <p className="mt-2 max-w-md text-white/70">
              Join 50,000+ buyers, renters and investors. Weekly curated drops,
              market insights and price alerts — no spam.
            </p>
          </div>
          <form onSubmit={subscribe} className="flex w-full max-w-md gap-2 lg:ml-auto">
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="h-12 border-white/15 bg-white/10 text-white placeholder:text-white/40"
            />
            <Button type="submit" variant="gradient" size="lg" className="shrink-0">
              Subscribe
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </div>

        {/* Links */}
        <div className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-accent">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <span className="font-display text-xl font-bold">Luxe Estates</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-white/60">
              {SITE.description}
            </p>
            <div className="mt-6 space-y-2 text-sm text-white/70">
              <a
                href={`tel:${SITE.supportPhoneHref}`}
                className="flex items-center gap-2 hover:text-white"
              >
                <Phone className="h-4 w-4 text-teal-400" /> {SITE.supportPhone}
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="flex items-center gap-2 hover:text-white"
              >
                <Mail className="h-4 w-4 text-teal-400" /> {SITE.email}
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-teal-400" /> Mumbai · Dubai · Worldwide
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              {[
                "Instagram",
                "Twitter",
                "Facebook",
                "Youtube",
                "Linkedin",
              ].map((s) => {
                const Icon = SOCIAL_ICONS[s];
                return (
                  <a
                    key={s}
                    href="#"
                    aria-label={s}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-gradient-accent"
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                  </a>
                );
              })}
            </div>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white/90">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 text-sm text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
              🔒 RERA Compliant
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
              ⚡ 100/100 Lighthouse
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
