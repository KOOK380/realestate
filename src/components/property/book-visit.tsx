"use client";

import * as React from "react";
import { CalendarCheck, CheckCircle2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { Property } from "@/lib/data/types";

export function BookVisit({
  property,
  triggerVariant = "default",
}: {
  property: Property;
  triggerVariant?: "default" | "gradient";
}) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [done, setDone] = React.useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setDone(true);
    toast.success("Site visit requested!", {
      description: "Our agent will call you to confirm within 30 minutes.",
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setTimeout(() => setDone(false), 300);
      }}
    >
      <DialogTrigger asChild>
        <Button variant={triggerVariant} size="lg" className="w-full sm:w-auto">
          <CalendarCheck className="h-5 w-5" />
          Book a site visit
        </Button>
      </DialogTrigger>
      <DialogContent>
        {done ? (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle2 className="h-9 w-9 text-emerald-500" />
            </div>
            <h3 className="mt-4 font-display text-xl font-bold">You're booked! 🎉</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              A visit for <span className="font-semibold">{property.title}</span> has
              been requested. We'll confirm shortly.
            </p>
            <Button className="mt-6" onClick={() => setOpen(false)}>
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Book a site visit</DialogTitle>
              <DialogDescription>
                {property.title} · {property.locality}, {property.city}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={submit} className="mt-4 space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="bv-name">Full name</Label>
                <Input id="bv-name" required placeholder="Jane Doe" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="bv-phone">Phone</Label>
                  <Input id="bv-phone" type="tel" required placeholder="+91 98765 43210" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="bv-email">Email</Label>
                  <Input id="bv-email" type="email" required placeholder="you@email.com" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bv-date">Preferred date</Label>
                <Input id="bv-date" type="date" required />
              </div>
              <Button type="submit" variant="gradient" className="w-full" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>Confirm visit</>
                )}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                No charges · Free cancellation · Agent will confirm timing
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
