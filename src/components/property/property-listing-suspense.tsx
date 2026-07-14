"use client";

import * as React from "react";
import { PropertyListing } from "@/components/property/property-listing";
import type { Property, TransactionType } from "@/lib/data/types";

/**
 * Wraps PropertyListing in a Suspense boundary so useSearchParams()
 * (used for URL-driven filters) is valid during static prerender.
 */
export function PropertyListingWrapper(
  props: React.ComponentProps<typeof PropertyListing>
) {
  return (
    <React.Suspense
      fallback={
        <div className="container-luxe py-8">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton-shimmer aspect-[3/4] rounded-3xl" />
            ))}
          </div>
        </div>
      }
    >
      <PropertyListing {...props} />
    </React.Suspense>
  );
}
