import type { Metadata } from "next";
import { getReels, getPropertyById } from "@/lib/data";
import { ReelFeed } from "@/components/reels/reel-feed";

export const metadata: Metadata = {
  title: "Property Reels",
  description:
    "Discover homes through immersive vertical video. Like, save, share and tap to explore.",
};

export default async function ReelsPage() {
  const reels = await getReels();
  // Attach property to each reel
  const enriched = await Promise.all(
    reels.map(async (r) => ({
      ...r,
      property: (await getPropertyById(r.propertyId))!,
    }))
  );
  const valid = enriched.filter((r) => r.property);

  return <ReelFeed reels={valid} />;
}
