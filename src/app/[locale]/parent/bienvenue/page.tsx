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

  let { data: profile, error: profileErr } = await supabase
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
    const admin = createAdminClient();
    const fullNameMeta =
      (typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name) ||
      user.email?.split("@")[0] ||
      "Parent";
    await admin.from("parent_profiles").insert({
      user_id: user.id,
      full_name: fullNameMeta,
      onboarded: false,
      language_pref: "fr",
    });
    // Re-read so the rest of the page sees the new row
    const refetch = await supabase
      .from("parent_profiles")
      .select("full_name, onboarded")
      .eq("user_id", user.id)
      .maybeSingle();
    profile = refetch.data;
    profileErr = refetch.error;
  }

  const childrenRes = await supabase
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
