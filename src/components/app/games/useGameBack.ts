"use client";

/**
 * Smart "back" handler for game pages.
 *
 * Games are reachable from multiple hubs (/eleve/pratique, /petits/jeux-malins,
 * /petits/maths, /petits/monde-reel, ...) and each hub has a different UI/UX.
 * If the back arrow always pushes to a fixed hub, the kid lands on a layout
 * different from the one they came from — confusing.
 *
 * This hook returns a `goBack` function that uses browser history when
 * available (returning the kid to the exact page they came from) and falls
 * back to a sensible hub URL on direct navigation (bookmarks, refresh, etc.).
 */

import { useCallback } from "react";
import { useRouter } from "@/i18n/routing";

export function useGameBack(fallback: string = "/petits/jeux-malins") {
  const router = useRouter();
  return useCallback(() => {
    // window.history.length > 1 means there's at least one prior entry —
    // safe to call back() without ending up on about:blank.
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      // Direct navigation (bookmark, deep link, refresh after one click).
      // Use the per-game fallback so we land on a relevant hub.
      router.push(fallback as never);
    }
  }, [router, fallback]);
}
