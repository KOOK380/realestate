"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Music2,
  Volume2,
  VolumeX,
  Play,
  ArrowLeft,
  Send,
  Flag,
  Phone,
  BedDouble,
  Bath,
  Maximize,
  MapPin,
  ChevronUp,
  UserPlus,
  BadgeCheck,
} from "lucide-react";
import { cn, formatPrice, formatRent, formatNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUserStore } from "@/lib/store/user-store";
import { toast } from "sonner";
import { SITE } from "@/lib/constants";
import type { Property, Reel } from "@/lib/data/types";

interface ReelFeedProps {
  reels: (Reel & { property: Property })[];
}

export function ReelFeed({ reels }: ReelFeedProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [muted, setMuted] = React.useState(true);
  const [commentsOpenFor, setCommentsOpenFor] = React.useState<string | null>(null);

  // Track which reel is in view via IntersectionObserver
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const items = Array.from(container.querySelectorAll<HTMLElement>("[data-reel]"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            const idx = Number(entry.target.getAttribute("data-index"));
            setActiveIndex(idx);
          }
        });
      },
      { root: container, threshold: [0.6, 0.9] }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [reels.length]);

  return (
    <div className="fixed inset-0 z-50 bg-ink-950">
      {/* Top bar */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between p-4 pt-6">
        <Link
          href="/"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant="glass" className="bg-white/10 text-white">
            Reels
          </Badge>
        </div>
        <button
          onClick={() => setMuted((m) => !m)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
      </div>

      {/* Snap-scroll feed */}
      <div
        ref={containerRef}
        className="reels-snap h-[100dvh] w-full overflow-y-scroll"
      >
        {reels.map((reel, i) => (
          <ReelItem
            key={reel.id}
            reel={reel}
            index={i}
            active={i === activeIndex}
            muted={muted}
            onOpenComments={() => setCommentsOpenFor(reel.id)}
          />
        ))}
        {/* End state */}
        <div className="flex h-[100dvh] flex-col items-center justify-center gap-4 text-center text-white">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-accent">
            <Play className="h-10 w-10" />
          </div>
          <h3 className="font-display text-2xl font-bold">You're all caught up!</h3>
          <p className="text-white/60">Check back soon for fresh property reels.</p>
          <Button asChild variant="gradient" size="lg">
            <Link href="/">Explore more homes</Link>
          </Button>
        </div>
      </div>

      {/* Comments dialog */}
      <CommentsDialog
        reel={reels.find((r) => r.id === commentsOpenFor) ?? null}
        open={!!commentsOpenFor}
        onOpenChange={(o) => !o && setCommentsOpenFor(null)}
      />
    </div>
  );
}

function ReelItem({
  reel,
  index,
  active,
  muted,
  onOpenComments,
}: {
  reel: Reel & { property: Property };
  index: number;
  active: boolean;
  muted: boolean;
  onOpenComments: () => void;
}) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = React.useState(false);
  const [showHeart, setShowHeart] = React.useState(false);

  const liked = useUserStore((s) => s.isReelLiked(reel.id));
  const saved = useUserStore((s) => s.isReelSaved(reel.id));
  const toggleLike = useUserStore((s) => s.toggleLikeReel);
  const toggleSave = useUserStore((s) => s.toggleSaveReel);
  const followBuilder = useUserStore((s) => s.followBuilders);
  const toggleFollow = useUserStore((s) => s.toggleFollowBuilder);
  const isFollowing = followBuilder.includes(reel.property.builderId ?? "");

  // Autoplay / pause based on visibility
  React.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (active) {
      v.currentTime = 0;
      v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      v.pause();
      setPlaying(false);
    }
  }, [active]);

  React.useEffect(() => {
    const v = videoRef.current;
    if (v) v.muted = muted;
  }, [muted]);

  const handleLike = () => {
    toggleLike(reel.id);
    if (!liked) {
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 800);
    }
  };

  const handleDoubleTap = () => {
    if (!liked) toggleLike(reel.id);
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  const handleShare = async () => {
    const url = `${SITE.url}/property/${reel.property.slug}`;
    try {
      if (navigator.share) await navigator.share({ title: reel.caption, url });
      else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied!");
      }
    } catch {
      /* cancelled */
    }
  };

  const toggleVideo = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <div
      data-reel
      data-index={index}
      className="relative h-[100dvh] w-full snap-start"
    >
      {/* Video */}
      <div
        className="absolute inset-0 flex items-center justify-center bg-ink-950"
        onDoubleClick={handleDoubleTap}
        onClick={toggleVideo}
      >
        <video
          ref={videoRef}
          src={reel.videoUrl}
          poster={reel.poster}
          loop
          muted={muted}
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
        />
        {/* gradient overlays */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink-950/40 via-transparent to-ink-950/70" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink-950/50 to-transparent" />

        {/* Paused indicator */}
        {!playing && active && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/40 backdrop-blur">
              <Play className="h-8 w-8 text-white" />
            </div>
          </div>
        )}

        {/* Heart animation */}
        <AnimatePresence>
          {showHeart && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              exit={{ scale: 1.4, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
              <Heart className="h-24 w-24 fill-red-500 text-red-500 drop-shadow-lg" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right action rail */}
      <div className="absolute bottom-28 right-3 z-10 flex flex-col items-center gap-5 sm:bottom-32">
        <ActionButton
          onClick={handleLike}
          icon={<Heart className={cn("h-7 w-7", liked && "fill-red-500 text-red-500")} />}
          label={formatNumber(reel.likes + (liked ? 1 : 0))}
        />
        <ActionButton
          onClick={onOpenComments}
          icon={<MessageCircle className="h-7 w-7" />}
          label={formatNumber(reel.comments.length)}
        />
        <ActionButton
          onClick={handleShare}
          icon={<Share2 className="h-7 w-7" />}
          label={formatNumber(reel.shares)}
        />
        <ActionButton
          onClick={() => {
            toggleSave(reel.id);
            toast(saved ? "Removed" : "Reel saved! 🔖");
          }}
          icon={<Bookmark className={cn("h-7 w-7", saved && "fill-gold-500 text-gold-500")} />}
          label={formatNumber(reel.saves + (saved ? 1 : 0))}
        />
        <button
          onClick={() => toast("Report submitted", { description: "Thanks for keeping Luxe safe." })}
          className="text-white/80 transition-colors hover:text-white"
          aria-label="Report"
        >
          <MoreHorizontal className="h-7 w-7" />
        </button>
        {/* rotating music disc */}
        <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/40 bg-ink-950/50">
          <Music2 className="h-4 w-4 text-white" />
        </div>
      </div>

      {/* Bottom-left info */}
      <div className="absolute bottom-28 left-4 right-20 z-10 text-white sm:bottom-32 sm:left-8 sm:right-24">
        {/* Builder row */}
        <div className="mb-3 flex items-center gap-2">
          <Avatar className="h-9 w-9 ring-2 ring-white/30">
            <AvatarImage src={reel.property.images[0]} alt={reel.property.title} />
            <AvatarFallback>{reel.property.title.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-1 text-sm font-bold">
              {reel.property.title}
              <BadgeCheck className="h-3.5 w-3.5 text-teal-400" />
            </div>
            <div className="text-xs text-white/70">{reel.property.locality}, {reel.property.city}</div>
          </div>
          <button
            onClick={() => {
              toggleFollow(reel.property.builderId ?? "");
              toast(isFollowing ? "Unfollowed" : "Following! ✓");
            }}
            className={cn(
              "ml-1 rounded-full px-3 py-1 text-xs font-bold transition-colors",
              isFollowing ? "bg-white/15 text-white" : "bg-white text-ink-900"
            )}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        </div>

        {/* Caption */}
        <p className="text-sm leading-relaxed text-white/90">{reel.caption}</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {reel.hashtags.map((h) => (
            <span key={h} className="text-xs font-semibold text-teal-300">{h}</span>
          ))}
        </div>

        {/* Music */}
        <div className="mt-2 flex items-center gap-1.5 text-xs text-white/70">
          <Music2 className="h-3 w-3" /> {reel.music}
        </div>

        {/* Property info card */}
        <Link
          href={`/property/${reel.property.slug}`}
          className="mt-3 block rounded-2xl border border-white/15 bg-ink-950/50 p-3 backdrop-blur-md transition-colors hover:bg-ink-950/70"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="font-display text-lg font-bold leading-tight">
                {isRent(reel.property) ? formatRent(reel.property.rentMonthly ?? reel.property.price) : formatPrice(reel.property.price)}
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-white/70">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{reel.property.locality}</span>
                {reel.property.beds > 0 && (
                  <>
                    <span className="flex items-center gap-1"><BedDouble className="h-3 w-3" />{reel.property.beds}</span>
                    <span className="flex items-center gap-1"><Bath className="h-3 w-3" />{reel.property.baths}</span>
                    <span className="flex items-center gap-1"><Maximize className="h-3 w-3" />{reel.property.area}</span>
                  </>
                )}
              </div>
            </div>
            <ChevronUp className="h-5 w-5 rotate-90 text-white" />
          </div>

          {/* Action buttons */}
          <div className="mt-3 grid grid-cols-4 gap-1.5">
            <Link
              href={`/property/${reel.property.slug}`}
              className="flex items-center justify-center gap-1 rounded-xl bg-gradient-accent py-2 text-xs font-bold text-white"
            >
              Details
            </Link>
            <a href={`tel:${SITE.supportPhoneHref}`} className="flex items-center justify-center gap-1 rounded-xl bg-white/15 py-2 text-xs font-bold text-white">
              <Phone className="h-3.5 w-3.5" />
            </a>
            <a
              href={`https://wa.me/${SITE.whatsappHref}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1 rounded-xl bg-teal-500/90 py-2 text-xs font-bold text-white"
            >
              WA
            </a>
            <Link href={`/property/${reel.property.slug}`} className="flex items-center justify-center rounded-xl bg-white/15 py-2 text-xs font-bold text-white">
              Visit
            </Link>
          </div>
        </Link>
      </div>

      {/* Up-next hint */}
      {active && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white/80 backdrop-blur sm:flex"
        >
          <ChevronUp className="h-3.5 w-3.5 animate-bounce" /> Swipe for more
        </motion.div>
      )}
    </div>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 text-white">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-950/40 backdrop-blur transition-transform active:scale-90">
        {icon}
      </span>
      <span className="text-xs font-semibold drop-shadow">{label}</span>
    </button>
  );
}

function CommentsDialog({
  reel,
  open,
  onOpenChange,
}: {
  reel: (Reel & { property: Property }) | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [text, setText] = React.useState("");
  const [comments, setComments] = React.useState(reel?.comments ?? []);
  const [localComments, setLocalComments] = React.useState<typeof comments>([]);

  React.useEffect(() => {
    if (reel) {
      setComments(reel.comments);
      setLocalComments([]);
    }
  }, [reel]);

  if (!reel) return null;
  const allComments = [...localComments, ...comments];

  const post = () => {
    if (!text.trim()) return;
    setLocalComments((c) => [
      {
        id: `local-${Date.now()}`,
        user: { name: "You", avatar: "https://i.pravatar.cc/100?img=8" },
        text: text.trim(),
        likes: 0,
        createdAt: new Date().toISOString(),
      },
      ...c,
    ]);
    setText("");
    toast.success("Comment posted!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bottom-0 top-auto max-w-md translate-y-0 rounded-b-none rounded-t-3xl p-0 sm:rounded-3xl sm:bottom-auto sm:translate-y-[-50%]">
        <DialogHeader className="border-b border-border p-4">
          <DialogTitle className="text-center text-base">
            {allComments.length} comments
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-[50vh] overflow-y-auto p-4">
          {allComments.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Be the first to comment 💬
            </p>
          ) : (
            <div className="space-y-4">
              {allComments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={c.user.avatar} alt={c.user.name} />
                    <AvatarFallback>{c.user.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="rounded-2xl bg-muted/50 px-3 py-2">
                      <div className="text-sm font-semibold">{c.user.name}</div>
                      <div className="text-sm text-foreground/90">{c.text}</div>
                    </div>
                    <div className="mt-1 flex gap-3 pl-3 text-xs text-muted-foreground">
                      <button className="hover:text-foreground">Like</button>
                      <button className="hover:text-foreground">Reply</button>
                      <span>{timeAgo(c.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && post()}
              placeholder="Add a comment…"
              className="rounded-full"
            />
            <Button size="icon" variant="gradient" onClick={post} disabled={!text.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// tiny inline Input to avoid extra import cycle
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="flex h-11 w-full rounded-full border border-input bg-background/70 px-4 text-sm outline-none focus:ring-2 focus:ring-ring"
    />
  );
}

function timeAgo(iso: string) {
  const diff = Date.now() - +new Date(iso);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

function isRent(property: Property) {
  return property.transactionType === "Rent";
}
