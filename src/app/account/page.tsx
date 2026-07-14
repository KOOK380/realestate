"use client";

import * as React from "react";
import Link from "next/link";
import {
  Heart,
  Clock,
  CalendarCheck,
  Bell,
  TrendingUp,
  Search,
  Edit3,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useSession, useUserStore } from "@/lib/store/user-store";

export default function ProfilePage() {
  const { user } = useSession();
  const saved = useUserStore((s) => s.saved.length);
  const viewed = useUserStore((s) => s.recentlyViewed.length);
  const followedBuilders = useUserStore((s) => s.followBuilders.length);

  const stats = [
    { label: "Saved", value: saved, icon: Heart, href: "/account/saved" },
    { label: "Viewed", value: viewed, icon: Clock, href: "/account/recently-viewed" },
    { label: "Visits", value: 0, icon: CalendarCheck, href: "/account/appointments" },
    { label: "Following", value: followedBuilders, icon: TrendingUp, href: "#" },
  ];

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-luxe" />
        <div className="px-6 pb-6">
          <div className="-mt-10 flex items-end justify-between">
            <Avatar className="h-20 w-20 ring-4 ring-background">
              {user ? (
                <>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                </>
              ) : (
                <AvatarFallback>GU</AvatarFallback>
              )}
            </Avatar>
            <Button variant="outline" size="sm">
              <Edit3 className="h-4 w-4" /> Edit
            </Button>
          </div>
          <h2 className="mt-3 font-display text-2xl font-bold">
            {user?.name ?? "Guest user"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {user?.email ?? "Sign in to personalise your experience"}
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} href={s.href}>
              <Card className="p-4 transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="mt-2 font-display text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card className="p-6">
        <h3 className="font-display text-lg font-bold">Recommended for you</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Based on your activity, we think you'll love these.
        </p>
        <div className="mt-4">
          <Button asChild variant="gradient">
            <Link href="/buy">
              <Search className="h-4 w-4" /> Explore homes
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
