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
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              }
              label={t("channel_phone")}
              value="+213 XXX XX XX XX"
            />
            <ContactChannel
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              }
              label={t("channel_hours")}
              value="Support 24h/24 · 7j/7"
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
