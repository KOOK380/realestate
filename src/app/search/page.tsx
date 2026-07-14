import type { Metadata } from "next";
import { getProperties } from "@/lib/data";
import { PropertyListingWrapper } from "@/components/property/property-listing-suspense";

export const metadata: Metadata = { title: "Search results" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const { items } = await getProperties({ query: q });

  return (
    <PropertyListingWrapper
      title={q ? `Results for "${q}"` : "Search properties"}
      description={`${items.length} ${items.length === 1 ? "property" : "properties"} found`}
      items={items}
      transactionType="Buy"
    />
  );
}
