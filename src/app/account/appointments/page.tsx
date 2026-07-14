import type { Metadata } from "next";
import { CalendarCheck } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = { title: "Appointments" };

export default function AppointmentsPage() {
  return (
    <div>
      <h2 className="mb-4 font-display text-2xl font-bold">Appointments</h2>
      <EmptyState
        icon={<CalendarCheck className="h-8 w-8" />}
        title="No site visits scheduled"
        description="When you book a site visit, it'll appear here with date, time and agent details."
        action={
          <Button asChild variant="gradient">
            <Link href="/buy">Find a property to visit</Link>
          </Button>
        }
      />
    </div>
  );
}
