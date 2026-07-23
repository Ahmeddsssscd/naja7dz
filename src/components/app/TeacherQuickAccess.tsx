"use client";

/**
 * Header quick-access for the PRO teacher space: two icon buttons —
 * Messages and Communauté — that open scrollable dropdown panels right from
 * the top bar, so a teacher reaches them from anywhere without leaving the
 * page. Each panel loads on open and links through to the full view.
 */

import { useEffect, useRef, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";

type Panel = "messages" | "community" | null;

interface Conversation { peer: string; peerName: string; last: string; at: string; unread: number }
interface StudentReq { id: string; student_name: string | null; grade: string | null; created_at: string; message: string | null }
interface Post { id: string; author: string; kind: string; title: string | null; body: string; createdAt: string; comments: { id: string }[] }

export function TeacherQuickAccess() {
  const isAr = useLocale() === "ar";
  const router = useRouter();
  const [open, setOpen] = useState<Panel>(null);
  const [convs, setConvs] = useState<Conversation[]>([]);
  const [reqs, setReqs] = useState<StudentReq[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Prefetch unread count once for the badge.
  useEffect(() => {
    fetch("/api/teacher/messages", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (!j) return;
        const c: Conversation[] = j.conversations ?? [];
        setUnread(c.reduce((s, x) => s + x.unread, 0));
      })
      .catch(() => {});
  }, []);

  // Close on outside click / Esc.
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);

  const toggle = async (panel: Panel) => {
    const next = open === panel ? null : panel;
    setOpen(next);
    if (!next) return;
    setLoading(true);
    try {
      if (next === "messages") {
        const r = await fetch("/api/teacher/messages", { cache: "no-store" });
        const j = await r.json();
        if (r.ok) { setConvs(j.conversations ?? []); setReqs(j.student_requests ?? []); setUnread((j.conversations ?? []).reduce((s: number, x: Conversation) => s + x.unread, 0)); }
      } else {
        const r = await fetch("/api/teacher/community", { cache: "no-store" });
        const j = await r.json();
        if (r.ok) setPosts(j.posts ?? []);
      }
    } finally {
      setLoading(false);
    }
  };

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString(isAr ? "ar-DZ" : "fr-DZ", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  const go = (href: string) => { setOpen(null); router.push(href as never); };

  return (
    <div ref={wrapRef} className="relative flex items-center gap-1">
      {/* Messages icon */}
      <button
        onClick={() => toggle("messages")}
        aria-label={isAr ? "الرسائل" : "Messages"}
        className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-colors ${open === "messages" ? "bg-surface-3 text-fg" : "text-fg-soft hover:bg-surface-3 hover:text-fg"}`}
      >
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        {unread > 0 && <span className="absolute -top-0.5 -end-0.5 min-w-4 h-4 px-1 rounded-full bg-gold text-navy text-[10px] font-bold flex items-center justify-center">{unread}</span>}
      </button>

      {/* Community icon */}
      <button
        onClick={() => toggle("community")}
        aria-label={isAr ? "المجتمع" : "Communauté"}
        className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${open === "community" ? "bg-surface-3 text-fg" : "text-fg-soft hover:bg-surface-3 hover:text-fg"}`}
      >
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute top-11 end-0 w-[340px] max-w-[92vw] bg-surface border border-line rounded-card shadow-card-hover overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-line">
            <span className="font-semibold text-fg text-sm">
              {open === "messages" ? (isAr ? "الرسائل والطلبات" : "Messages & demandes") : (isAr ? "المجتمع" : "Communauté")}
            </span>
            <button onClick={() => go(open === "messages" ? "/enseignant/messages" : "/enseignant/communaute")} className="text-xs text-gold font-semibold hover:underline">
              {isAr ? "عرض الكل" : "Voir tout"}
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center text-fg-soft text-sm">{isAr ? "جارٍ التحميل…" : "Chargement…"}</div>
            ) : open === "messages" ? (
              <MessagesPanel convs={convs} reqs={reqs} fmt={fmt} isAr={isAr} onOpen={go} />
            ) : (
              <CommunityPanel posts={posts} fmt={fmt} isAr={isAr} onOpen={() => go("/enseignant/communaute")} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MessagesPanel({ convs, reqs, fmt, isAr, onOpen }: { convs: Conversation[]; reqs: StudentReq[]; fmt: (s: string) => string; isAr: boolean; onOpen: (h: string) => void }) {
  if (convs.length === 0 && reqs.length === 0) {
    return <div className="p-6 text-center text-fg-soft text-sm">{isAr ? "لا توجد رسائل أو طلبات." : "Aucun message ni demande."}</div>;
  }
  return (
    <div>
      {reqs.length > 0 && (
        <div>
          <div className="px-4 pt-3 pb-1 text-[11px] font-bold text-fg-faint uppercase tracking-wider">{isAr ? "طلبات التلاميذ" : "Demandes d'élèves"}</div>
          {reqs.slice(0, 5).map((r) => (
            <button key={r.id} onClick={() => onOpen("/enseignant/messages")} className="w-full text-start px-4 py-2.5 hover:bg-surface-2 flex items-start gap-3">
              <span className="w-8 h-8 rounded-full bg-surface-3 text-fg text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{(r.student_name ?? "E")[0]}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-fg truncate">{r.student_name || (isAr ? "تلميذ" : "Élève")}{r.grade ? ` · ${r.grade}` : ""}</span>
                <span className="block text-xs text-fg-soft truncate">{r.message || (isAr ? "طلب حجز" : "Demande de réservation")}</span>
              </span>
              <span className="text-[10px] text-fg-faint flex-shrink-0">{fmt(r.created_at)}</span>
            </button>
          ))}
        </div>
      )}
      {convs.length > 0 && (
        <div>
          <div className="px-4 pt-3 pb-1 text-[11px] font-bold text-fg-faint uppercase tracking-wider">{isAr ? "رسائل الأساتذة" : "Messages"}</div>
          {convs.slice(0, 8).map((c) => (
            <button key={c.peer} onClick={() => onOpen("/enseignant/messages")} className="w-full text-start px-4 py-2.5 hover:bg-surface-2 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-navy text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{c.peerName.split(" ").map((s) => s[0]).slice(0, 2).join("")}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-fg truncate flex items-center gap-1.5">{c.peerName}{c.unread > 0 && <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />}</span>
                <span className="block text-xs text-fg-soft truncate">{c.last}</span>
              </span>
              <span className="text-[10px] text-fg-faint flex-shrink-0">{fmt(c.at)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CommunityPanel({ posts, fmt, isAr, onOpen }: { posts: Post[]; fmt: (s: string) => string; isAr: boolean; onOpen: () => void }) {
  if (posts.length === 0) {
    return <div className="p-6 text-center text-fg-soft text-sm">{isAr ? "لا توجد منشورات بعد." : "Aucune publication pour l'instant."}</div>;
  }
  return (
    <div>
      {posts.slice(0, 8).map((p) => (
        <button key={p.id} onClick={onOpen} className="w-full text-start px-4 py-3 hover:bg-surface-2 border-b last:border-b-0 border-line">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-6 h-6 rounded-full bg-navy text-white text-[10px] font-bold flex items-center justify-center">{p.author.split(" ").map((s) => s[0]).slice(0, 2).join("")}</span>
            <span className="text-xs font-medium text-fg">{p.author}</span>
            <span className="text-[10px] text-fg-faint ms-auto">{fmt(p.createdAt)}</span>
          </div>
          {p.title && <div className="text-sm font-semibold text-fg leading-snug">{p.title}</div>}
          <div className="text-xs text-fg-soft line-clamp-2">{p.body}</div>
        </button>
      ))}
    </div>
  );
}
