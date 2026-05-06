"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { CheckIcon } from "@/components/Icon";

const WILAYAS = [
  "Alger","Oran","Constantine","Annaba","Blida","Sétif","Tlemcen","Béjaïa","Tizi Ouzou","Batna",
  "Béchar","Ouargla","Mostaganem","Médéa","Skikda","Bordj Bou Arreridj","Boumerdès","Chlef","Djelfa",
  "Ghardaïa","Tiaret","Tipaza","Adrar","Aïn Defla","Aïn Témouchent","Biskra","Bouira","El Bayadh",
  "El Oued","El Tarf","Ghardaïa","Guelma","Illizi","Jijel","Khenchela","Laghouat","Mascara","M'Sila",
  "Naâma","Oum El Bouaghi","Relizane","Saïda","Sidi Bel Abbès","Souk Ahras","Tamanrasset","Tébessa",
  "Tindouf","Tissemsilt", "— autre",
];

export function SignupForm() {
  const locale = useLocale();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    wilaya: "",
    accepted: false,
  });
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    const value = target.type === "checkbox" ? (target as HTMLInputElement).checked : target.value;
    setForm((f) => ({ ...f, [target.name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.accepted) {
      setStatus("err");
      setErrorMsg("Tu dois accepter les conditions pour continuer.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, locale }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.setupRequired) {
          setStatus("err");
          setErrorMsg(
            "Configuration de la base de données incomplète. L'admin doit appliquer database/SETUP.sql dans Supabase.",
          );
          return;
        }
        throw new Error(data.error ?? "Erreur");
      }
      setStatus("ok");
    } catch (err) {
      setStatus("err");
      setErrorMsg(err instanceof Error ? err.message : "Erreur");
    }
  };

  if (status === "ok") {
    return (
      <div className="text-center py-6">
        <span className="inline-flex w-14 h-14 rounded-full bg-gold text-navy items-center justify-center mb-4">
          <CheckIcon size={28} />
        </span>
        <h3 className="text-lg font-semibold text-fg mb-2">Vérifie ton email</h3>
        <p className="text-fg-soft text-sm">
          Un lien de confirmation t&apos;attend dans <strong className="text-fg">{form.email}</strong>.
          Clique dessus pour activer ton compte et continuer.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="Ton prénom et nom">
        <input name="fullName" type="text" required value={form.fullName} onChange={onChange}
          className="auth-input" placeholder="Ahmed Benali" autoComplete="name" />
      </Field>
      <Field label="Adresse email">
        <input name="email" type="email" required value={form.email} onChange={onChange}
          className="auth-input" placeholder="parent@email.com" autoComplete="email" />
      </Field>
      <Field label="Mot de passe">
        <input name="password" type="password" required minLength={8} value={form.password} onChange={onChange}
          className="auth-input" placeholder="Au moins 8 caractères" autoComplete="new-password" />
        <span className="text-xs text-fg-faint mt-1.5 block">8 caractères minimum.</span>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Téléphone (optionnel)">
          <input name="phone" type="tel" value={form.phone} onChange={onChange}
            className="auth-input" placeholder="0555 12 34 56" />
        </Field>
        <Field label="Wilaya">
          <select name="wilaya" value={form.wilaya} onChange={onChange} className="auth-input">
            <option value="">Choisir…</option>
            {WILAYAS.map((w) => <option key={w} value={w}>{w}</option>)}
          </select>
        </Field>
      </div>

      <label className="flex items-start gap-2.5 text-sm text-fg-soft cursor-pointer pt-1">
        <input
          type="checkbox"
          name="accepted"
          checked={form.accepted}
          onChange={onChange}
          className="mt-1 w-4 h-4 accent-navy flex-shrink-0"
        />
        <span>
          J&apos;accepte les <a href="/legal/conditions" target="_blank" className="text-fg underline">conditions d&apos;utilisation</a>
          {" "}et la <a href="/legal/confidentialite" target="_blank" className="text-fg underline">politique de confidentialité</a>.
          Je confirme être un parent ou tuteur légal.
        </span>
      </label>

      <button type="submit" disabled={status === "loading"}
        className="btn btn-primary w-full btn-lg disabled:opacity-60 mt-2">
        {status === "loading" ? "Création du compte…" : "Créer mon compte parent"}
      </button>

      {status === "err" && (
        <p className="text-sm text-red-500 text-center" role="alert">{errorMsg}</p>
      )}

      <style jsx>{`
        :global(.auth-input) {
          width: 100%; padding: 12px 14px; background: var(--surface);
          border: 1.5px solid var(--line-strong); border-radius: 8px;
          color: var(--fg); font-size: 15px; font-family: inherit;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        :global(.auth-input:focus) {
          outline: none; border-color: var(--fg);
          box-shadow: 0 0 0 3px rgba(212, 167, 44, 0.2);
        }
        :global(.auth-input::placeholder) { color: var(--fg-faint); }
      `}</style>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-fg mb-1.5">{label}</span>
      {children}
    </label>
  );
}
