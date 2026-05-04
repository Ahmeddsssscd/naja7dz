import { PageShell } from "@/components/landing/PageShell";
import { Link } from "@/i18n/routing";
import { SignupWaitlistForm } from "@/components/SignupWaitlistForm";

export const metadata = { title: "Inscription — Najaح" };

export default function InscriptionPage() {
  return (
    <PageShell>
      <section className="py-16 md:py-20 bg-surface-2 min-h-[80vh]">
        <div className="container-x grid md:grid-cols-2 gap-10 max-w-5xl items-start">
          {/* Left: pitch */}
          <div className="md:pe-6">
            <span className="eyebrow mb-3 block">Liste d&apos;accès anticipé</span>
            <h1 className="text-[clamp(28px,4vw,40px)] font-bold tracking-tight text-fg leading-tight mb-5">
              Sois parmi les premières familles à utiliser Najaح.
            </h1>
            <p className="text-fg-soft text-lg mb-6">
              L&apos;inscription complète ouvre dans quelques semaines. Inscris-toi à la
              liste d&apos;attente : tu seras prévenu(e) en premier, avec un mois offert
              au lancement.
            </p>
            <ul className="space-y-3 text-fg">
              <li className="flex items-start gap-3">
                <span className="text-gold mt-1">✓</span>
                <span>Accès garanti dès l&apos;ouverture</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gold mt-1">✓</span>
                <span>1 mois offert pour les 1 000 premières familles inscrites</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gold mt-1">✓</span>
                <span>Aucune carte bancaire demandée maintenant</span>
              </li>
            </ul>
            <p className="text-fg-faint text-sm mt-8">
              Déjà inscrit(e) ? <Link href="/connexion" className="text-fg font-medium underline">Se connecter</Link>
            </p>
          </div>

          {/* Right: form */}
          <div className="bg-surface border border-line rounded-card p-7 shadow-card">
            <h2 className="text-xl font-semibold text-fg mb-1">Rejoindre la liste</h2>
            <p className="text-fg-soft text-sm mb-6">
              On a besoin de quelques infos pour te préparer la meilleure expérience.
            </p>
            <SignupWaitlistForm />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
