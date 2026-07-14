"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Video,
  Users,
  Building,
  UserCog,
  Tags,
  MapPin,
  CalendarCheck,
  FileText,
  Megaphone,
  Mail,
  MessageSquare,
  Settings,
  Search,
  Heart,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV_SECTIONS = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Analytics", href: "/admin/analytics", icon: Search },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Properties", href: "/admin/properties", icon: Building2, badge: "48" },
      { label: "Projects", href: "/admin/projects", icon: Building },
      { label: "Reels", href: "/admin/reels", icon: Video, badge: "16" },
      { label: "Blogs", href: "/admin/blogs", icon: FileText },
      { label: "Testimonials", href: "/admin/testimonials", icon: Heart },
    ],
  },
  {
    title: "CRM",
    items: [
      { label: "Leads", href: "/admin/leads", icon: Users, badge: "12" },
      { label: "Appointments", href: "/admin/appointments", icon: CalendarCheck },
      { label: "Messages", href: "/admin/messages", icon: MessageSquare },
    ],
  },
  {
    title: "Taxonomy",
    items: [
      { label: "Developers", href: "/admin/developers", icon: UserCog },
      { label: "Agents", href: "/admin/agents", icon: Users },
      { label: "Categories", href: "/admin/categories", icon: Tags },
      { label: "Locations", href: "/admin/locations", icon: MapPin },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Advertisements", href: "/admin/ads", icon: Megaphone },
      { label: "Notifications", href: "/admin/notifications", icon: Mail },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="hidden h-0 lg:block" />
      <nav className="flex-1 space-y-5 overflow-y-auto p-3">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title}>
            <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {section.title}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                          active ? "bg-white/20" : "bg-muted"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-[1500px] lg:flex">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button className="fixed left-4 top-[4.75rem] z-30 flex items-center gap-2 rounded-full bg-background px-4 py-2.5 text-sm font-semibold shadow-card">
              <Menu className="h-4 w-4" /> Menu
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0" hideClose>
            <div className="flex h-full flex-col">
              <div className="flex h-16 items-center gap-2 border-b border-border px-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-accent">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div className="font-display text-sm font-bold">Luxe Admin</div>
              </div>
              {SidebarContent}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar — sits below the site header */}
      <aside className="sticky top-20 hidden h-[calc(100vh-5rem)] w-64 shrink-0 overflow-y-auto rounded-3xl border border-border bg-card/40 lg:block">
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-accent">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <span className="font-display text-sm font-bold">Luxe Admin</span>
          </div>
        </div>
        {SidebarContent}
      </aside>

      {/* Main content */}
      <main className="min-w-0 flex-1 px-4 pb-12 pt-20 lg:px-8 lg:pt-8">
        {children}
      </main>
    </div>
  );
}
