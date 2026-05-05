"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CheckIcon } from "@/components/Icon";

export function WritingPad({ prompt, promptAr }: { prompt: string; promptAr?: string }) {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const charCount = text.length;
  const lineCount = text.split("\n").length;

  const onSubmit = () => {
    if (wordCount < 10) {
      toast.error("Encore un peu d'effort !", {
        description: "Écris au moins 10 mots avant de soumettre.",
      });
      return;
    }
    setSubmitted(true);
    // Real impl would POST to /api/writing/sessions and call AI feedback
    toast.success("Rédaction envoyée ✓", {
      description: "Ton tuteur va la corriger sous peu.",
    });
  };

  if (submitted) {
    return (
      <div className="bg-surface border border-line rounded-card p-8 text-center max-w-2xl">
        <span className="inline-flex w-14 h-14 rounded-full bg-gold text-navy items-center justify-center mb-4">
          <CheckIcon size={28} />
        </span>
        <h2 className="text-xl font-bold text-fg mb-2">Bien joué !</h2>
        <p className="text-fg-soft mb-6">
          Ta rédaction de <strong className="text-fg">{wordCount} mots</strong> est enregistrée.
          Tu recevras les commentaires détaillés très bientôt.
        </p>
        <button onClick={() => { setText(""); setSubmitted(false); }} className="btn btn-outline">
          Écrire une autre
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-surface border border-line rounded-card p-5">
        <div className="text-xs font-semibold text-gold uppercase tracking-wider mb-2">Sujet</div>
        <p className="text-fg font-medium">{prompt}</p>
        {promptAr && <p className="text-fg-soft text-sm mt-2 font-arabic" dir="rtl">{promptAr}</p>}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={12}
        placeholder="Commence à écrire ici…"
        className="w-full p-5 bg-surface border border-line-strong rounded-card text-fg font-medium leading-relaxed text-base resize-none focus:outline-none focus:border-fg focus:ring-2 focus:ring-gold/20"
      />

      <div className="flex justify-between text-xs text-fg-soft">
        <span>{lineCount} {lineCount > 1 ? "lignes" : "ligne"} · {wordCount} mots · {charCount} caractères</span>
        <span className={wordCount < 10 ? "text-fg-faint" : "text-green-600 font-semibold"}>
          {wordCount < 10 ? "Minimum 10 mots" : "Prêt à envoyer ✓"}
        </span>
      </div>

      <button
        onClick={onSubmit}
        className="btn btn-primary btn-lg w-full disabled:opacity-50"
        disabled={wordCount < 10}
      >
        Envoyer ma rédaction
      </button>
    </div>
  );
}
