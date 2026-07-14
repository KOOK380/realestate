"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal,
  X,
  MapPin,
  Building2,
  BedDouble,
  Bath,
  CheckCircle2,
  Crown,
  Flame,
  LayoutGrid,
  Rows3,
  ArrowUpDown,
  Search,
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PropertyCard, PropertyCardSkeleton } from "@/components/property/property-card";
import { EmptyState } from "@/components/shared/empty-state";
import {
  CITY_OPTIONS,
  PROPERTY_TYPES,
  BHK_OPTIONS,
} from "@/lib/constants";
import type { Property, TransactionType } from "@/lib/data/types";

interface ListingProps {
  title: string;
  description: string;
  items: Property[];
  transactionType: TransactionType;
}

const PRICE_MAX = 10_00_00_000; // 10 Cr
const ALL_TYPES = ["All", ...PROPERTY_TYPES];

export function PropertyListing({
  title,
  description,
  items: initialItems,
  transactionType,
}: ListingProps) {
  const router = useRouter();
  const sp = useSearchParams();

  // Read initial filters from URL
  const [query, setQuery] = React.useState(sp.get("q") ?? "");
  const [city, setCity] = React.useState(sp.get("city") ?? "All");
  const [type, setType] = React.useState(sp.get("type") ?? "All");
  const [beds, setBeds] = React.useState<string>(sp.get("beds") ?? "any");
  const [baths, setBaths] = React.useState<string>(sp.get("baths") ?? "any");
  const [priceRange, setPriceRange] = React.useState<number[]>([
    Number(sp.get("minPrice")) || 0,
    Number(sp.get("maxPrice")) || PRICE_MAX,
  ]);
  const [verified, setVerified] = React.useState(sp.get("verified") === "1");
  const [luxury, setLuxury] = React.useState(sp.get("luxury") === "1");
  const [trending, setTrending] = React.useState(sp.get("trending") === "1");
  const [ready, setReady] = React.useState(sp.get("ready") === "1");
  const [sort, setSort] = React.useState<string>(
    sp.get("sort") ?? "relevance"
  );
  const [layout, setLayout] = React.useState<"grid" | "list">("grid");
  const [loading, setLoading] = React.useState(false);

  const filtered = React.useMemo(() => {
    let out = [...initialItems];

    if (query.trim()) {
      const q = query.toLowerCase();
      out = out.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.locality.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q)
      );
    }
    if (city !== "All") out = out.filter((p) => p.city === city);
    if (type !== "All") out = out.filter((p) => p.type === type);
    if (beds !== "any") {
      const b = parseInt(beds);
      out = out.filter((p) => (b >= 5 ? p.beds >= 5 : p.beds === b));
    }
    if (baths !== "any") {
      const b = parseInt(baths);
      out = out.filter((p) => p.baths >= b);
    }
    out = out.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (verified) out = out.filter((p) => p.verified);
    if (luxury) out = out.filter((p) => p.luxury);
    if (trending) out = out.filter((p) => p.trending);
    if (ready) out = out.filter((p) => p.possession === "Ready to Move");

    switch (sort) {
      case "price-asc":
        out.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        out.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        out.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
        break;
      case "area-desc":
        out.sort((a, b) => b.area - a.area);
        break;
      case "rating":
        out.sort((a, b) => b.rating - a.rating);
        break;
      default:
        out.sort(
          (a, b) =>
            Number(b.featured) - Number(a.featured) ||
            Number(b.trending) - Number(a.trending) ||
            Number(b.verified) - Number(a.verified) ||
            b.views - a.views
        );
    }
    return out;
  }, [
    initialItems,
    query,
    city,
    type,
    beds,
    baths,
    priceRange,
    verified,
    luxury,
    trending,
    ready,
    sort,
  ]);

  const activeFilterCount = [
    city !== "All",
    type !== "All",
    beds !== "any",
    baths !== "any",
    priceRange[0] !== 0 || priceRange[1] !== PRICE_MAX,
    verified,
    luxury,
    trending,
    ready,
  ].filter(Boolean).length;

  const clearAll = () => {
    setQuery("");
    setCity("All");
    setType("All");
    setBeds("any");
    setBaths("any");
    setPriceRange([0, PRICE_MAX]);
    setVerified(false);
    setLuxury(false);
    setTrending(false);
    setReady(false);
    setSort("relevance");
    router.push(`/${transactionType.toLowerCase()}`);
  };

  // Simulate brief loading when filters change (premium feel + skeletons)
  React.useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, [query, city, type, beds, baths, priceRange, verified, luxury, trending, ready, sort]);

  const FilterContent = (
    <div className="space-y-6">
      <FilterGroup label="Location">
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["All", ...CITY_OPTIONS].map((c) => (
              <SelectItem key={c} value={c}>
                {c === "All" ? "All cities" : c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterGroup>

      <FilterGroup label="Property type">
        <div className="grid grid-cols-2 gap-1.5">
          {ALL_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={cn(
                "rounded-xl border px-3 py-2 text-xs font-medium transition-colors",
                type === t
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/40"
              )}
            >
              {t === "All" ? "All types" : t}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup label="Bedrooms">
        <div className="flex flex-wrap gap-1.5">
          {["any", ...BHK_OPTIONS].map((b) => (
            <button
              key={b}
              onClick={() => setBeds(b)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                beds === b
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/40"
              )}
            >
              {b === "any" ? "Any" : b === "5+" ? "5+ BHK" : `${b} BHK`}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup label="Bathrooms">
        <div className="flex flex-wrap gap-1.5">
          {["any", "1", "2", "3", "4+"].map((b) => (
            <button
              key={b}
              onClick={() => setBaths(b)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                baths === b
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/40"
              )}
            >
              {b === "any" ? "Any" : b}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup label={`Budget · ${formatPrice(priceRange[0])} – ${formatPrice(priceRange[1])}`}>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          min={0}
          max={PRICE_MAX}
          step={5_000_000}
          className="mt-3"
        />
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>₹0</span>
          <span>₹10 Cr+</span>
        </div>
      </FilterGroup>

      <FilterGroup label="Preferences">
        <div className="space-y-3">
          <ToggleRow
            icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
            label="Verified only"
            checked={verified}
            onCheck={setVerified}
          />
          <ToggleRow
            icon={<Crown className="h-4 w-4 text-gold-500" />}
            label="Luxury"
            checked={luxury}
            onCheck={setLuxury}
          />
          <ToggleRow
            icon={<Flame className="h-4 w-4 text-orange-500" />}
            label="Trending"
            checked={trending}
            onCheck={setTrending}
          />
          <ToggleRow
            icon={<Building2 className="h-4 w-4 text-brand-500" />}
            label="Ready to move"
            checked={ready}
            onCheck={setReady}
          />
        </div>
      </FilterGroup>

      {activeFilterCount > 0 && (
        <Button variant="outline" className="w-full" onClick={clearAll}>
          Clear all filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="container-luxe py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">{title}</h1>
        <p className="mt-2 text-muted-foreground">{description}</p>
      </div>

      {/* Search + toolbar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, locality…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          {/* Mobile filters */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge variant="default" className="ml-1">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[320px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-4 px-4 pb-8">{FilterContent}</div>
            </SheetContent>
          </Sheet>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[170px] gap-2">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="area-desc">Largest area</SelectItem>
              <SelectItem value="rating">Top rated</SelectItem>
            </SelectContent>
          </Select>

          <div className="hidden items-center rounded-full border border-border p-1 sm:flex">
            <button
              onClick={() => setLayout("grid")}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full",
                layout === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setLayout("list")}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full",
                layout === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              )}
            >
              <Rows3 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Desktop filter sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-3xl border border-border bg-card/50 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display font-bold">Filters</h3>
              {activeFilterCount > 0 && (
                <Badge variant="accent">{activeFilterCount} active</Badge>
              )}
            </div>
            {FilterContent}
          </div>
        </aside>

        {/* Results */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
              {filtered.length === 1 ? "property" : "properties"} found
            </p>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={<Search className="h-8 w-8" />}
              title="No properties match your filters"
              description="Try widening your budget, changing the city, or clearing some filters."
              action={
                <Button variant="gradient" onClick={clearAll}>
                  Clear filters
                </Button>
              }
            />
          ) : loading ? (
            <div
              className={cn(
                "grid gap-5",
                layout === "grid"
                  ? "sm:grid-cols-2 xl:grid-cols-3"
                  : "grid-cols-1"
              )}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <motion.div
              layout
              className={cn(
                "grid gap-5",
                layout === "grid"
                  ? "sm:grid-cols-2 xl:grid-cols-3"
                  : "grid-cols-1"
              )}
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((p) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                  >
                    <PropertyCard property={p} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-border pb-5 last:border-0 last:pb-0">
      <Label className="mb-3 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}

function ToggleRow({
  icon,
  label,
  checked,
  onCheck,
}: {
  icon: React.ReactNode;
  label: string;
  checked: boolean;
  onCheck: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-sm font-medium">
        {icon} {label}
      </span>
      <Switch checked={checked} onCheckedChange={onCheck} />
    </div>
  );
}
