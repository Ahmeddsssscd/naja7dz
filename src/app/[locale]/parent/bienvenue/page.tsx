import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/app/AppShell";
import { OnboardingWizard } from "@/components/app/OnboardingWizard";
import { isSetupIncompleteError } from "@/lib/db-errors";
import { SetupRequiredScreen } from "@/components/app/SetupRequiredScreen";

export const metadata = { title: "Bienvenue" };

export default async function WelcomePage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const profileRes = await supabase
    .from("parent_profiles")
    .select("full_name, onboarded")
    .eq("user_id", user.id)
    .maybeSingle();

  const childrenRes = await supabase
    .from("children")
    .select("id")
    .eq("parent_id", user.id);

  if (isSetupIncompleteError(profileRes.error) || isSetupIncompleteError(childrenRes.error)) {
    return <SetupRequiredScreen missing={["parent_profiles", "children"]} />;
  }

  const profile = profileRes.data;
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
