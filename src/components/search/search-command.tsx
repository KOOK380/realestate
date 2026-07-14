"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command as CommandPrimitive } from "cmdk";
import {
  Search,
  TrendingUp,
  Clock,
  Mic,
  MapPin,
  Home,
  Building2,
  X,
  CornerDownLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { POPULAR_SEARCHES, CITY_OPTIONS, PROPERTY_TYPES } from "@/lib/constants";
import { properties } from "@/lib/data/mock/properties";
import { openSearch, onOpenSearch } from "./search-store";

export function SearchCommand() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const router = useRouter();

  // Listen for global open triggers (header / mobile)
  React.useEffect(() => {
    return onOpenSearch(() => setOpen(true));
  }, []);

  // ⌘K / Ctrl+K shortcut
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const recent = useRecentSearches();

  const propertyResults = React.useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return properties
      .filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.locality.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.type.toLowerCase().includes(q)
      )
      .slice(0, 5);
  }, [query]);

  const runSearch = (term: string) => {
    if (!term.trim()) return;
    saveRecent(term);
    setOpen(false);
    setQuery("");
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  const go = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="top-[15%] max-w-2xl translate-y-0 p-0 sm:rounded-3xl">
        <DialogTitle className="sr-only">Search</DialogTitle>
        <CommandPrimitive
          className="flex flex-col overflow-hidden rounded-3xl"
          loop
          shouldFilter={false}
        >
          <div className="flex items-center gap-3 border-b border-border px-4">
            <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
            <CommandPrimitive.Input
              autoFocus
              value={query}
              onValueChange={setQuery}
              placeholder="Search by city, locality, property name, type…"
              className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
              onKeyDown={(e) => {
                if (e.key === "Enter") runSearch(query);
              }}
            />
            <button
              onClick={() => go("/reels")}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/15 text-gold-600 hover:bg-gold/25"
              title="Voice search"
              aria-label="Voice search"
            >
              <Mic className="h-4 w-4" />
            </button>
            <button
              onClick={() => setOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <CommandPrimitive.List className="max-h-[60vh] overflow-y-auto p-2">
            {/* Property results */}
            {propertyResults.length > 0 && (
              <CommandPrimitive.Group
                heading="Properties"
                className="px-2 py-1.5 text-xs font-semibold text-muted-foreground"
              >
                {propertyResults.map((p) => (
                  <SearchItem
                    key={p.id}
                    onSelect={() => go(`/property/${p.slug}`)}
                    icon={<Home className="h-4 w-4 text-primary" />}
                    title={p.title}
                    subtitle={`${p.locality}, ${p.city}`}
                  />
                ))}
              </CommandPrimitive.Group>
            )}

            {/* When empty query, show recent + popular + quick links */}
            {!query && (
              <>
                {recent.length > 0 && (
                  <CommandPrimitive.Group
                    heading="Recent searches"
                    className="px-2 py-1.5 text-xs font-semibold text-muted-foreground"
                  >
                    {recent.map((term) => (
                      <SearchItem
                        key={term}
                        onSelect={() => runSearch(term)}
                        icon={<Clock className="h-4 w-4 text-muted-foreground" />}
                        title={term}
                      />
                    ))}
                  </CommandPrimitive.Group>
                )}

                <CommandPrimitive.Group
                  heading="Popular searches"
                  className="px-2 py-1.5 text-xs font-semibold text-muted-foreground"
                >
                  {POPULAR_SEARCHES.slice(0, 6).map((term) => (
                    <SearchItem
                      key={term}
                      onSelect={() => runSearch(term)}
                      icon={<TrendingUp className="h-4 w-4 text-teal-500" />}
                      title={term}
                    />
                  ))}
                </CommandPrimitive.Group>

                <CommandPrimitive.Group
                  heading="Browse cities"
                  className="px-2 py-1.5 text-xs font-semibold text-muted-foreground"
                >
                  {CITY_OPTIONS.slice(0, 5).map((city) => (
                    <SearchItem
                      key={city}
                      onSelect={() => go(`/buy?city=${encodeURIComponent(city)}`)}
                      icon={<MapPin className="h-4 w-4 text-gold-500" />}
                      title={city}
                      subtitle="Explore properties"
                    />
                  ))}
                </CommandPrimitive.Group>

                <CommandPrimitive.Group
                  heading="Browse by type"
                  className="px-2 py-1.5 text-xs font-semibold text-muted-foreground"
                >
                  {PROPERTY_TYPES.slice(0, 5).map((type) => (
                    <SearchItem
                      key={type}
                      onSelect={() => go(`/buy?type=${encodeURIComponent(type)}`)}
                      icon={<Building2 className="h-4 w-4 text-brand-500" />}
                      title={type}
                    />
                  ))}
                </CommandPrimitive.Group>
              </>
            )}

            {query && propertyResults.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-sm text-muted-foreground">
                  No quick matches. Press{" "}
                  <kbd className="rounded bg-muted px-1.5 py-0.5 text-xs font-semibold">
                    Enter
                  </kbd>{" "}
                  for full results.
                </p>
                <button
                  onClick={() => runSearch(query)}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                >
                  Search “{query}” <CornerDownLeft className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </CommandPrimitive.List>

          <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-muted-foreground">
            <div className="flex gap-3">
              <span>
                <kbd className="rounded bg-muted px-1.5 py-0.5">↑↓</kbd> navigate
              </span>
              <span>
                <kbd className="rounded bg-muted px-1.5 py-0.5">↵</kbd> select
              </span>
              <span>
                <kbd className="rounded bg-muted px-1.5 py-0.5">esc</kbd> close
              </span>
            </div>
            <span className="hidden sm:block">Powered by Luxe AI Search</span>
          </div>
        </CommandPrimitive>
      </DialogContent>
    </Dialog>
  );
}

function SearchItem({
  icon,
  title,
  subtitle,
  onSelect,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onSelect: () => void;
}) {
  return (
    <CommandPrimitive.Item
      onSelect={onSelect}
      className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm outline-none data-[selected=true]:bg-accent/10"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate font-medium">{title}</div>
        {subtitle && (
          <div className="truncate text-xs text-muted-foreground">{subtitle}</div>
        )}
      </div>
      <CornerDownLeft className="h-3.5 w-3.5 text-muted-foreground opacity-0 data-[selected=true]:opacity-100" />
    </CommandPrimitive.Item>
  );
}

// ── recent searches (localStorage) ────────────────────────────
const RECENT_KEY = "luxe-recent-searches";
function useRecentSearches() {
  const [items, setItems] = React.useState<string[]>([]);
  React.useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"));
    } catch {
      setItems([]);
    }
  }, []);
  return items;
}
function saveRecent(term: string) {
  try {
    const cur: string[] = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    const next = [term, ...cur.filter((t) => t !== term)].slice(0, 6);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

export { openSearch };
