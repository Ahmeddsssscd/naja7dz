"use client";

/**
 * Study groups manager — create a group, join by invite code, list my groups.
 * Talks to /api/groups. Chat is out of scope (needs moderation); this covers
 * membership so families can form study circles by grade.
 */

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { toast } from "sonner";

interface Group {
  id: string;
  name: string;
  inviteCode: string;
  isOwner: boolean;
  members: number;
  maxMembers: number;
}

export function GroupsManager() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      const res = await fetch("/api/groups", { cache: "no-store" });
      const json = await res.json();
      if (res.ok && Array.isArray(json.groups)) setGroups(json.groups);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const post = async (payload: Record<string, string>, okMsg: string) => {
    setBusy(true);
    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erreur");
      if (Array.isArray(json.groups)) setGroups(json.groups);
      toast.success(okMsg);
      return true;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
      return false;
    } finally {
      setBusy(false);
    }
  };

  const create = async () => {
    if (name.trim().length < 2) return;
    if (await post({ action: "create", name: name.trim() }, isAr ? "تم إنشاء المجموعة ✓" : "Groupe créé ✓")) {
      setName("");
    }
  };

  const join = async () => {
    if (code.trim().length < 4) return;
    if (await post({ action: "join", code: code.trim() }, isAr ? "انضممت إلى المجموعة ✓" : "Tu as rejoint le groupe ✓")) {
      setCode("");
    }
  };

  const copyCode = (c: string) => {
    navigator.clipboard?.writeText(c).then(
      () => toast.success(isAr ? "نُسخ الرمز" : "Code copié"),
      () => {},
    );
  };

  const inputClass =
    "flex-1 h-11 px-4 bg-surface border border-line-strong rounded-btn text-fg focus:outline-none focus:border-fg";

  return (
    <div className="space-y-6">
      {/* Create */}
      <div className="bg-surface border border-line rounded-card p-6">
        <h2 className="font-semibold text-fg mb-2">
          {isAr ? "أنشئ مجموعة" : "Créer un groupe"}
        </h2>
        <p className="text-fg-soft text-sm mb-4">
          {isAr
            ? "أنشئ مجموعة مراجعة وشارك رمز الدعوة مع أصدقائك."
            : "Crée un groupe de révision et partage le code d'invitation avec tes amis."}
        </p>
        <div className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && create()}
            placeholder={isAr ? "اسم المجموعة" : "Nom du groupe"}
            maxLength={60}
            className={inputClass}
          />
          <button onClick={create} disabled={busy || name.trim().length < 2} className="btn btn-primary disabled:opacity-50">
            {isAr ? "إنشاء" : "Créer"}
          </button>
        </div>
      </div>

      {/* Join */}
      <div className="bg-surface border border-line rounded-card p-6">
        <h2 className="font-semibold text-fg mb-2">
          {isAr ? "انضم بواسطة رمز" : "Rejoindre avec un code"}
        </h2>
        <p className="text-fg-soft text-sm mb-4">
          {isAr ? "أدخل رمز الدعوة الذي شاركه صديقك." : "Entre le code d'invitation partagé par un ami."}
        </p>
        <div className="flex gap-2">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && join()}
            placeholder={isAr ? "الرمز" : "Code"}
            maxLength={8}
            className={`${inputClass} uppercase tracking-widest font-mono`}
          />
          <button onClick={join} disabled={busy || code.trim().length < 4} className="btn btn-primary disabled:opacity-50">
            {isAr ? "انضمام" : "Rejoindre"}
          </button>
        </div>
      </div>

      {/* My groups */}
      <div>
        <h2 className="font-semibold text-fg mb-3">
          {isAr ? "مجموعاتي" : "Mes groupes"}
        </h2>
        {loading ? (
          <div className="bg-surface border border-line rounded-card p-8 text-center text-fg-soft text-sm">
            {isAr ? "جارٍ التحميل…" : "Chargement…"}
          </div>
        ) : groups.length === 0 ? (
          <div className="bg-surface border border-line rounded-card p-8 text-center">
            <div className="text-3xl mb-2">👥</div>
            <p className="text-fg-soft text-sm">
              {isAr ? "لست في أي مجموعة بعد." : "Tu n'es dans aucun groupe pour l'instant."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {groups.map((g) => (
              <div key={g.id} className="bg-surface border border-line rounded-card p-4 flex items-center gap-4">
                <span className="w-11 h-11 rounded-xl bg-navy text-white font-bold flex items-center justify-center flex-shrink-0">
                  {g.name.slice(0, 2).toUpperCase()}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-fg flex items-center gap-2">
                    {g.name}
                    {g.isOwner && (
                      <span className="text-[10px] font-bold bg-gold/20 text-amber-800 dark:text-gold border border-gold/40 rounded-full px-2 py-0.5">
                        {isAr ? "مالك" : "Créateur"}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-fg-soft mt-0.5">
                    {g.members}/{g.maxMembers} {isAr ? "أعضاء" : "membres"}
                  </div>
                </div>
                <button
                  onClick={() => copyCode(g.inviteCode)}
                  className="text-xs font-mono font-bold uppercase tracking-widest bg-surface-2 border border-line rounded-lg px-3 py-2 hover:border-fg/40 flex items-center gap-1.5"
                  title={isAr ? "نسخ الرمز" : "Copier le code"}
                >
                  {g.inviteCode}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
