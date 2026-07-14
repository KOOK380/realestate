"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Heart,
  Clock,
  CalendarCheck,
  Bell,
  Settings,
  MessageSquare,
  LogOut,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSession, useUserStore } from "@/lib/store/user-store";
import { AuthModal } from "@/components/auth/auth-modal";

const NAV = [
  { label: "Profile", href: "/account", icon: User },
  { label: "Saved", href: "/account/saved", icon: Heart },
  { label: "Recently viewed", href: "/account/recently-viewed", icon: Clock },
  { label: "Appointments", href: "/account/appointments", icon: CalendarCheck },
  { label: "Messages", href: "/account/messages", icon: MessageSquare },
  { label: "Notifications", href: "/account/notifications", icon: Bell },
  { label: "Settings", href: "/account/settings", icon: Settings },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, signOut } = useSession();
  const savedCount = useUserStore((s) => s.saved.length);
  const [authOpen, setAuthOpen] = React.useState(false);

  return (
    <div className="container-luxe py-8">
      <h1 className="mb-6 font-display text-3xl font-bold">My Account</h1>

      {!user && (
        <Card className="mb-6 flex flex-col items-center gap-3 p-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="font-display text-xl font-bold">Sign in to access your account</h2>
            <p className="text-sm text-muted-foreground">
              Save properties, track visits and get personalised recommendations.
            </p>
          </div>
          <Button variant="gradient" onClick={() => setAuthOpen(true)}>
            Sign in
          </Button>
          <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="space-y-3">
          {user && (
            <Card className="flex items-center gap-3 p-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="truncate font-semibold">{user.name}</div>
                <div className="truncate text-xs text-muted-foreground">{user.email}</div>
              </div>
            </Card>
          )}
          <nav className="space-y-1">
            {NAV.map((item) => {
              const active =
                item.href === "/account"
                  ? pathname === "/account"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                  {item.label === "Saved" && savedCount > 0 && (
                    <span className="ml-auto rounded-full bg-gold px-2 py-0.5 text-xs font-bold text-white">
                      {savedCount}
                    </span>
                  )}
                </Link>
              );
            })}
            <Link
              href="/admin"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Building2 className="h-4 w-4" /> Admin panel
            </Link>
            {user && (
              <button
                onClick={signOut}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            )}
          </nav>
        </aside>

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
}
