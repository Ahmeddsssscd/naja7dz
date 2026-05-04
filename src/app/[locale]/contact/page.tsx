import { useTranslations } from "next-intl";
import { PageShell } from "@/components/landing/PageShell";
import { ContactForm } from "@/components/ContactForm";

export default function ContactPage() {
  const t = useTranslations("Contact");
  return (
    <PageShell active="contact">
      <section className="py-20 md:py-26 bg-surface-2">
        <div className="container-x max-w-3xl text-center">
          <span className="eyebrow mb-3 block">{t("eyebrow")}</span>
          <h1 className="text-[clamp(34px,5vw,48px)] font-bold tracking-tight text-fg mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-fg-soft">{t("subtitle")}</p>
        </div>
      </section>

      <section className="py-20 bg-surface">
        <div className="container-x grid md:grid-cols-2 gap-12 max-w-5xl">
          {/* Channels */}
          <div className="space-y-6">
            <ContactChannel
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              }
              label={t("channel_email")}
              value="support@naja7dz.com"
              href="mailto:support@naja7dz.com"
            />
            <ContactChannel
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              }
              label={t("channel_whatsapp")}
              value="+213 0 555 12 34 56"
              href="https://wa.me/213055512345"
            />
            <ContactChannel
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              }
              label={t("channel_hours")}
              value="Dim → Jeu · 9h–18h (heure d'Alger)"
            />
          </div>

          {/* Form */}
          <ContactForm />
        </div>
      </section>
    </PageShell>
  );
}

function ContactChannel({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const Wrap = href ? "a" : "div";
  return (
    <Wrap
      {...(href ? { href, target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`flex items-start gap-4 p-5 rounded-card border border-line bg-surface ${
        href ? "hover:border-fg/40 transition-colors" : ""
      }`}
    >
      <div className="w-11 h-11 rounded-[10px] bg-surface-3 text-fg inline-flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-fg-soft font-semibold mb-1">
          {label}
        </div>
        <div className="text-fg font-medium">{value}</div>
      </div>
    </Wrap>
  );
}
