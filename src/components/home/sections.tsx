"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  TrendingUp,
  Star,
  Quote,
  CheckCircle2,
  Video,
  MapPin,
  Building2,
  Award,
  Users,
  Home as HomeIcon,
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { SectionHeading } from "@/components/shared/section-heading";
import { CardCarousel } from "@/components/shared/card-carousel";
import { PropertyCard } from "@/components/property/property-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type {
  City,
  InvestmentOpportunity,
  Reel,
  Testimonial,
  BlogPost,
  Builder,
  Property,
} from "@/lib/data/types";

// ── Trending Projects ─────────────────────────────────────────
export function TrendingSection({ items }: { items: Property[] }) {
  return (
    <section className="pt-28 pb-20">
      <div className="container-luxe">
        <SectionHeading
          eyebrow="🔥 Hot right now"
          title="Trending this week"
          description="The listings everyone's talking about, ranked by views, saves and reels."
          action={{ label: "See all", href: "/buy" }}
        />
        <div className="mt-8">
          <CardCarousel>
            {items.map((p, i) => (
              <PropertyCard key={p.id} property={p} priority={i < 2} />
            ))}
          </CardCarousel>
        </div>
      </div>
    </section>
  );
}

// ── Browse by Category ────────────────────────────────────────
const CATEGORIES = [
  { label: "Luxury Villas", icon: HomeIcon, href: "/buy?type=Villa", image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=600&q=80" },
  { label: "Apartments", icon: Building2, href: "/buy?type=Apartment", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80" },
  { label: "Commercial", icon: Building2, href: "/buy?type=Commercial+Office", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80" },
  { label: "Plots & Land", icon: MapPin, href: "/buy?type=Plot", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80" },
  { label: "Penthouses", icon: Award, href: "/buy?type=Penthouse", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80" },
  { label: "Studios", icon: HomeIcon, href: "/buy?type=Studio", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80" },
];

export function CategoryGrid() {
  return (
    <section className="section-tint py-20">
      <div className="container-luxe">
        <SectionHeading
          eyebrow="Browse"
          title="Find your kind of place"
          description="Whatever you're looking for — we've curated the best in every category."
        />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={cat.href}>
                  <div className="group relative aspect-[4/5] overflow-hidden rounded-3xl shadow-card">
                    <Image
                      src={cat.image}
                      alt={cat.label}
                      fill
                      sizes="(max-width: 768px) 50vw, 16vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/30 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md transition-transform group-hover:scale-110">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-display text-sm font-bold leading-tight sm:text-base">
                        {cat.label}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Property Row (reusable horizontal carousel) ───────────────
export function PropertyRow({
  eyebrow,
  title,
  description,
  items,
  href,
  tinted,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  items: Property[];
  href?: string;
  tinted?: boolean;
}) {
  return (
    <section className={cn("py-16", tinted && "section-tint")}>
      <div className="container-luxe">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
          action={href ? { label: "View all", href } : undefined}
        />
        <div className="mt-8">
          <CardCarousel>
            {items.map((p, i) => (
              <PropertyCard key={p.id} property={p} priority={i < 1} />
            ))}
          </CardCarousel>
        </div>
      </div>
    </section>
  );
}

// ── Reels Preview ─────────────────────────────────────────────
export function ReelsPreview({
  reels,
}: {
  reels: (Reel & { property?: Property })[];
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-luxe py-20 text-white">
      <div className="absolute inset-0 bg-radial-glow opacity-50" />
      <div className="container-luxe relative">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="glass" className="mb-4 bg-white/10">
            <Video className="h-3 w-3" /> Reels
          </Badge>
          <h2 className="font-display text-3xl font-bold sm:text-5xl">
            Swipe through homes like never before.
          </h2>
          <p className="mt-4 text-white/70">
            Vertical, immersive property reels. Like, save, share, and tap to
            explore — all in a single thumb-friendly feed.
          </p>
          <div className="mt-6">
            <Button asChild variant="gradient" size="lg">
              <Link href="/reels">
                <Video className="h-5 w-5" /> Open Reels
              </Link>
            </Button>
          </div>
        </div>

        {/* Phone mockups */}
        <div className="mt-12 flex justify-center gap-4 overflow-x-auto no-scrollbar pb-4 sm:gap-6">
          {reels.slice(0, 5).map((reel, i) => (
            <motion.div
              key={reel.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={cn(
                "relative aspect-[9/16] w-40 shrink-0 overflow-hidden rounded-3xl border-4 border-white/20 shadow-float sm:w-48",
                i === 1 && "scale-105 sm:scale-110"
              )}
            >
              <Image
                src={reel.poster}
                alt={reel.property?.title ?? "Reel"}
                fill
                sizes="(max-width: 768px) 40vw, 20vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-ink-950/20" />
              <div className="absolute bottom-3 left-3 right-3">
                <div className="font-display text-sm font-bold leading-tight">
                  {reel.property?.title}
                </div>
                <div className="mt-0.5 flex items-center gap-1 text-[10px] text-white/70">
                  <MapPin className="h-2.5 w-2.5" />
                  {reel.property?.locality}, {reel.property?.city}
                </div>
              </div>
              <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-gold/90">
                <Video className="h-3.5 w-3.5 text-white" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Investment Opportunities ──────────────────────────────────
export function InvestmentSection({
  items,
}: {
  items: InvestmentOpportunity[];
}) {
  return (
    <section className="container-luxe py-16">
      <SectionHeading
        eyebrow="💰 Invest"
        title="Investment opportunities"
        description="Data-driven picks with strong rental yields and capital appreciation."
        action={{ label: "Explore Invest", href: "/invest" }}
      />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((inv, i) => (
          <motion.div
            key={inv.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.06 }}
          >
            <Link href={`/property/${inv.propertyId}`}>
              <Card className="group overflow-hidden transition-all hover:-translate-y-1 hover:shadow-card-hover">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={inv.image}
                    alt={inv.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute left-3 top-3">
                    <Badge variant="gold" className="bg-gold-500 text-white">
                      Rating {inv.rating}
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="truncate font-display font-bold">{inv.title}</h3>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {inv.location}
                  </p>
                  <div className="mt-3 space-y-1.5 border-t border-border pt-3">
                    <Row label="Entry" value={formatPrice(inv.entryPrice)} />
                    <Row
                      label="Rental yield"
                      value={`${inv.expectedRentalYield}%`}
                      positive
                    />
                    <Row
                      label="Appreciation"
                      value={`${inv.expectedAppreciation}% / yr`}
                      positive
                    />
                    <Row label="Horizon" value={`${inv.horizonYears} yrs`} />
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Row({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={cn(
          "font-semibold",
          positive && "text-emerald-600 dark:text-emerald-400"
        )}
      >
        {value}
      </span>
    </div>
  );
}

// ── Featured Properties ───────────────────────────────────────
export function FeaturedSection({ items }: { items: Property[] }) {
  const [hero, ...rest] = items;
  return (
    <section className="section-tint py-20">
      <div className="container-luxe">
        <SectionHeading
          eyebrow="★ Editor's picks"
          title="Featured properties"
          description="Hand-selected by our team for design, location and value."
          action={{ label: "Browse all", href: "/buy" }}
        />
      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {hero && (
          <Link href={`/property/${hero.slug}`} className="lg:row-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="group relative h-full min-h-[400px] overflow-hidden rounded-3xl"
            >
              <Image
                src={hero.images[0]}
                alt={hero.title}
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <Badge variant="gold" className="mb-2">★ Featured</Badge>
                <h3 className="font-display text-2xl font-bold sm:text-3xl">
                  {hero.title}
                </h3>
                <p className="mt-1 flex items-center gap-1 text-sm text-white/80">
                  <MapPin className="h-4 w-4" /> {hero.locality}, {hero.city}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-display text-2xl font-bold">
                    {formatPrice(hero.price)}
                  </span>
                  <Button variant="gradient" size="sm">
                    View <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </Link>
        )}
        {rest.slice(0, 4).map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
        </div>
      </div>
    </section>
  );
}

// ── Top Builders ──────────────────────────────────────────────
export function BuildersSection({ items }: { items: Builder[] }) {
  return (
    <section className="container-luxe py-16">
      <SectionHeading
        eyebrow="Trusted by"
        title="Top builders & developers"
        description="Work with India and Dubai's most reputed names, all RERA-verified."
      />
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {items.map((b) => (
          <Link key={b.id} href={`/buy?builder=${b.id}`}>
            <Card className="group flex flex-col items-center gap-3 p-5 text-center transition-all hover:-translate-y-1 hover:shadow-card-hover">
              <div className="relative h-14 w-14 overflow-hidden rounded-2xl ring-2 ring-border group-hover:ring-primary/40">
                <Image src={b.logo} alt={b.name} fill sizes="56px" className="object-cover" />
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 text-sm font-semibold">
                  {b.name}
                  {b.verified && <CheckCircle2 className="h-3.5 w-3.5 text-teal-500" />}
                </div>
                <div className="mt-0.5 text-[11px] text-muted-foreground">
                  ★ {b.rating} · {b.projectsDelivered} projects
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ── Popular Cities ────────────────────────────────────────────
export function CitiesSection({ items }: { items: City[] }) {
  return (
    <section className="container-luxe py-16">
      <SectionHeading
        eyebrow="Locations"
        title="Popular cities"
        description="Explore the most-loved real estate destinations."
        action={{ label: "All cities", href: "/buy" }}
      />
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {items.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={`/buy?city=${encodeURIComponent(c.name)}`}>
              <div className="group relative aspect-[3/4] overflow-hidden rounded-3xl">
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
                {c.trending && (
                  <Badge variant="glass" className="absolute left-3 top-3 bg-gold/90 text-white">
                    🔥 Trending
                  </Badge>
                )}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-display text-xl font-bold">{c.name}</h3>
                  <p className="text-xs text-white/80">
                    {c.propertyCount.toLocaleString("en-IN")} properties
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ── Testimonials ──────────────────────────────────────────────
export function TestimonialsSection({ items }: { items: Testimonial[] }) {
  return (
    <section className="container-luxe py-16">
      <SectionHeading
        eyebrow="Loved by users"
        title="What our customers say"
        description="50,000+ happy buyers, renters and investors and counting."
        align="center"
      />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: (i % 3) * 0.08 }}
          >
            <Card className="relative h-full p-6">
              <Quote className="absolute right-4 top-4 h-10 w-10 text-primary/10" />
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    className={cn(
                      "h-4 w-4",
                      s < t.rating
                        ? "fill-gold-500 text-gold-500"
                        : "text-muted-foreground"
                    )}
                  />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-foreground/90">
                "{t.text}"
              </p>
              <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <Image
                  src={t.avatar}
                  alt={t.name}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ── Blogs ─────────────────────────────────────────────────────
export function BlogsSection({ items }: { items: BlogPost[] }) {
  return (
    <section className="container-luxe py-16">
      <SectionHeading
        eyebrow="Insights"
        title="From the blog"
        description="Market trends, buying guides and design inspiration."
        action={{ label: "Read more", href: "#" }}
      />
      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {items.map((b) => (
          <Link key={b.id} href={`/blog/${b.slug}`}>
            <Card className="group h-full overflow-hidden transition-all hover:-translate-y-1 hover:shadow-card-hover">
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={b.cover}
                  alt={b.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <Badge variant="dark" className="absolute left-3 top-3 bg-ink-950/70">
                  {b.category}
                </Badge>
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-bold leading-tight group-hover:text-primary">
                  {b.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {b.excerpt}
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <Image
                    src={b.authorAvatar}
                    alt={b.author}
                    width={24}
                    height={24}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                  <span className="font-medium">{b.author}</span>
                  <span>·</span>
                  <span>{b.readMinutes} min read</span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ── Stats banner ──────────────────────────────────────────────
export function StatsBanner() {
  const stats = [
    { value: "48,000+", label: "Active listings", icon: HomeIcon },
    { value: "₹42,000 Cr", label: "Property transacted", icon: TrendingUp },
    { value: "320+", label: "Verified builders", icon: Building2 },
    { value: "50,000+", label: "Happy users", icon: Users },
  ];
  return (
    <section className="container-luxe py-12">
      <div className="grid grid-cols-2 gap-4 rounded-3xl bg-gradient-luxe p-8 text-white sm:p-10 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
                <Icon className="h-6 w-6 text-teal-300" />
              </div>
              <div className="font-display text-2xl font-bold sm:text-3xl">
                {s.value}
              </div>
              <div className="mt-1 text-xs text-white/70 sm:text-sm">
                {s.label}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── CTA ───────────────────────────────────────────────────────
export function FinalCTA() {
  return (
    <section className="container-luxe py-16">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-accent px-8 py-16 text-center text-white sm:px-16 sm:py-20">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-gold/20 blur-2xl" />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-bold sm:text-5xl">
            Ready to find your next home?
          </h2>
          <p className="mt-4 text-white/80">
            Join thousands who discover, save and move into their dream homes
            with Luxe Estates.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="xl" variant="gold">
              <Link href="/buy">Start exploring <ArrowRight className="h-5 w-5" /></Link>
            </Button>
            <Button asChild size="xl" variant="glass" className="bg-white/15">
              <Link href="/reels"><Video className="h-5 w-5" /> Watch reels</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
