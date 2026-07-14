import type { Metadata } from "next";
import { getProperties, getInvestmentOpportunities } from "@/lib/data";
import { PropertyListingWrapper } from "@/components/property/property-listing-suspense";
import { InvestHero } from "@/components/property/invest-hero";

export const metadata: Metadata = {
  title: "Invest in Real Estate",
  description:
    "Data-driven real estate investments with strong rental yields and capital appreciation.",
};

export default async function InvestPage() {
  const [{ items }, opportunities] = await Promise.all([
    getProperties({ transactionType: "Invest" }),
    getInvestmentOpportunities(),
  ]);

  return (
    <>
      <InvestHero opportunities={opportunities} />
      <PropertyListingWrapper
        title="Investment properties"
        description="High-yield, high-appreciation picks backed by data."
        items={items}
        transactionType="Invest"
      />
    </>
  );
}
