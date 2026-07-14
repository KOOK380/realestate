"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Share2,
  Phone,
  MessageCircle,
  CalendarCheck,
  Download,
  Bookmark,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { SITE } from "@/lib/constants";
import { useUserStore } from "@/lib/store/user-store";
import type { Property } from "@/lib/data/types";

export function SaveShareBar({ property }: { property: Property }) {
  const toggleSave = useUserStore((s) => s.toggleSave);
  const saved = useUserStore((s) => s.saved.some((x) => x.id === property.id));

  const handleSave = () => {
    toggleSave({
      id: property.id,
      title: property.title,
      image: property.images[0],
      price: property.price,
      city: property.city,
      savedAt: "",
    });
    toast(saved ? "Removed from saved" : "Saved! ❤️", { description: property.title });
  };

  const handleShare = async () => {
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

  const handleBrochure = () => {
    toast.success("Brochure downloading…", {
      description: `${property.title}.pdf will be ready in a moment.`,
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={saved ? "gold" : "outline"}
        size="lg"
        onClick={handleSave}
        className="flex-1 sm:flex-none"
      >
        <Heart className={cn("h-5 w-5", saved && "fill-current")} />
        {saved ? "Saved" : "Save"}
      </Button>
      <Button variant="outline" size="lg" onClick={handleShare}>
        <Share2 className="h-5 w-5" />
        <span className="hidden sm:inline">Share</span>
      </Button>
      <Button variant="outline" size="lg" onClick={handleBrochure}>
        <Download className="h-5 w-5" />
        <span className="hidden sm:inline">Brochure</span>
      </Button>
    </div>
  );
}

/** Sticky bottom CTA bar on mobile */
export function StickyPropertyActions({ property }: { property: Property }) {
  const toggleSave = useUserStore((s) => s.toggleSave);
  const saved = useUserStore((s) => s.saved.some((x) => x.id === property.id));
  const [open, setOpen] = React.useState(false);

  const handleSave = () => {
    toggleSave({
      id: property.id,
      title: property.title,
      image: property.images[0],
      price: property.price,
      city: property.city,
      savedAt: "",
    });
  };

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 p-3 backdrop-blur-xl md:hidden safe-bottom"
    >
      <div className="flex items-center gap-2">
        <button
          onClick={handleSave}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border"
          aria-label="Save"
        >
          <Heart className={cn("h-5 w-5", saved && "fill-red-500 text-red-500")} />
        </button>
        <a
          href={`https://wa.me/${SITE.whatsappHref}`}
          target="_blank"
          rel="noreferrer"
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-teal-500 text-sm font-semibold text-white"
        >
          <MessageCircle className="h-5 w-5" /> WhatsApp
        </a>
        <a
          href={`tel:${SITE.supportPhoneHref}`}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground"
        >
          <Phone className="h-5 w-5" /> Call
        </a>
      </div>
    </motion.div>
  );
}
