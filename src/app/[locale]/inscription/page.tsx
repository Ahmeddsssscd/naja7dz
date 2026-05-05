import { PageShell } from "@/components/landing/PageShell";
import { Link } from "@/i18n/routing";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata = { title: "Créer un compte parent — Najaح" };

export default function InscriptionPage() {
  return (
    <PageShell>
      <section className="py-16 md:py-20 bg-surface-2 min-h-[80vh]">
        <div className="container-x grid md:grid-cols-2 gap-10 max-w-5xl items-start">
          <div className="md:pe-6">
            <span className="eyebrow mb-3 block">Inscription</span>
            <h1 className="text-[clamp(28px,4vw,40px)] font-bold tracking-tight text-fg leading-tight mb-5">
              Crée ton compte parent en 2 minutes.
            </h1>
            <p className="text-fg-soft text-lg mb-6">
              Tu ajouteras tes enfants à l&apos;étape suivante. Aucune carte bancaire à
              ce stade — tu testes la plateforme librement avant de t&apos;abonner.
            </p>
            <ul className="space-y-3 text-fg">
              <li className="flex items-start gap-3"><span className="text-gold mt-1">✓</span><span>Inscription gratuite, sans engagement</span></li>
              <li className="flex items-start gap-3"><span className="text-gold mt-1">✓</span><span>Email vérifié immédiatement</span></li>
              <li className="flex items-start gap-3"><span className="text-gold mt-1">✓</span><span>Tes données protégées (Loi 18-07)</span></li>
            </ul>
            <p className="text-fg-faint text-sm mt-8">
              Déjà un compte ? <Link href="/connexion" className="text-fg font-medium underline">Se connecter</Link>
            </p>
          </div>

          <div className="bg-surface border border-line rounded-card p-7 shadow-card">
            <h2 className="text-xl font-semibold text-fg mb-1">Tes informations</h2>
            <p className="text-fg-soft text-sm mb-6">Tout reste confidentiel.</p>
            <SignupForm />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
