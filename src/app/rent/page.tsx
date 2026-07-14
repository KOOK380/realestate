import type { Metadata } from "next";
import { getProperties } from "@/lib/data";
import { PropertyListingWrapper } from "@/components/property/property-listing-suspense";

export const metadata: Metadata = {
  title: "Rent Properties",
  description:
    "Find homes and apartments for rent — furnished, semi-furnished and unfurnished options across top cities.",
};

export default async function RentPage() {
  const { items } = await getProperties({ transactionType: "Rent" });

  return (
    <PropertyListingWrapper
      title="Rent a property"
      description="Find your next home — apartments, villas and studios for rent."
      items={items}
      transactionType="Rent"
    />
  );
}
