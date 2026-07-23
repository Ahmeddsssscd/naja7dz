"use client";

/**
 * Professor message center. Two filterable inboxes:
 *   - Élèves      → student booking requests addressed to this professor
 *   - Professeurs → prof-to-prof DM conversations (open a thread + reply)
 *
 * Talks to /api/teacher/messages.
 */

import { useEffect, useState } from "react";
import { toast } from "sonner";

interface StudentRequest {
  id: string;
  student_name: string | null;
  grade: string | null;
  preferred_mode: string | null;
  phone: string | null;
  message: string | null;
  status: string;
  created_at: string;
}
interface Conversation {
  peer: string;
  peerName: string;
  last: string;
  at: string;
  unread: number;
}
interface ThreadMsg { id: string; mine: boolean; body: string; at: string }

export function ProfessorInbox({ locale }: { locale: "fr" | "ar" }) {
  const isAr = locale === "ar";
  const [tab, setTab] = useState<"students" | "profs">("students");
  const [requests, setRequests] = useState<StudentRequest[]>([]);
  const [convs, setConvs] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [openPeer, setOpenPeer] = useState<{ id: string; name: string } | null>(null);
  const [thread, setThread] = useState<ThreadMsg[]>([]);
  const [draft, setDraft] = useState("");

  const load = async () => {
    try {
      const res = await fetch("/api/teacher/messages", { cache: "no-store" });
      const json = await res.json();
      if (res.ok) {
        setRequests(json.student_requests ?? []);
        setConvs(json.conversations ?? []);
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { void load(); }, []);

  const openThread = async (peer: string, name: string) => {
    setOpenPeer({ id: peer, name });
    setThread([]);
    const res = await fetch(`/api/teacher/messages?peer=${peer}`, { cache: "no-store" });
    const json = await res.json();
    if (res.ok) setThread(json.thread ?? []);
  };

  const send = async () => {
    if (!openPeer || draft.trim().length < 1) return;
    const text = draft.trim();
    setDraft("");
    setThread((t) => [...t, { id: `tmp-${Date.now()}`, mine: true, body: text, at: new Date().toISOString() }]);
    const res = await fetch("/api/teacher/messages", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipientId: openPeer.id, body: text }),
    });
    if (!res.ok) toast.error(isAr ? "تعذّر الإرسال" : "Envoi impossible");
    else void load();
  };

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString(isAr ? "ar-DZ" : "fr-DZ", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  // Thread view
  if (openPeer) {
    return (
      <div>
        <button onClick={() => { setOpenPeer(null); void load(); }} className="text-sm text-fg-soft hover:text-fg mb-4">
          ← {isAr ? "كل المحادثات" : "Toutes les conversations"}
        </button>
        <div className="bg-surface border border-line rounded-card overflow-hidden">
          <div className="px-5 py-3 border-b border-line font-semibold text-fg">{openPeer.name}</div>
          <div className="p-4 space-y-2 max-h-[50vh] overflow-y-auto">
            {thread.length === 0 && <p className="text-sm text-fg-faint text-center py-6">{isAr ? "ابدأ المحادثة" : "Démarre la conversation"}</p>}
            {thread.map((m) => (
              <div key={m.id} className={`flex ${m.mine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${m.mine ? "bg-navy text-white dark:bg-gold dark:text-navy" : "bg-surface-2 text-fg border border-line"}`}>
                  {m.body}
                  <div className={`text-[10px] mt-1 ${m.mine ? "text-white/60 dark:text-navy/60" : "text-fg-faint"}`}>{fmt(m.at)}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-line flex gap-2">
            <input
              value={draft} onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={isAr ? "اكتب رسالة…" : "Écris un message…"}
              className="flex-1 bg-surface-2 border border-line rounded-btn px-3 py-2 text-sm text-fg focus:outline-none focus:border-fg"
            />
            <button onClick={send} className="btn btn-primary btn-sm">{isAr ? "إرسال" : "Envoyer"}</button>
          </div>
        </div>
      </div>
    );
  }

  const studentCount = requests.filter((r) => r.status === "pending").length;
  const unreadDms = convs.reduce((s, c) => s + c.unread, 0);

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        <TabButton active={tab === "students"} onClick={() => setTab("students")} label={isAr ? "طلبات التلاميذ" : "Demandes d'élèves"} badge={studentCount} />
        <TabButton active={tab === "profs"} onClick={() => setTab("profs")} label={isAr ? "رسائل الأساتذة" : "Messages professeurs"} badge={unreadDms} />
      </div>

      {loading ? (
        <div className="text-center text-fg-soft text-sm py-10">{isAr ? "جارٍ التحميل…" : "Chargement…"}</div>
      ) : tab === "students" ? (
        requests.length === 0 ? (
          <Empty text={isAr ? "لا توجد طلبات من التلاميذ بعد." : "Aucune demande d'élève pour l'instant."} hint={isAr ? "تظهر هنا طلبات الحجز الموجّهة إلى ملفك في دليل الأساتذة." : "Les demandes de réservation adressées à ton profil du répertoire apparaissent ici."} />
        ) : (
          <div className="space-y-3">
            {requests.map((r) => (
              <div key={r.id} className="bg-surface border border-line rounded-card p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-fg">{r.student_name || (isAr ? "تلميذ" : "Élève")}</span>
                  <span className="text-xs text-fg-faint">{fmt(r.created_at)}</span>
                </div>
                <div className="text-xs text-fg-soft mb-2">
                  {r.grade ?? "—"}{r.preferred_mode ? ` · ${r.preferred_mode}` : ""}{r.phone ? ` · ${r.phone}` : ""}
                </div>
                {r.message && <p className="text-sm text-fg">{r.message}</p>}
              </div>
            ))}
          </div>
        )
      ) : convs.length === 0 ? (
        <Empty text={isAr ? "لا توجد محادثات بعد." : "Aucune conversation pour l'instant."} hint={isAr ? "من دليل الأساتذة، افتح ملف زميل واضغط «مراسلة»." : "Depuis le réseau, ouvre le profil d'un collègue et clique « Message »."} />
      ) : (
        <div className="space-y-2">
          {convs.map((c) => (
            <button key={c.peer} onClick={() => openThread(c.peer, c.peerName)}
              className="w-full text-start bg-surface border border-line rounded-card p-4 hover:border-gold transition flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-navy text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                {c.peerName.split(" ").map((s) => s[0]).slice(0, 2).join("")}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-fg text-sm flex items-center gap-2">
                  {c.peerName}
                  {c.unread > 0 && <span className="text-[10px] bg-gold text-navy font-bold rounded-full px-1.5">{c.unread}</span>}
                </div>
                <div className="text-xs text-fg-soft truncate">{c.last}</div>
              </div>
              <span className="text-xs text-fg-faint">{fmt(c.at)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function TabButton({ active, onClick, label, badge }: { active: boolean; onClick: () => void; label: string; badge: number }) {
  return (
    <button onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-semibold transition flex items-center gap-2 ${active ? "bg-navy text-white dark:bg-gold dark:text-navy" : "bg-surface-2 text-fg-soft border border-line"}`}>
      {label}
      {badge > 0 && <span className={`text-[10px] rounded-full px-1.5 font-bold ${active ? "bg-white/25 dark:bg-navy/20" : "bg-gold text-navy"}`}>{badge}</span>}
    </button>
  );
}

function Empty({ text, hint }: { text: string; hint: string }) {
  return (
    <div className="bg-surface border border-line rounded-card p-10 text-center">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="mx-auto mb-3 text-fg-faint"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
      <p className="text-fg-soft text-sm">{text}</p>
      <p className="text-fg-faint text-xs mt-1 max-w-sm mx-auto">{hint}</p>
    </div>
  );
}
