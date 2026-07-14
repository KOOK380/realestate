import type { Metadata } from "next";
import { RecentlyViewedGrid } from "@/components/account/property-grid-from-store";

export const metadata: Metadata = { title: "Recently viewed" };

export default function RecentlyViewedPage() {
  return (
    <div>
      <h2 className="mb-4 font-display text-2xl font-bold">Recently viewed</h2>
      <RecentlyViewedGrid />
    </div>
  );
}
