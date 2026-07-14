"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { cn } from "@/lib/utils";

/**
 * Renders the public site chrome. The site header is shown everywhere
 * (including admin) for a consistent top bar. Footer + mobile bottom
 * nav are hidden on admin routes, which have their own sidebar layout.
 */
export function PublicChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className={cn("flex-1", !isAdmin && "pb-24 md:pb-0")}>{children}</main>
      {!isAdmin && <SiteFooter />}
      {!isAdmin && <MobileNav />}
    </div>
  );
}
