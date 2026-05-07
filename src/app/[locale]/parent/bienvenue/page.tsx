import { redirect } from "next/navigation";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/app/AppShell";
import { OnboardingWizard } from "@/components/app/OnboardingWizard";
import { isSetupIncompleteError } from "@/lib/db-errors";
import { SetupRequiredScreen } from "@/components/app/SetupRequiredScreen";

export const metadata = { title: "Bienvenue" };

export default async function WelcomePage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  // Use admin client throughout — bienvenue is the orphan-recovery page,
  // it must always render regardless of RLS state.
  const admin = createAdminClient();
  let { data: profile, error: profileErr } = await admin
    .from("parent_profiles")
    .select("full_name, onboarded")
    .eq("user_id", user.id)
    .maybeSingle();

  // If the profile row is missing (signup upsert failed silently on a
  // previous deploy, or user was created out-of-band), create it now.
  // CRITICAL: We get the inserted row directly from the INSERT response
  // (`.select().single()`) instead of doing a second SELECT. Next.js 15
  // dedupes identical fetch calls within a server-component request, so a
  // refetch with the same URL/auth would return the stale cached null.
  if (!profile && !isSetupIncompleteError(profileErr)) {
    const fullNameMeta =
      (typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name) ||
      user.email?.split("@")[0] ||
      "Parent";

    const { data: inserted, error: insertErr } = await admin
      .from("parent_profiles")
      .insert({
        user_id: user.id,
        full_name: fullNameMeta,
        onboarded: false,
        language_pref: "fr",
      })
      .select("full_name, onboarded")
      .single();

    if (inserted) {
      profile = inserted;
    } else if (insertErr?.code === "23505") {
      // Unique-violation: concurrent insert from another tab created the
      // row between our SELECT and our INSERT. Re-read with a slightly
      // different SELECT shape so Next.js fetch dedup can't return our
      // earlier cached null.
      const refetch = await admin
        .from("parent_profiles")
        .select("full_name, onboarded, user_id")
        .eq("user_id", user.id)
        .maybeSingle();
      profile = refetch.data;
      profileErr = refetch.error;
    } else if (insertErr) {
      console.error("[bienvenue] profile insert failed", insertErr);
      profileErr = insertErr;
    }
  }

  // Read children via admin too — same reason: keep this orphan-recovery
  // page resilient to RLS / pool quirks, since it must always render.
  const childrenRes = await admin
    .from("children")
    .select("id")
    .eq("parent_id", user.id);

  if (isSetupIncompleteError(profileErr) || isSetupIncompleteError(childrenRes.error)) {
    return <SetupRequiredScreen missing={["parent_profiles", "children"]} />;
  }

  const children = childrenRes.data;

  // If already onboarded with at least one child → redirect to dashboard
  if (profile?.onboarded && children?.length) {
    redirect("/parent");
  }

  return (
    <AppShell parentName={profile?.full_name ?? ""}>
      <div className="max-w-2xl mx-auto">
        <OnboardingWizard parentName={profile?.full_name ?? ""} />
      </div>
    </AppShell>
  );
}
