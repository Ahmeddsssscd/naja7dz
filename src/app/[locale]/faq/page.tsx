import { useTranslations, useLocale } from "next-intl";
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

// The most-asked questions, surfaced at the top. Kept inline (bilingual)
// so they can be edited without touching the i18n bundles.
const TOP_QUESTIONS: Array<{ q_fr: string; a_fr: string; q_ar: string; a_ar: string }> = [
  {
    q_fr: "Comment fonctionne l'abonnement ?",
    a_fr: "Vous créez un compte parent, vous ajoutez le profil de votre enfant (son niveau scolaire), puis vous choisissez une offre. Le paiement se fait en ligne par carte EDAHABIA ou CIB via Chargily. L'accès est immédiat après paiement.",
    q_ar: "كيف يعمل الاشتراك؟",
    a_ar: "تُنشئ حساب وليّ، ثم تضيف ملف طفلك (مستواه الدراسي)، ثم تختار عرضًا. يتم الدفع عبر الإنترنت ببطاقة الذهبية أو CIB عن طريق Chargily. الوصول فوري بعد الدفع.",
  },
  {
    q_fr: "Le contenu suit-il le programme algérien officiel ?",
    a_fr: "Oui. Les cours, les quiz et les examens blancs suivent le programme officiel de l'Éducation nationale, du primaire (1AP) jusqu'au baccalauréat (3AS), en arabe et en français.",
    q_ar: "هل المحتوى يتبع المنهاج الجزائري الرسمي؟",
    a_ar: "نعم. الدروس والاختبارات والامتحانات التجريبية تتبع المنهاج الرسمي للتربية الوطنية، من الابتدائي (1 ابتدائي) إلى البكالوريا (3 ثانوي)، بالعربية والفرنسية.",
  },
  {
    q_fr: "Puis-je inscrire plusieurs enfants ?",
    a_fr: "Oui, avec l'offre Famille vous pouvez ajouter jusqu'à 4 enfants sur un seul compte parent, chacun avec son propre niveau et son propre suivi.",
    q_ar: "هل يمكنني تسجيل أكثر من طفل؟",
    a_ar: "نعم، مع عرض العائلة يمكنك إضافة حتى 4 أطفال في حساب وليّ واحد، لكلٍّ مستواه ومتابعته الخاصة.",
  },
  {
    q_fr: "Que se passe-t-il si mon enfant est en classe d'examen (BEM ou BAC) ?",
    a_fr: "Les niveaux d'examen (5AP, 4AM, 3AS) bénéficient de leçons complètes, de banques de questions et d'examens blancs chronométrés générés à partir du programme, avec correction détaillée.",
    q_ar: "ماذا لو كان طفلي في سنة امتحان (البيم أو البكالوريا)؟",
    a_ar: "سنوات الامتحان (5 ابتدائي، 4 متوسط، 3 ثانوي) تحصل على دروس كاملة وبنوك أسئلة وامتحانات تجريبية مؤقّتة مع تصحيح مفصّل.",
  },
  {
    q_fr: "Comment contacter le support ?",
    a_fr: "Notre support est disponible 24h/24 et 7j/7. Écrivez-nous via le formulaire de contact ou par email à support@naja7dz.com — nous répondons généralement en moins de 24 heures.",
    q_ar: "كيف أتواصل مع الدعم؟",
    a_ar: "دعمنا متاح 24 ساعة و7 أيام في الأسبوع. راسلنا عبر نموذج الاتصال أو بالبريد support@naja7dz.com — نردّ عادةً في أقل من 24 ساعة.",
  },
];

export default function FAQPage() {
  const t = useTranslations("FAQ");
  const tp = useTranslations("FaqPage");
  const locale = useLocale();
  const isAr = locale === "ar";

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

      {/* Most-asked questions */}
      <section className="py-14 bg-surface border-b border-line">
        <div className="container-x max-w-3xl">
          <h2 className="text-xs font-semibold text-gold uppercase tracking-[0.08em] mb-4">
            {isAr ? "الأكثر طرحًا" : "Les plus posées"}
          </h2>
          <div>
            {TOP_QUESTIONS.map((item, i) => (
              <details key={i} className="border-b border-line group" open={i === 0}>
                <summary className="flex justify-between items-center py-5 text-base md:text-lg font-semibold text-fg cursor-pointer list-none">
                  <span>{isAr ? item.q_ar : item.q_fr}</span>
                  <PlusIcon
                    size={20}
                    className="text-fg-soft transition-transform group-open:rotate-45 group-open:text-gold flex-shrink-0 ms-4"
                  />
                </summary>
                <p className="pb-5 text-fg-soft text-base leading-relaxed">
                  {isAr ? item.a_ar : item.a_fr}
                </p>
              </details>
            ))}
          </div>
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
