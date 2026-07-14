"use client";

import Link from "next/link";
import { ArrowLeft, Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";

/** Placeholder for admin modules scaffolded in this phase. */
export function AdminComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button variant="gradient" size="sm" disabled>
          Add new
        </Button>
      </div>
      <EmptyState
        icon={<Construction className="h-8 w-8" />}
        title="Module scaffolded — full CRUD in the next phase"
        description="This admin module's schema, routes and navigation are ready. The interactive table, forms and API actions are part of the backend phase."
        action={
          <Button asChild variant="outline">
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4" /> Back to dashboard
            </Link>
          </Button>
        }
      />
    </div>
  );
}
