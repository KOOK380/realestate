"use client";

import * as React from "react";

// ─────────────────────────────────────────────────────────────
// Search command palette — global open/close state.
// Any component can call `openSearch()`. The <SearchCommand/> mounted
// in the root layout listens and opens itself.
// ─────────────────────────────────────────────────────────────

const OPEN_EVENT = "luxe:open-search";

export function openSearch() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_EVENT));
}

/** Subscribe to global search-open events. Returns a cleanup-unsubscribe. */
export function onOpenSearch(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(OPEN_EVENT, cb);
  return () => window.removeEventListener(OPEN_EVENT, cb);
}
