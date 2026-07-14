"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Heart,
  Menu,
  Building2,
  Moon,
  Sun,
  User,
  LogOut,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { useSession, useUserStore } from "@/lib/store/user-store";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { openSearch } from "@/components/search/search-store";
import { AuthModal } from "@/components/auth/auth-modal";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const { user, signOut } = useSession();
  const savedCount = useUserStore((s) => s.saved.length);
  const [authOpen, setAuthOpen] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Don't render the public header on the reels page (it's fullscreen)
  const isReels = pathname === "/reels";
  if (isReels) return null;

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-xl transition-all duration-300",
          scrolled && "shadow-card"
        )}
      >
        <div className="container-luxe flex h-16 items-center justify-between gap-4 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-accent shadow-glow">
              <Building2 className="h-5 w-5 text-white" />
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-gold ring-2 ring-background" />
            </div>
            <div className="hidden sm:block leading-none">
              <span className="font-display text-lg font-bold tracking-tight">
                Luxe
              </span>
              <span className="font-display text-lg font-bold text-gradient">
                Estates
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-full bg-primary/10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {link.featured && (
                    <Sparkles className="ml-1 inline h-3.5 w-3.5 text-gold" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Search trigger */}
            <button
              onClick={openSearch}
              className="hidden sm:flex h-11 items-center gap-3 rounded-full border border-border bg-background/60 px-4 text-sm text-muted-foreground backdrop-blur transition-colors hover:border-primary/40 hover:text-foreground w-56 lg:w-64"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
              <span className="flex-1 text-left">Search properties…</span>
              <kbd className="hidden lg:inline rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold">
                ⌘K
              </kbd>
            </button>

            <button
              onClick={openSearch}
              className="sm:hidden inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {mounted && theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Saved */}
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="relative"
              aria-label="Saved properties"
            >
              <Link href="/account/saved">
                <Heart className="h-5 w-5" />
                {savedCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-white">
                    {savedCount}
                  </span>
                )}
              </Link>
            </Button>

            {/* Auth */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <Avatar className="h-10 w-10 ring-2 ring-background">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>
                        {user.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60">
                  <div className="flex items-center gap-3 p-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>
                        {user.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">
                        {user.name}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account">
                      <User className="mr-2 h-4 w-4" /> My Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/saved">
                      <Heart className="mr-2 h-4 w-4" /> Saved
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/appointments">
                      <LayoutDashboard className="mr-2 h-4 w-4" /> Appointments
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <LayoutDashboard className="mr-2 h-4 w-4" /> Admin
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:block">
                <Button variant="gradient" size="sm" onClick={() => setAuthOpen(true)}>
                  Sign in
                </Button>
              </div>
            )}

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[360px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-accent">
                      <Building2 className="h-4 w-4 text-white" />
                    </div>
                    {SITE.name}
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-4 flex flex-col gap-1 px-4">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "rounded-xl px-4 py-3 text-base font-semibold transition-colors",
                        pathname === link.href
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted"
                      )}
                    >
                      {link.label}
                      {link.featured && (
                        <Badge variant="gold" className="ml-2">
                          Hot
                        </Badge>
                      )}
                    </Link>
                  ))}
                  <div className="my-3 h-px bg-border" />
                  {!user && (
                    <Button
                      variant="gradient"
                      className="mt-2 w-full"
                      onClick={() => setAuthOpen(true)}
                    >
                      Sign in
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
}
