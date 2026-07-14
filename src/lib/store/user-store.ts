"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface SavedItem {
  id: string;
  title: string;
  image: string;
  price: number;
  city: string;
  savedAt: string;
}

export interface RecentlyViewedItem extends SavedItem {}

interface UserState {
  saved: SavedItem[];
  recentlyViewed: RecentlyViewedItem[];
  followBuilders: string[];
  followAgents: string[];
  likedReels: string[];
  savedReels: string[];

  toggleSave: (item: SavedItem) => void;
  isSaved: (id: string) => boolean;
  clearSaved: () => void;

  addRecentlyViewed: (item: SavedItem) => void;

  toggleFollowBuilder: (id: string) => void;
  toggleFollowAgent: (id: string) => void;

  toggleLikeReel: (id: string) => void;
  isReelLiked: (id: string) => boolean;
  toggleSaveReel: (id: string) => void;
  isReelSaved: (id: string) => boolean;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      saved: [],
      recentlyViewed: [],
      followBuilders: [],
      followAgents: [],
      likedReels: [],
      savedReels: [],

      toggleSave: (item) =>
        set((s) => {
          const exists = s.saved.some((x) => x.id === item.id);
          return {
            saved: exists
              ? s.saved.filter((x) => x.id !== item.id)
              : [{ ...item, savedAt: new Date().toISOString() }, ...s.saved],
          };
        }),
      isSaved: (id) => get().saved.some((x) => x.id === id),
      clearSaved: () => set({ saved: [] }),

      addRecentlyViewed: (item) =>
        set((s) => ({
          recentlyViewed: [
            item,
            ...s.recentlyViewed.filter((x) => x.id !== item.id),
          ].slice(0, 12),
        })),

      toggleFollowBuilder: (id) =>
        set((s) => ({
          followBuilders: s.followBuilders.includes(id)
            ? s.followBuilders.filter((x) => x !== id)
            : [...s.followBuilders, id],
        })),
      toggleFollowAgent: (id) =>
        set((s) => ({
          followAgents: s.followAgents.includes(id)
            ? s.followAgents.filter((x) => x !== id)
            : [...s.followAgents, id],
        })),

      toggleLikeReel: (id) =>
        set((s) => ({
          likedReels: s.likedReels.includes(id)
            ? s.likedReels.filter((x) => x !== id)
            : [...s.likedReels, id],
        })),
      isReelLiked: (id) => get().likedReels.includes(id),
      toggleSaveReel: (id) =>
        set((s) => ({
          savedReels: s.savedReels.includes(id)
            ? s.savedReels.filter((x) => x !== id)
            : [...s.savedReels, id],
        })),
      isReelSaved: (id) => get().savedReels.includes(id),
    }),
    {
      name: "luxe-user",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Mock auth session (env-ready swap for NextAuth later)
interface SessionState {
  user: { name: string; email: string; avatar: string } | null;
  signIn: (user: { name: string; email: string; avatar?: string }) => void;
  signOut: () => void;
}

export const useSession = create<SessionState>()(
  persist(
    (set) => ({
      user: null,
      signIn: (u) =>
        set({
          user: {
            name: u.name,
            email: u.email,
            avatar:
              u.avatar ?? `https://i.pravatar.cc/200?u=${encodeURIComponent(u.email)}`,
          },
        }),
      signOut: () => set({ user: null }),
    }),
    {
      name: "luxe-session",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
