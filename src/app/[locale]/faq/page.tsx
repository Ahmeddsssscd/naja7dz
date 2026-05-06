import { useTranslations } from "next-intl";
import { PageShell } from "@/components/landing/PageShell";
import { PlusIcon } from "@/components/Icon";
import { Link } from "@/i18n/routing";

const CATEGORIES: Array<{ key: string; count: number }> = [
  { key: "cat_general", count: 3 },
  { key: "cat_lang", count: 3 },
  { key: "cat_safety", count: 3 },
  { key: "cat_pricing", count: 4 },
  { key: "cat_support", count: 2 },
];

export default function FAQPage() {
  const t = useTranslations("FAQ");
  const tp = useTranslations("FaqPage");

  return (
    <PageShell active="faq">
      <section className="py-20 md:py-26 bg-surface-2 text-center">
        <div className="container-x max-w-3xl">
          <span className="eyebrow mb-3 block">{t("eyebrow")}</span>
          <h1 className="text-[clamp(34px,5vw,48px)] font-bold tracking-tight text-fg mb-4">
            {t("title")}
          </h1>
        </div>
      </section>

      <section className="py-20 bg-surface">
        <div className="container-x max-w-3xl space-y-14">
          {CATEGORIES.map((cat) => (
            <div key={cat.key}>
              <h2 className="text-xs font-semibold text-gold uppercase tracking-[0.08em] mb-4">
                {tp(`${cat.key}_title`)}
              </h2>
              <div>
                {Array.from({ length: cat.count }, (_, i) => i + 1).map((n) => (
                  <details key={n} className="border-b border-line group">
                    <summary className="flex justify-between items-center py-5 text-base md:text-lg font-medium text-fg cursor-pointer list-none">
                      <span>{tp(`${cat.key}_q${n}`)}</span>
                      <PlusIcon
                        size={20}
                        className="text-fg-soft transition-transform group-open:rotate-45 group-open:text-gold flex-shrink-0 ms-4"
                      />
                    </summary>
                    <p className="pb-5 text-fg-soft text-base leading-relaxed">
                      {tp(`${cat.key}_a${n}`)}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-surface-2 text-center border-t border-line">
        <p className="text-fg-soft mb-3">{tp("cta_more")}</p>
        <Link href="/contact" className="btn btn-primary">
          {tp("cta_button")}
        </Link>
      </section>
    </PageShell>
  );
}
