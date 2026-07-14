"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Building2,
  KeyRound,
  TrendingUp,
  Video,
  Heart,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Left and right groups split around the floating Reels button.
const LEFT = [
  { label: "Home", href: "/", icon: Home },
  { label: "Buy", href: "/buy", icon: Building2 },
  { label: "Rent", href: "/rent", icon: KeyRound },
];
const RIGHT = [
  { label: "Invest", href: "/invest", icon: TrendingUp },
  { label: "Saved", href: "/account/saved", icon: Heart },
  { label: "Account", href: "/account", icon: User },
];

type NavItem = (typeof LEFT)[number];

export function MobileNav() {
  const pathname = usePathname();

  // Hide on the fullscreen reels experience for immersion.
  if (pathname === "/reels") return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 md:hidden">
      {/* Floating Reels button — centered, sits above the bar */}
      <Link
        href="/reels"
        aria-label="Reels"
        className="absolute left-1/2 -top-6 z-10 -translate-x-1/2"
      >
        <motion.div
          initial={{ scale: 0, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-accent shadow-float ring-[5px] ring-background"
        >
          <span className="absolute inset-0 rounded-full bg-gradient-accent opacity-50 animate-pulse-ring" />
          <Video className="relative h-6 w-6 text-white" />
        </motion.div>
        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-white/80">
          Reels
        </span>
      </Link>

      {/* Glass bar */}
      <nav className="glass-dark mx-2 mb-2 flex items-center justify-between rounded-[1.75rem] px-2 py-1.5 safe-bottom">
        <div className="flex flex-1 items-center justify-around">
          {LEFT.map((item) => (
            <NavItemButton
              key={item.href}
              item={item}
              active={isActive(pathname, item.href)}
            />
          ))}
        </div>

        {/* Reels spacer — matches the floating button width */}
        <div className="w-14 shrink-0" aria-hidden />

        <div className="flex flex-1 items-center justify-around">
          {RIGHT.map((item) => (
            <NavItemButton
              key={item.href}
              item={item}
              active={isActive(pathname, item.href)}
            />
          ))}
        </div>
      </nav>
    </div>
  );
}

function NavItemButton({
  item,
  active,
}: {
  item: NavItem;
  active: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className="group flex min-w-[3.25rem] flex-1 flex-col items-center gap-1 rounded-2xl px-1 py-1.5 transition-colors"
      style={{ maxWidth: "4.5rem" }}
    >
      <span
        className={cn(
          "relative flex h-7 w-7 items-center justify-center transition-all duration-300",
          active && "scale-110"
        )}
      >
        {/* active pill behind icon */}
        {active && (
          <motion.span
            layoutId="mobile-nav-active"
            className="absolute inset-0 rounded-full bg-white/15"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
        <Icon
          className={cn(
            "relative h-[1.15rem] w-[1.15rem] transition-colors",
            active ? "text-white" : "text-white/55 group-hover:text-white/80"
          )}
          strokeWidth={active ? 2.4 : 2}
        />
      </span>
      <span
        className={cn(
          "text-[10px] leading-none transition-colors",
          active ? "font-bold text-white" : "font-medium text-white/55 group-hover:text-white/80"
        )}
      >
        {item.label}
      </span>
    </Link>
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}
