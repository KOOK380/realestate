"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, X, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function PropertyGallery({
  images,
  videoUrl,
  tour360Url,
  title,
}: {
  images: string[];
  videoUrl?: string;
  tour360Url?: string;
  title: string;
}) {
  const [active, setActive] = React.useState(0);
  const [lightbox, setLightbox] = React.useState(false);
  const [mode, setMode] = React.useState<"image" | "video" | "tour">("image");

  const totalMedia = images.length + (videoUrl ? 1 : 0) + (tour360Url ? 1 : 0);

  const next = () => setActive((a) => (a + 1) % Math.max(totalMedia, 1));
  const prev = () =>
    setActive((a) => (a - 1 + Math.max(totalMedia, 1)) % Math.max(totalMedia, 1));

  const isVideo = videoUrl && active === images.length;
  const isTour = tour360Url && active === images.length + (videoUrl ? 1 : 0);

  return (
    <>
      <div className="grid gap-2 lg:grid-cols-4 lg:grid-rows-2 lg:[grid-template-areas:'a_a_b'_'a_a_c']">
        {/* Main image / media */}
        <div className="relative aspect-[16/10] overflow-hidden rounded-3xl lg:col-span-2 lg:row-span-2 lg:[grid-area:a]">
          {isVideo && videoUrl ? (
            <video
              key={videoUrl}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            >
              <source src={videoUrl} type="video/mp4" />
            </video>
          ) : isTour && tour360Url ? (
            <div className="relative h-full w-full">
              <Image
                src={images[0]}
                alt={`${title} 360 tour`}
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
                priority
              />
              <a
                href={tour360Url}
                target="_blank"
                rel="noreferrer"
                className="absolute inset-0 flex items-center justify-center bg-ink-950/40"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/90 backdrop-blur transition-transform hover:scale-110">
                  <Expand className="h-8 w-8 text-ink-900" />
                </div>
                <div className="absolute bottom-4 rounded-full bg-ink-950/70 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur">
                  Launch 360° Tour
                </div>
              </a>
            </div>
          ) : (
            <Image
              src={images[Math.min(active, images.length - 1)]}
              alt={title}
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover"
              priority
            />
          )}

          <div className="absolute left-3 top-3 flex gap-2">
            {isVideo && <Badge variant="dark"><Play className="h-3 w-3" /> Video</Badge>}
            {isTour && <Badge variant="dark">360° Tour</Badge>}
          </div>

          <button
            onClick={() => setLightbox(true)}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur transition-transform hover:scale-110"
            aria-label="Fullscreen"
          >
            <Expand className="h-4 w-4" />
          </button>

          {/* Nav arrows */}
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 backdrop-blur transition-transform hover:scale-110"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 backdrop-blur transition-transform hover:scale-110"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Counter */}
          <div className="absolute bottom-3 right-3 rounded-full bg-ink-950/70 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            {active + 1} / {totalMedia}
          </div>
        </div>

        {/* Thumbnails */}
        {images.slice(1, 3).map((img, i) => (
          <ThumbButton
            key={img}
            image={img}
            title={title}
            active={active === i + 1}
            onClick={() => {
              setActive(i + 1);
              setMode("image");
            }}
          />
        ))}
        {videoUrl && (
          <button
            onClick={() => setActive(images.length)}
            className={cn(
              "relative hidden aspect-[16/10] overflow-hidden rounded-3xl lg:block",
              active === images.length && "ring-2 ring-primary"
            )}
          >
            <Image src={images[0]} alt="Video" fill sizes="33vw" className="object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-ink-950/40">
              <Play className="h-8 w-8 text-white" />
            </div>
          </button>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/95 p-4 backdrop-blur"
            onClick={() => setLightbox(false)}
          >
            <button
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              onClick={() => setLightbox(false)}
            >
              <X className="h-5 w-5" />
            </button>
            <motion.img
              key={active}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={images[Math.min(active, images.length - 1)]}
              alt={title}
              className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ThumbButton({
  image,
  title,
  active,
  onClick,
}: {
  image: string;
  title: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative hidden aspect-[16/10] overflow-hidden rounded-3xl transition-all lg:block",
        active && "ring-2 ring-primary"
      )}
    >
      <Image src={image} alt={title} fill sizes="33vw" className="object-cover" />
    </button>
  );
}
