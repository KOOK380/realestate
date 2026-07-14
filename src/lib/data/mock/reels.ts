import type { Reel, ReelComment } from "../types";
import { REEL_VIDEOS } from "../images";
import { properties } from "./properties";
import { TESTIMONIAL_AVATARS } from "../images";

const COMMENT_NAMES = [
  "Riya Sharma",
  "Karan Malhotra",
  "Divya Patel",
  "Arjun Verma",
  "Nisha Gupta",
  "Sameer Khan",
];
const COMMENT_TEXTS = [
  "This is gorgeous 😍",
  "What's the price for the 3BHK?",
  "Booked a site visit, can't wait!",
  "The view is unreal 🔥",
  "Is this ready to move?",
  "Saving this for later!",
  "Location looks perfect for my family.",
  "Bandra at this price? Steal!",
];

const CAPTIONS = [
  "Your dream address awaits ✨ Come home to luxury.",
  "Wake up to this view every morning ☀️",
  "Step inside pure elegance. Tap to explore.",
  "Where design meets comfort. Book your visit today.",
  "This penthouse just hit the market 🔥",
  "Sea-facing serenity in the heart of the city 🌊",
  "Modern living, redefined. Swipe up for details.",
  "The villa of your dreams is finally here 🏡",
];

const HASHTAGS = [
  ["#luxuryrealestate", "#dreamhome", "#realestate"],
  ["#mumbaiproperties", "#apartment", "#interiordesign"],
  ["#villaforsale", "#luxuryliving", "#realestateindia"],
  ["#investment", "#property", "#newlaunch"],
  ["#penthouseliving", "#seaview", "#luxuryhomes"],
];

const MUSIC = [
  "Luxe Vibes — Original",
  "Golden Hour — Ambient Mix",
  "Skyline — Lo-fi Dreams",
  "Atelier — Soft Piano",
  "Marina — Deep House",
];

function buildComments(): ReelComment[] {
  const count = Math.floor(Math.random() * 4) + 1;
  return Array.from({ length: count }, (_, i) => ({
    id: `cmt-${Math.random().toString(36).slice(2, 8)}-${i}`,
    user: {
      name: COMMENT_NAMES[Math.floor(Math.random() * COMMENT_NAMES.length)],
      avatar: TESTIMONIAL_AVATARS[Math.floor(Math.random() * TESTIMONIAL_AVATARS.length)],
    },
    text: COMMENT_TEXTS[Math.floor(Math.random() * COMMENT_TEXTS.length)],
    likes: Math.floor(Math.random() * 80),
    createdAt: new Date(Date.now() - Math.random() * 7 * 86400000).toISOString(),
  }));
}

export const reels: Reel[] = properties
  .filter((p) => p.images.length > 0)
  .slice(0, 16)
  .map((p, i) => {
    const caption = CAPTIONS[i % CAPTIONS.length];
    const hashtags = HASHTAGS[i % HASHTAGS.length];
    return {
      id: `reel-${i + 1}`,
      propertyId: p.id,
      videoUrl: REEL_VIDEOS[i % REEL_VIDEOS.length],
      poster: p.images[0],
      caption,
      hashtags,
      music: MUSIC[i % MUSIC.length],
      views: p.views * between(3, 9),
      likes: Math.floor(p.views * (0.04 + Math.random() * 0.05)),
      comments: buildComments(),
      shares: Math.floor(p.views * 0.01),
      saves: Math.floor(p.views * 0.015),
      createdAt: p.createdAt,
    };
  });

function between(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const reelById = (id: string) => reels.find((r) => r.id === id);
export const reelsByProperty = (propertyId: string) =>
  reels.filter((r) => r.propertyId === propertyId);
