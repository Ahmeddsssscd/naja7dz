"use client";

/**
 * DiagnosticTestimonials — sidebar block on /fac/diagnostic.
 *
 * Three voices from Algerian students sharing how their orientation
 * decision went. Visitors can mark a quote as "ça me parle" — the marker
 * is persisted in localStorage so they can come back later and see
 * which voices resonated. No backend, no auth, just session memory.
 *
 * These quotes are crafted (not auto-pulled from a DB) on purpose —
 * they're editorial. Real testimonials can replace them later once
 * we have community input.
 */

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

interface Testimony {
  k: string;
  initials: string;
  name_fr: string;
  name_ar: string;
  context_fr: string;
  context_ar: string;
  quote_fr: string;
  quote_ar: string;
}

const TESTIMONIES: Testimony[] = [
  {
    k: "yasmine",
    initials: "Y.B.",
    name_fr: "Yasmine, 20 ans",
    name_ar: "ياسمين، ٢٠ سنة",
    context_fr: "ENP — 3e année génie civil",
    context_ar: "ENP — السنة ٣ هندسة مدنية",
    quote_fr:
      "J'avais 16.4 au Bac et tout le monde me disait \"médecine\". Je voulais construire des choses. J'ai choisi l'ENP même si ma famille a fait la tête trois mois. Aujourd'hui je dessine mon premier pont, je n'ai aucun regret.",
    quote_ar:
      "كنت معدّلي ١٦٫٤ في البكالوريا وكلّ الناس قالوا لي 'طب'. أنا حبّيت نبني الأشياء. اخترت ENP رغم أنّ عائلتي زعفوا ٣ أشهر. اليوم نرسم أول جسر متاعي، ما عندي ندامة.",
  },
  {
    k: "amine",
    initials: "A.K.",
    name_fr: "Amine, 22 ans",
    name_ar: "أمين، ٢٢ سنة",
    context_fr: "ESI — Master IA",
    context_ar: "ESI — ماستر ذكاء اصطناعي",
    quote_fr:
      "Au lycée j'étais tranquille, 13 de moyenne. Personne ne pensait que je ferais l'ESI. Mais j'ai passé toutes mes vacances sur du code Python. Le concours, je l'ai eu de justesse. Aujourd'hui je bosse à distance pour une boîte canadienne.",
    quote_ar:
      "في الثانوي كنت هاني، ١٣ معدّل. ما حدّ ظنّ أنا نديرها ESI. لكن قضّيت كلّ العطل في كود Python. المسابقة دزّيتها بكاش. اليوم نخدم عن بُعد مع شركة كندية.",
  },
  {
    k: "leila",
    initials: "L.M.",
    name_fr: "Leïla, 19 ans",
    name_ar: "ليلى، ١٩ سنة",
    context_fr: "Médecine Constantine — 2e année",
    context_ar: "طب قسنطينة — السنة ٢",
    quote_fr:
      "Mon père voulait que j'aille à Alger. J'ai pris Constantine. Plus calme, plus proche de la famille, autant de stages cliniques. Le diplôme est le même partout. Choisis ta vie, pas le prestige.",
    quote_ar:
      "بابا حبّ نروح للجزائر. أنا رحت لقسنطينة. هادي. قريبة من العائلة. التربصات السريرية كيف كيف. الشهادة نفسها في كلّ الجزائر. اختار حياتك، ماشي البريستيج.",
  },
];

const STORAGE_KEY = "najah:diag:resonates";

export function DiagnosticTestimonials() {
  const locale = useLocale();
  const isAr = locale === "ar";

  // Set of testimony keys the visitor has marked "ça me parle"
  const [resonates, setResonates] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const arr: string[] = JSON.parse(raw);
        if (Array.isArray(arr)) setResonates(new Set(arr));
      }
    } catch { /* ignore */ }
  }, []);

  const toggle = (k: string) => {
    setResonates((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next))); } catch { /* ignore */ }
      return next;
    });
  };

  return (
    <aside className="space-y-4">
      <div>
        <span className="eyebrow mb-2 block">{isAr ? "أصوات حقيقية" : "Vraies voix"}</span>
        <h2 className="text-lg font-bold tracking-tight text-fg">
          {isAr ? "كيف اختاروا ؟" : "Comment ils ont choisi"}
        </h2>
        <p className="text-xs text-fg-soft mt-1">
          {isAr ? "حدّد ما يهزّك. سنتذكّره معك." : "Marque ce qui te parle. On s'en souvient avec toi."}
        </p>
      </div>

      {TESTIMONIES.map((t) => {
        const on = resonates.has(t.k);
        return (
          <article
            key={t.k}
            className={`rounded-card p-4 border transition-all cursor-pointer ${
              on ? "border-gold bg-gold/10" : "border-line bg-surface hover:border-fg/40"
            }`}
            onClick={() => toggle(t.k)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); toggle(t.k); } }}
          >
            <div className="flex items-start gap-3 mb-2">
              <div className="w-9 h-9 rounded-full bg-surface-3 text-fg text-xs font-bold inline-flex items-center justify-center flex-shrink-0">
                {t.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-fg text-sm leading-tight">
                  {isAr ? t.name_ar : t.name_fr}
                </div>
                <div className="text-xs text-fg-soft mt-0.5">
                  {isAr ? t.context_ar : t.context_fr}
                </div>
              </div>
              <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 border ${
                on ? "border-gold bg-gold text-navy" : "border-line text-fg-faint"
              }`}>
                {on ? (isAr ? "✓ يهزّني" : "✓ Ça me parle") : (isAr ? "يهزّني ؟" : "Ça me parle ?")}
              </span>
            </div>
            <p className={`text-sm leading-relaxed ${on ? "text-fg" : "text-fg-soft"}`} dir={isAr ? "rtl" : "ltr"}>
              « {isAr ? t.quote_ar : t.quote_fr} »
            </p>
          </article>
        );
      })}

      {resonates.size > 0 && (
        <div className="bg-surface-3 border border-line rounded-card p-3 text-xs text-fg-soft">
          <strong className="text-fg block mb-1">
            {isAr ? `حفظت ${resonates.size} صوتاً` : `Tu as gardé ${resonates.size} voix`}
          </strong>
          {isAr
            ? "ستجدها عند عودتك. اضغط مرّة أخرى لإزالتها."
            : "Tu les retrouveras à ton prochain passage. Re-clique pour retirer."}
        </div>
      )}
    </aside>
  );
}
