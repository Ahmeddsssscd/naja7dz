/**
 * Daily streak helpers.
 *
 * `bumpStreak(childId)` is called on quiz completion / story read / game
 * play to extend the streak. The actual logic lives in a Postgres RPC
 * (bump_child_streak) so it's atomic and uses the Africa/Algiers timezone.
 *
 * `getStreak(childId)` reads the cached values (current_streak,
 * longest_streak, last_activity_date) for display on the kid's home.
 */
import "server-only";
import { createAdminClient } from "@/lib/supabase/server";

export interface StreakInfo {
  current: number;
  longest: number;
  lastActivity: string | null;
  /** True if the child did any activity today (Africa/Algiers calendar). */
  activeToday: boolean;
}

export async function getStreak(childId: string | null | undefined): Promise<StreakInfo> {
  const empty: StreakInfo = { current: 0, longest: 0, lastActivity: null, activeToday: false };
  if (!childId) return empty;
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("children")
      .select("current_streak, longest_streak, last_activity_date")
      .eq("id", childId)
      .maybeSingle();
    if (!data) return empty;
    const today = new Date().toISOString().slice(0, 10);
    return {
      current: data.current_streak ?? 0,
      longest: data.longest_streak ?? 0,
      lastActivity: data.last_activity_date ?? null,
      activeToday: data.last_activity_date === today,
    };
  } catch {
    // Migration may not have applied yet (column not found). Silently degrade.
    return empty;
  }
}

/**
 * Server-action callable from API routes. Idempotent (safe to call multiple
 * times per day — only the first call within a calendar day actually
 * increments).
 *
 * Returns the new streak values on success, or null on failure. Never throws.
 */
export async function bumpStreak(childId: string | null | undefined): Promise<StreakInfo | null> {
  if (!childId) return null;
  try {
    const admin = createAdminClient();
    const { data, error } = await admin.rpc("bump_child_streak", { p_child_id: childId });
    if (error) return null;
    const row = Array.isArray(data) ? data[0] : data;
    if (!row) return null;
    const today = new Date().toISOString().slice(0, 10);
    return {
      current: row.out_streak ?? 0,
      longest: row.out_longest ?? 0,
      lastActivity: today,
      activeToday: true,
    };
  } catch {
    return null;
  }
}
