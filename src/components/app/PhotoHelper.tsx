"use client";

import { useState, useRef } from "react";
import { useRouter } from "@/i18n/routing";

export function PhotoHelper() {
  const router = useRouter();
  const [step, setStep] = useState<"upload" | "preview" | "loading" | "result">("upload");
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const onPick = () => fileRef.current?.click();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgUrl(URL.createObjectURL(file));
    setStep("preview");
  };

  const onAnalyze = () => {
    setStep("loading");
    setTimeout(() => setStep("result"), 1800);
  };

  const onReset = () => {
    setStep("upload");
    setImgUrl(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-surface-2 flex flex-col">
      <header className="bg-surface border-b border-line sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-5 h-16 flex items-center gap-3">
          <button onClick={() => router.push("/eleve")} className="text-fg-soft" aria-label="Retour">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <h1 className="text-base font-semibold text-fg">Aide aux devoirs</h1>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-5 py-8">
        {step === "upload" && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto bg-pale-blue text-navy rounded-full flex items-center justify-center mb-6">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3"/></svg>
            </div>
            <h2 className="text-xl font-bold text-fg mb-2">Photographie ton exercice</h2>
            <p className="text-fg-soft mb-8 max-w-sm mx-auto">
              Cadre bien le texte. Plus la photo est nette, meilleure sera la solution.
            </p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={onChange}
              className="hidden"
            />
            <button onClick={onPick} className="btn btn-primary btn-lg">
              📷 Prendre une photo
            </button>
          </div>
        )}

        {step === "preview" && imgUrl && (
          <div>
            <div className="bg-surface border border-line rounded-card overflow-hidden mb-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imgUrl} alt="Exercice" className="w-full" />
            </div>
            <div className="flex gap-3">
              <button onClick={onReset} className="btn btn-outline flex-1">
                Reprendre
              </button>
              <button onClick={onAnalyze} className="btn btn-primary flex-1">
                Obtenir la solution →
              </button>
            </div>
          </div>
        )}

        {step === "loading" && (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-gold/30 border-t-gold rounded-full animate-spin mb-5" />
            <p className="text-fg-soft">Analyse en cours…</p>
          </div>
        )}

        {step === "result" && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="w-9 h-9 rounded-full bg-gold text-navy flex items-center justify-center font-bold text-sm">
                ✓
              </span>
              <h2 className="text-xl font-bold text-fg">Solution étape par étape</h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  step: 1,
                  title: "Identifier l'équation",
                  body: "On part de 2x + 6 = 14. C'est une équation du premier degré à une inconnue.",
                },
                {
                  step: 2,
                  title: "Isoler le terme avec x",
                  body: "On soustrait 6 des deux côtés : 2x + 6 − 6 = 14 − 6, donc 2x = 8.",
                },
                {
                  step: 3,
                  title: "Résoudre",
                  body: "On divise les deux côtés par 2 : x = 8 / 2 = 4.",
                },
                {
                  step: 4,
                  title: "Vérifier",
                  body: "On remplace x par 4 : 2(4) + 6 = 8 + 6 = 14 ✓. La solution est x = 4.",
                },
              ].map((s) => (
                <div key={s.step} className="bg-surface border border-line rounded-card p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-7 h-7 rounded-full bg-pale-blue text-navy font-bold text-sm flex items-center justify-center">
                      {s.step}
                    </span>
                    <h3 className="font-semibold text-fg">{s.title}</h3>
                  </div>
                  <p className="text-fg-soft text-sm leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={onReset} className="btn btn-outline flex-1">
                Nouveau devoir
              </button>
              <button onClick={() => router.push("/eleve/tuteur")} className="btn btn-primary flex-1">
                Demander au tuteur
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
