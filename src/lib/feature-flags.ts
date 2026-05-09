/**
 * Feature-flag helper. Reads from the `feature_flags` table once per request
 * via React's cache(). Page code calls `await isFeatureEnabled("kids_smart")`
 * to gate UI elements.
 *
 * Reads are open to anon (RLS policy), so even the public marketing pages
 * can use this without authenticating.
 *
 * Defaults to `enabled=true` if the flag doesn't exist yet — so newly added
 * code paths don't break before the migration is applied.
 */
import { cache } from "react";
import { createAdminClient } from "@/lib/supabase/server";

export type FeatureKey =
  | "kids_coloring"
  | "kids_maths"
  | "kids_smart"
  | "kids_reading"
  | "kids_world"
  | "kids_quran"
  | "kids_english"
  | "kids_riddle"
  | "eleve_tutor"
  | "eleve_homework_ai"
  | "eleve_groupes"
  | "eleve_calligraphie"
  | "eleve_redaction"
  | "eleve_bac"
  | "parent_reports";

interface FlagRow {
  key: string;
  enabled: boolean;
}

const loadFlags = cache(async (): Promise<Record<string, boolean>> => {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin.from("feature_flags").select("key, enabled");
    if (error || !data) return {};
    return Object.fromEntries((data as FlagRow[]).map((r) => [r.key, r.enabled]));
  } catch {
    // Table may not exist yet (migration not applied). Default to true.
    return {};
  }
});

export async function isFeatureEnabled(key: FeatureKey): Promise<boolean> {
  const flags = await loadFlags();
  return flags[key] ?? true;
}

export async function getAllFeatureFlags(): Promise<Record<string, boolean>> {
  return loadFlags();
}
