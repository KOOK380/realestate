import type { Metadata } from "next";
import { Bell } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export const metadata: Metadata = { title: "Notifications" };

export default function NotificationsPage() {
  return (
    <div>
      <h2 className="mb-4 font-display text-2xl font-bold">Notifications</h2>
      <EmptyState
        icon={<Bell className="h-8 w-8" />}
        title="You're all caught up"
        description="Price drops, new matches and updates will show here."
      />
    </div>
  );
}
