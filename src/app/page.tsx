import { getHomeData } from "@/lib/data";
import { HERO_VIDEO } from "@/lib/data/images";
import { Hero } from "@/components/home/hero";
import {
  TrendingSection,
  CategoryGrid,
  PropertyRow,
  ReelsPreview,
  InvestmentSection,
  FeaturedSection,
  BuildersSection,
  CitiesSection,
  TestimonialsSection,
  BlogsSection,
  StatsBanner,
  FinalCTA,
} from "@/components/home/sections";

export default async function HomePage() {
  const data = await getHomeData();

  // Attach property to each reel for the preview
  const reelsWithProperty = data.latestReels.map((r) => ({
    ...r,
    property: data.trendingProperties.find((p) => p.id === r.propertyId),
  }));

  return (
    <>
      <Hero heroVideo={HERO_VIDEO} />

      <TrendingSection items={data.trendingProperties} />

      <CategoryGrid />

      <PropertyRow
        eyebrow="🏖️ Lifestyle"
        title="Luxury villas"
        description="Sprawling, private and absolutely beautiful."
        items={data.luxuryVillas}
        href="/buy?type=Villa"
      />

      <ReelsPreview reels={reelsWithProperty} />

      <PropertyRow
        eyebrow="🏙️ City living"
        title="Premium apartments"
        description="Smart, central and move-in ready."
        items={data.apartments}
        href="/buy?type=Apartment"
        tinted
      />

      <InvestmentSection items={data.investments} />

      <FeaturedSection items={data.featured} />

      <PropertyRow
        eyebrow="📐 Build your own"
        title="Plots & land"
        description="Clear-title plots in fast-appreciating corridors."
        items={data.plots}
        href="/buy?type=Plot"
        tinted
      />

      <StatsBanner />

      <BuildersSection items={data.builders} />

      <CitiesSection items={data.cities} />

      <TestimonialsSection items={data.testimonials} />

      <BlogsSection items={data.blogs} />

      <FinalCTA />
    </>
  );
}
