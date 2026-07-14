"use client";

import * as React from "react";
import { useUserStore } from "@/lib/store/user-store";
import type { Property } from "@/lib/data/types";

/** Adds the given property to the user's recently-viewed list on mount. */
export function RecentlyViewedTracker({ property }: { property: Property }) {
  const addRecentlyViewed = useUserStore((s) => s.addRecentlyViewed);
  React.useEffect(() => {
    addRecentlyViewed({
      id: property.id,
      title: property.title,
      image: property.images[0],
      price: property.price,
      city: property.city,
      savedAt: "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [property.id]);
  return null;
}
