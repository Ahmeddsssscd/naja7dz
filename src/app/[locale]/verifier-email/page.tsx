import { redirect } from "next/navigation";
import { PageShell } from "@/components/landing/PageShell";
import { Link } from "@/i18n/routing";
import { Logo } from "@/components/Logo";
import { CheckIcon } from "@/components/Icon";
import { createServerClient } from "@/lib/supabase/server";

export const metadata = { title: "Email vérifié — Najaح" };

export default async function VerifyEmailPage() {
  // If user is already authenticated (clicked the link), send them straight to onboarding
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    redirect("/parent/bienvenue");
  }

  return (
    <PageShell>
      <section className="bg-surface-2 py-16 md:py-24 min-h-[80vh] flex items-center">
        <div className="container-x max-w-md text-center">
          <div className="bg-surface border border-line rounded-modal p-10">
            <div className="flex justify-center mb-6"><Logo height={44} /></div>
            <span className="inline-flex w-14 h-14 rounded-full bg-gold text-navy items-center justify-center mb-5">
              <CheckIcon size={28} />
            </span>
            <h1 className="text-2xl font-bold text-fg mb-2">Email vérifié</h1>
            <p className="text-fg-soft mb-8">
              Ton compte est activé. Connecte-toi pour ajouter tes enfants.
            </p>
            <Link href="/connexion" className="btn btn-primary btn-lg w-full">
              Se connecter
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
