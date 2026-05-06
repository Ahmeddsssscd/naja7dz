"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/routing";

export function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") || "/parent";

  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "err">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur");
      // Use full reload so middleware picks up the new session cookies
      window.location.href = next;
    } catch (err) {
      setStatus("err");
      setErrorMsg(err instanceof Error ? err.message : "Erreur");
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block">
        <span className="block text-sm font-medium text-fg mb-1.5">Adresse email</span>
        <input
          name="email"
          type="email"
          required
          value={form.email}
          onChange={onChange}
          className="auth-input"
          placeholder="parent@email.com"
          autoComplete="email"
        />
      </label>

      <label className="block">
        <span className="flex justify-between items-center text-sm font-medium text-fg mb-1.5">
          <span>Mot de passe</span>
          <Link href="/connexion/oublie" className="text-xs text-fg-soft hover:text-gold font-normal">
            Mot de passe oublié ?
          </Link>
        </span>
        <input
          name="password"
          type="password"
          required
          value={form.password}
          onChange={onChange}
          className="auth-input"
          placeholder="••••••••"
          autoComplete="current-password"
        />
      </label>

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn btn-primary w-full btn-lg disabled:opacity-60"
      >
        {status === "loading" ? "Connexion…" : "Se connecter"}
      </button>

      {status === "err" && (
        <p className="text-sm text-red-500 text-center" role="alert">
          {errorMsg}
        </p>
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
