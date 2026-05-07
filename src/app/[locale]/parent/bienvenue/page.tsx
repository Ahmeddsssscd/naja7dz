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

  // Use admin client for the initial read too, so that read-after-write
  // through the defensive recovery path is consistent (no cross-client
  // timing issues between service_role write and authenticated read).
  const admin = createAdminClient();
  let { data: profile, error: profileErr } = await admin
    .from("parent_profiles")
    .select("full_name, onboarded")
    .eq("user_id", user.id)
    .maybeSingle();

  // If the profile row is missing (signup upsert failed silently on a
  // previous deploy, or user was created out-of-band), create it now.
  // Without this, the user would loop forever between /parent (redirects
  // to /bienvenue when onboarded=null) and /bienvenue (no exit condition
  // because the wizard's UPDATE on a missing row is a no-op).
  if (!profile && !isSetupIncompleteError(profileErr)) {
    const fullNameMeta =
      (typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name) ||
      user.email?.split("@")[0] ||
      "Parent";
    // Upsert with ignoreDuplicates so a concurrent insert (rare race) doesn't
    // overwrite an existing row's full_name.
    const { error: upsertErr } = await admin
      .from("parent_profiles")
      .upsert(
        {
          user_id: user.id,
          full_name: fullNameMeta,
          onboarded: false,
          language_pref: "fr",
        },
        { onConflict: "user_id", ignoreDuplicates: true },
      );
    if (upsertErr) {
      console.error("[bienvenue] profile upsert failed", upsertErr);
    }
    // Re-read via admin (same client we wrote with) so the page sees the
    // freshly inserted row regardless of pool/connection state.
    const refetch = await admin
      .from("parent_profiles")
      .select("full_name, onboarded")
      .eq("user_id", user.id)
      .maybeSingle();
    profile = refetch.data;
    profileErr = refetch.error;
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
