"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Clock, ArrowRight } from "lucide-react";
import { PropertyCard } from "@/components/property/property-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { useUserStore, type SavedItem } from "@/lib/store/user-store";
import { properties as mockProperties } from "@/lib/data/mock/properties";
import type { Property } from "@/lib/data/types";

type ResolvedItem = { saved: SavedItem; property: Property };

function resolveItems(items: SavedItem[]): ResolvedItem[] {
  const out: ResolvedItem[] = [];
  for (const item of items) {
    const property = mockProperties.find((p) => p.id === item.id);
    if (property) out.push({ saved: item, property });
  }
  return out;
}

export function PropertyGridFromStore({
  items,
  emptyTitle,
  emptyDescription,
  emptyIcon,
}: {
  items: SavedItem[];
  emptyTitle: string;
  emptyDescription: string;
  emptyIcon: "heart" | "clock";
}) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const fullProperties = React.useMemo(() => resolveItems(items), [items]);

  if (!mounted) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton-shimmer aspect-[3/4] rounded-3xl" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={
          emptyIcon === "heart" ? (
            <Heart className="h-8 w-8" />
          ) : (
            <Clock className="h-8 w-8" />
          )
        }
        title={emptyTitle}
        description={emptyDescription}
        action={
          <Button asChild variant="gradient">
            <Link href="/buy">
              Browse properties <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {fullProperties.map(({ property }) => (
        <motion.div
          key={property.id}
          layout
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
        >
          <PropertyCard property={property} />
        </motion.div>
      ))}
    </div>
  );
}

export function SavedGrid() {
  const saved = useUserStore((s) => s.saved);
  return (
    <PropertyGridFromStore
      items={saved}
      emptyTitle="No saved properties yet"
      emptyDescription="Tap the heart on any property to save it here for later."
      emptyIcon="heart"
    />
  );
}

export function RecentlyViewedGrid() {
  const recentlyViewed = useUserStore((s) => s.recentlyViewed);
  return (
    <PropertyGridFromStore
      items={recentlyViewed}
      emptyTitle="Nothing viewed yet"
      emptyDescription="Properties you view will show up here for quick access."
      emptyIcon="clock"
    />
  );
}
