import { useTranslations } from "next-intl";
import { PageShell } from "@/components/landing/PageShell";
import { Link } from "@/i18n/routing";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata = { title: "Créer un compte parent" };

export default function InscriptionPage() {
  const t = useTranslations("Inscription");
  return (
    <PageShell>
      <section className="py-16 md:py-20 bg-surface-2 min-h-[80vh]">
        <div className="container-x grid md:grid-cols-2 gap-10 max-w-5xl items-start">
          <div className="md:pe-6">
            <span className="eyebrow mb-3 block">{t("eyebrow")}</span>
            <h1 className="text-[clamp(28px,4vw,40px)] font-bold tracking-tight text-fg leading-tight mb-5">
              {t("title")}
            </h1>
            <p className="text-fg-soft text-lg mb-6">{t("lead")}</p>
            <ul className="space-y-3 text-fg">
              {(["li1", "li2", "li3"] as const).map((k) => (
                <li key={k} className="flex items-start gap-3">
                  <span className="text-gold mt-1">✓</span>
                  <span>{t(k)}</span>
                </li>
              ))}
            </ul>
            <p className="text-fg-faint text-sm mt-8">
              {t("have_account")}{" "}
              <Link href="/connexion" className="text-fg font-medium underline">
                {t("signin")}
              </Link>
            </p>
          </div>

          <div className="bg-surface border border-line rounded-card p-7 shadow-card">
            <h2 className="text-xl font-semibold text-fg mb-1">{t("form_title")}</h2>
            <p className="text-fg-soft text-sm mb-6">{t("form_subtitle")}</p>
            <SignupForm />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
