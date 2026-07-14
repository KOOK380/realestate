import type { Metadata } from "next";
import { SavedGrid } from "@/components/account/property-grid-from-store";

export const metadata: Metadata = { title: "Saved properties" };

export default function SavedPage() {
  return (
    <div>
      <h2 className="mb-4 font-display text-2xl font-bold">Saved properties</h2>
      <SavedGrid />
    </div>
  );
}
