import type { Metadata } from "next";
import { MessageSquare } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export const metadata: Metadata = { title: "Messages" };

export default function MessagesPage() {
  return (
    <div>
      <h2 className="mb-4 font-display text-2xl font-bold">Messages</h2>
      <EmptyState
        icon={<MessageSquare className="h-8 w-8" />}
        title="No messages yet"
        description="When you message an agent or builder, conversations will appear here."
      />
    </div>
  );
}
