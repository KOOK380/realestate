"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardCarouselProps {
  children: React.ReactNode[];
  className?: string;
  itemClassName?: string;
}

export function CardCarousel({ children, className, itemClassName }: CardCarouselProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  const scrollBy = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <div className={cn("relative", className)}>
      <div
        ref={ref}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-pl-4 pb-2"
      >
        {children.map((child, i) => (
          <div
            key={i}
            className={cn(
              "w-[80vw] shrink-0 snap-start sm:w-[340px] lg:w-[300px]",
              itemClassName
            )}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Desktop arrows */}
      <button
        onClick={() => scrollBy(-1)}
        aria-label="Scroll left"
        className="absolute -left-4 top-1/3 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-background shadow-card transition-transform hover:scale-110 lg:flex"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => scrollBy(1)}
        aria-label="Scroll right"
        className="absolute -right-4 top-1/3 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-background shadow-card transition-transform hover:scale-110 lg:flex"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
