"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  BedDouble,
  Bath,
  Maximize,
  MapPin,
  Heart,
  Share2,
  Phone,
  MessageCircle,
  BadgeCheck,
  Star,
  Video,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import type { Property } from "@/lib/data/types";
import { cn, formatPrice, formatArea, formatRent } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useUserStore } from "@/lib/store/user-store";
import { toast } from "sonner";
import { SITE } from "@/lib/constants";

interface PropertyCardProps {
  property: Property;
  variant?: "default" | "compact" | "wide";
  className?: string;
  priority?: boolean;
}

export function PropertyCard({
  property,
  variant = "default",
  className,
  priority,
}: PropertyCardProps) {
  const [imgIndex, setImgIndex] = React.useState(0);
  const toggleSave = useUserStore((s) => s.toggleSave);
  const saved = useUserStore((s) => s.saved.some((x) => x.id === property.id));
  const [hovered, setHovered] = React.useState(false);

  const isRent = property.transactionType === "Rent";

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave({
      id: property.id,
      title: property.title,
      image: property.images[0],
      price: property.price,
      city: property.city,
      savedAt: "",
    });
    toast(saved ? "Removed from saved" : "Saved! ❤️", {
      description: property.title,
    });
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${SITE.url}/property/${property.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: property.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied!");
      }
    } catch {
      /* cancelled */
    }
  };

  const nextImg = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((i) => (i + 1) % property.images.length);
  };
  const prevImg = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((i) => (i - 1 + property.images.length) % property.images.length);
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className={cn("group relative", className)}
    >
      <Link href={`/property/${property.slug}`} className="block">
        <article className="overflow-hidden rounded-3xl border border-black/5 bg-card shadow-card transition-shadow group-hover:shadow-card-hover">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={property.images[imgIndex]}
              alt={property.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={priority}
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent" />

            {/* Top badges */}
            <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
              {property.verified && (
                <Badge variant="dark" className="bg-emerald-600/90">
                  <BadgeCheck className="h-3 w-3" /> Verified
                </Badge>
              )}
              {property.featured && (
                <Badge variant="gold">★ Featured</Badge>
              )}
              {property.trending && (
                <Badge variant="dark">🔥 Trending</Badge>
              )}
            </div>

            {/* Save + Share */}
            <div className="absolute right-3 top-3 flex gap-1.5">
              <button
                onClick={handleSave}
                aria-label="Save"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur transition-transform hover:scale-110 active:scale-90"
              >
                <Heart
                  className={cn(
                    "h-4 w-4 transition-colors",
                    saved ? "fill-red-500 text-red-500" : "text-ink-900"
                  )}
                />
              </button>
              <button
                onClick={handleShare}
                aria-label="Share"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur transition-transform hover:scale-110 active:scale-90"
              >
                <Share2 className="h-4 w-4 text-ink-900" />
              </button>
            </div>

            {/* Image dots + nav */}
            {property.images.length > 1 && (
              <>
                {hovered && (
                  <>
                    <button
                      onClick={prevImg}
                      aria-label="Previous image"
                      className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={nextImg}
                      aria-label="Next image"
                      className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </>
                )}
                <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
                  {property.images.slice(0, 6).map((_, i) => (
                    <span
                      key={i}
                      className={cn(
                        "h-1.5 rounded-full transition-all",
                        i === imgIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"
                      )}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Video badge */}
            {property.videoUrl && (
              <div className="absolute bottom-3 right-3">
                <Badge variant="glass" className="bg-ink-950/60">
                  <Video className="h-3 w-3" /> Tour
                </Badge>
              </div>
            )}

            {/* Price */}
            <div className="absolute bottom-3 left-3">
              <div className="rounded-xl bg-ink-950/70 px-2.5 py-1 backdrop-blur">
                <span className="font-display text-lg font-bold text-white">
                  {isRent ? formatRent(property.rentMonthly ?? property.price) : formatPrice(property.price)}
                </span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate font-display text-lg font-bold leading-tight">
                  {property.title}
                </h3>
                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 shrink-0 text-primary/70" />
                  <span className="truncate">
                    {property.locality}, {property.city}
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1 rounded-full bg-gold/10 px-2 py-1 text-xs font-bold text-gold-600">
                <Star className="h-3 w-3 fill-gold-500 text-gold-500" />
                {property.rating}
              </div>
            </div>

            {/* Specs */}
            {property.beds > 0 && (
              <div className="mt-3 flex items-center gap-1 rounded-2xl bg-muted/50 p-2 text-xs font-medium text-foreground/80">
                <Spec icon={<BedDouble className="h-3.5 w-3.5" />} value={`${property.beds} Beds`} />
                <span className="h-3 w-px bg-border" />
                <Spec icon={<Bath className="h-3.5 w-3.5" />} value={`${property.baths} Baths`} />
                <span className="h-3 w-px bg-border" />
                <Spec icon={<Maximize className="h-3.5 w-3.5" />} value={formatArea(property.area)} />
              </div>
            )}

            {/* Type + possession */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <Badge variant="accent">{property.type}</Badge>
              {property.possession && (
                <Badge variant="outline" className="text-[10px]">
                  {property.possession}
                </Badge>
              )}
            </div>

            {/* Price per sqft */}
            {property.pricePerSqft && (
              <div className="mt-2 text-[11px] text-muted-foreground">
                ₹{property.pricePerSqft.toLocaleString("en-IN")} / sq.ft
              </div>
            )}
          </div>

          {/* Quick actions (CTA strip) */}
          <div className="flex items-center gap-2 border-t border-border px-3.5 py-3">
            <a
              href={`https://wa.me/${SITE.whatsappHref}?text=${encodeURIComponent(
                `Hi, I'm interested in ${property.title} at ${property.locality}.`
              )}`}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label="WhatsApp"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-700 transition-all hover:bg-teal-500 hover:text-white active:scale-95 dark:text-teal-300"
            >
              <MessageCircle className="h-[1.1rem] w-[1.1rem]" />
            </a>
            <a
              href={`tel:${SITE.supportPhoneHref}`}
              onClick={(e) => e.stopPropagation()}
              aria-label="Call"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all hover:bg-primary hover:text-primary-foreground active:scale-95"
            >
              <Phone className="h-[1.1rem] w-[1.1rem]" />
            </a>
            <span className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-ink-900 text-xs font-semibold text-white transition-colors group-hover:bg-gradient-accent">
              View details
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}

function Spec({ icon, value }: { icon: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1">
      {icon}
      <span className="font-medium text-foreground/80">{value}</span>
    </div>
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-black/5 bg-card">
      <div className="skeleton-shimmer aspect-[4/3] rounded-none" />
      <div className="space-y-3 p-4">
        <div className="skeleton-shimmer h-5 w-3/4 rounded-lg" />
        <div className="skeleton-shimmer h-3 w-1/2 rounded-lg" />
        <div className="flex gap-2">
          <div className="skeleton-shimmer h-5 w-16 rounded-full" />
          <div className="skeleton-shimmer h-5 w-12 rounded-full" />
        </div>
        <div className="skeleton-shimmer h-8 rounded-xl" />
      </div>
    </div>
  );
}
