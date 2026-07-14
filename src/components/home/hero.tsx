"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Home,
  Building2,
  TrendingUp,
  Briefcase,
  BedDouble,
  Bath,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Play,
  Star,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CITY_OPTIONS, PROPERTY_TYPES, BHK_OPTIONS } from "@/lib/constants";
import { HERO_VIDEOS } from "@/lib/data/images";

const TABS = [
  { id: "Buy", label: "Buy", icon: Home, href: "/buy" },
  { id: "Rent", label: "Rent", icon: Building2, href: "/rent" },
  { id: "Invest", label: "Invest", icon: TrendingUp, href: "/invest" },
  { id: "Commercial", label: "Commercial", icon: Briefcase, href: "/buy?type=Commercial" },
] as const;

const STATS = [
  { value: "48K+", label: "Properties" },
  { value: "12K+", label: "Video tours" },
  { value: "320+", label: "Verified builders" },
  { value: "4.9★", label: "User rating" },
];

export function Hero({ heroVideo: _heroVideo }: { heroVideo: string }) {
  const router = useRouter();
  const [tab, setTab] = React.useState<(typeof TABS)[number]["id"]>("Buy");
  const [city, setCity] = React.useState<string>();
  const [type, setType] = React.useState<string>();
  const [beds, setBeds] = React.useState<string>();
  const [baths, setBaths] = React.useState<string>();
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  // Background video index (rotates for variety)
  const [videoIndex, setVideoIndex] = React.useState(0);
  const [loaded, setLoaded] = React.useState(false);
  React.useEffect(() => {
    const t = setInterval(
      () => setVideoIndex((i) => (i + 1) % HERO_VIDEOS.length),
      12000
    );
    return () => clearInterval(t);
  }, []);

  const activeTab = TABS.find((t) => t.id === tab)!;

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set("tab", tab);
    if (city) params.set("city", city);
    if (type) params.set("type", type);
    if (beds) params.set("beds", beds);
    if (baths) params.set("baths", baths);
    router.push(`${activeTab.href.split("?")[0]}?${params.toString()}`);
  };

  return (
    <section className="relative">
      {/* Cinematic background */}
      <div className="relative h-[88vh] min-h-[640px] w-full overflow-hidden">
        {/* Video layer with crossfade */}
        <AnimatePresence mode="sync">
          <motion.video
            key={videoIndex}
            autoPlay
            muted
            loop
            playsInline
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.6 }, scale: { duration: 14, ease: "linear" } }}
            onLoadedData={() => setLoaded(true)}
            className="absolute inset-0 h-full w-full object-cover"
            poster="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80"
          >
            <source src={HERO_VIDEOS[videoIndex]} type="video/mp4" />
          </motion.video>
        </AnimatePresence>

        {/* Gradient scrims */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-ink-950/40 to-ink-950/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/80 via-transparent to-transparent" />

        {/* Decorative orbs */}
        <div className="pointer-events-none absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-brand-500/25 blur-[100px]" />
        <div className="pointer-events-none absolute right-0 top-1/2 h-80 w-80 rounded-full bg-teal-500/20 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-96 rounded-full bg-gold-500/10 blur-[100px]" />

        {/* Content */}
        <div className="relative z-10 flex h-full items-center">
          <div className="container-luxe w-full">
            <div className="max-w-3xl">
              {/* Trust badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold-500">
                  <Sparkles className="h-3 w-3 text-white" />
                </span>
                #1 Premium Real Estate Experience
                <span className="mx-1 h-1 w-1 rounded-full bg-white/40" />
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-teal-300" /> RERA Verified
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="mt-6 font-display text-[2.75rem] font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
              >
                Find a place
                <br />
                you'll{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-gold-300 via-gold-400 to-gold-200 bg-clip-text text-transparent">
                    love
                  </span>
                  <motion.svg
                    viewBox="0 0 200 12"
                    className="absolute -bottom-2 left-0 h-3 w-full text-gold-400"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 0.9 }}
                  >
                    <motion.path
                      d="M2 9C50 3 150 3 198 9"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 0.9 }}
                    />
                  </motion.svg>
                </span>{" "}
                coming home to.
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25 }}
                className="mt-5 max-w-xl text-base text-white/80 sm:text-lg"
              >
                Explore thousands of homes through immersive video tours, curated
                collections and verified listings — across Buy, Rent & Invest.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35 }}
                className="mt-7 flex flex-wrap items-center gap-3"
              >
                <Button
                  variant="gradient"
                  size="xl"
                  onClick={handleSearch}
                  className="group"
                >
                  <Search className="h-5 w-5" /> Start searching
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button asChild variant="glass" size="xl" className="bg-white/10 text-white hover:bg-white/20">
                  <a href="/reels">
                    <Play className="h-4 w-4" /> Watch reels
                  </a>
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.45 }}
                className="mt-10 flex flex-wrap gap-x-8 gap-y-3"
              >
                {STATS.map((s, i) => (
                  <div key={s.label} className="flex items-center gap-3">
                    {i > 0 && <span className="hidden h-8 w-px bg-white/15 sm:block" />}
                    <div>
                      <div className="font-display text-2xl font-bold text-white sm:text-3xl">
                        {s.value}
                      </div>
                      <div className="text-xs text-white/60">{s.label}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Video indicator dots (top-right) */}
        <div className="absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-2 lg:flex">
          {HERO_VIDEOS.map((_, i) => (
            <button
              key={i}
              onClick={() => setVideoIndex(i)}
              aria-label={`Background ${i + 1}`}
              className={cn(
                "h-8 w-1 rounded-full transition-all",
                i === videoIndex ? "bg-gold-400" : "bg-white/25 hover:bg-white/50"
              )}
            />
          ))}
        </div>
      </div>

      {/* Search bar — overlapping the bottom of the hero */}
      <div className="container-luxe relative z-20 -mt-16">
        <div className="mx-auto w-full max-w-5xl rounded-[2rem] border border-black/5 bg-background/95 p-3 shadow-float backdrop-blur-2xl dark:bg-ink-900/85 sm:p-4">
          {/* Tabs */}
          <div className="mb-3 flex justify-center">
            <div className="flex gap-1 rounded-full bg-muted/70 p-1">
              {TABS.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={cn(
                      "relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors sm:px-6",
                      tab === t.id ? "text-white" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tab === t.id && (
                      <motion.span
                        layoutId="hero-tab"
                        className="absolute inset-0 -z-10 rounded-full bg-gradient-accent"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fields */}
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_auto]">
            <SearchField icon={<MapPin className="h-4 w-4" />} label="Location">
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger className="border-0 bg-transparent px-0 shadow-none focus:ring-0">
                  <SelectValue placeholder="Any city" />
                </SelectTrigger>
                <SelectContent>
                  {CITY_OPTIONS.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SearchField>

            <SearchField icon={<Building2 className="h-4 w-4" />} label="Property Type">
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="border-0 bg-transparent px-0 shadow-none focus:ring-0">
                  <SelectValue placeholder="Any type" />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SearchField>

            <SearchField icon={<BedDouble className="h-4 w-4" />} label="Bedrooms">
              <Select value={beds} onValueChange={setBeds}>
                <SelectTrigger className="border-0 bg-transparent px-0 shadow-none focus:ring-0">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  {BHK_OPTIONS.map((b) => (
                    <SelectItem key={b} value={b}>{b} BHK</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SearchField>

            <Button variant="gradient" size="lg" onClick={handleSearch} className="h-full min-h-[3.5rem]">
              <Search className="h-5 w-5" />
              <span className="hidden sm:inline">Search</span>
            </Button>
          </div>

          {/* Advanced toggle */}
          <div className="mt-2 flex items-center justify-between px-1">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              Advanced filters
              <ChevronDown
                className={cn("h-3 w-3 transition-transform", showAdvanced && "rotate-180")}
              />
            </button>
            <div className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
              <Star className="h-3 w-3 fill-gold-500 text-gold-500" />
              Trusted by 50,000+ happy buyers
            </div>
          </div>

          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 grid gap-2 border-t border-border pt-3 sm:grid-cols-3">
                  <SearchField icon={<Bath className="h-4 w-4" />} label="Bathrooms">
                    <Select value={baths} onValueChange={setBaths}>
                      <SelectTrigger className="border-0 bg-transparent px-0 shadow-none focus:ring-0">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        {["1", "2", "3", "4+"].map((b) => (
                          <SelectItem key={b} value={b}>{b}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </SearchField>
                  <div className="flex items-center gap-2 px-3 py-2">
                    <span className="text-xs font-medium text-muted-foreground">Budget</span>
                    <span className="text-sm font-semibold">₹ Any</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2">
                    <span className="text-xs font-medium text-muted-foreground">Developer</span>
                    <span className="text-sm font-semibold">Any</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function SearchField({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-muted/40 px-4 py-2.5 transition-colors focus-within:bg-muted/70 focus-within:ring-2 focus-within:ring-primary/30">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-background text-primary shadow-sm">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        {children}
      </div>
    </div>
  );
}
