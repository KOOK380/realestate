import type { Metadata } from "next";
import { getProperties } from "@/lib/data";
import { PropertyListingWrapper } from "@/components/property/property-listing-suspense";

export const metadata: Metadata = {
  title: "Buy Properties",
  description:
    "Browse verified properties for sale — apartments, villas, plots and commercial spaces across India and Dubai.",
};

export default async function BuyPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const { items } = await getProperties({
    transactionType: "Buy",
    type: type && type !== "Commercial" ? type : undefined,
  });
  // Include commercial when explicitly requested
  const commercial = await getProperties({ transactionType: "Commercial" });
  const allItems =
    type === "Commercial" ? commercial.items : [...items, ...commercial.items.filter((c) => c.transactionType === "Buy")];

  return (
    <PropertyListingWrapper
      title="Buy a property"
      description="Discover verified homes, plots and commercial spaces for sale."
      items={allItems}
      transactionType="Buy"
    />
  );
}
