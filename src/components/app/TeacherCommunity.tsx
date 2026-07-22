"use client";

/**
 * Teacher community feed (approved teachers only — the page already gates it).
 * Create posts, read the feed, and comment. Talks to /api/teacher/community.
 */

import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Comment {
  id: string;
  author: string;
  body: string;
  createdAt: string;
}
interface Post {
  id: string;
  author: string;
  kind: string;
  title: string | null;
  body: string;
  createdAt: string;
  comments: Comment[];
}

const KIND_LABEL: Record<string, { fr: string; ar: string; color: string }> = {
  note: { fr: "Note", ar: "ملاحظة", color: "bg-surface-3 text-fg-soft" },
  resource: { fr: "Ressource", ar: "مورد", color: "bg-blue-100 dark:bg-blue-950/30 text-blue-800 dark:text-blue-300" },
  question: { fr: "Question", ar: "سؤال", color: "bg-amber-100 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300" },
  tip: { fr: "Astuce", ar: "نصيحة", color: "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300" },
};

export function TeacherCommunity({ locale }: { locale: "fr" | "ar" }) {
  const isAr = locale === "ar";
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [kind, setKind] = useState("resource");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [commentText, setCommentText] = useState<Record<string, string>>({});

  const load = async () => {
    try {
      const res = await fetch("/api/teacher/community", { cache: "no-store" });
      const json = await res.json();
      if (res.ok && Array.isArray(json.posts)) setPosts(json.posts);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { void load(); }, []);

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString(isAr ? "ar-DZ" : "fr-DZ", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  const submitPost = async () => {
    if (body.trim().length < 2) return;
    setBusy(true);
    try {
      const res = await fetch("/api/teacher/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "post", kind, title, body }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erreur");
      setPosts(json.posts);
      setTitle(""); setBody("");
      toast.success(isAr ? "تم النشر ✓" : "Publié ✓");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusy(false);
    }
  };

  const submitComment = async (postId: string) => {
    const text = (commentText[postId] ?? "").trim();
    if (!text) return;
    try {
      const res = await fetch("/api/teacher/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "comment", postId, body: text }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erreur");
      setPosts(json.posts);
      setCommentText((c) => ({ ...c, [postId]: "" }));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    }
  };

  const inputClass =
    "w-full bg-surface border border-line-strong rounded-btn px-3 py-2 text-sm text-fg focus:outline-none focus:border-fg";

  return (
    <div>
      {/* Composer */}
      <div className="bg-surface border border-line rounded-card p-5 mb-6">
        <div className="flex gap-2 mb-3 flex-wrap">
          {Object.entries(KIND_LABEL).map(([k, v]) => (
            <button
              key={k}
              onClick={() => setKind(k)}
              className={`text-xs font-semibold rounded-full px-3 py-1.5 border transition ${
                kind === k ? "border-fg text-fg" : "border-line text-fg-soft hover:border-fg/40"
              }`}
            >
              {isAr ? v.ar : v.fr}
            </button>
          ))}
        </div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={isAr ? "عنوان (اختياري)" : "Titre (optionnel)"}
          className={`${inputClass} mb-2`}
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          placeholder={isAr ? "شارك موردًا أو اطرح سؤالاً…" : "Partage une ressource ou pose une question…"}
          className={inputClass}
        />
        <button onClick={submitPost} disabled={busy || body.trim().length < 2} className="btn btn-primary btn-sm mt-3 disabled:opacity-50">
          {isAr ? "نشر" : "Publier"}
        </button>
      </div>

      {/* Feed */}
      {loading ? (
        <div className="text-center text-fg-soft text-sm py-8">{isAr ? "جارٍ التحميل…" : "Chargement…"}</div>
      ) : posts.length === 0 ? (
        <div className="bg-surface border border-line rounded-card p-10 text-center text-fg-soft text-sm">
          {isAr ? "لا توجد منشورات بعد. كن أول من ينشر!" : "Aucune publication pour l'instant. Sois le premier à publier !"}
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((p) => {
            const k = KIND_LABEL[p.kind] ?? KIND_LABEL.note;
            return (
              <article key={p.id} className="bg-surface border border-line rounded-card p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-8 h-8 rounded-full bg-navy text-white text-xs font-bold flex items-center justify-center">
                    {p.author.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-fg">{p.author}</div>
                    <div className="text-xs text-fg-faint">{fmt(p.createdAt)}</div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${k.color}`}>{isAr ? k.ar : k.fr}</span>
                </div>
                {p.title && <h3 className="font-bold text-fg mb-1">{p.title}</h3>}
                <p className="text-sm text-fg leading-relaxed whitespace-pre-line">{p.body}</p>

                {/* Comments */}
                {p.comments.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-line space-y-2">
                    {p.comments.map((c) => (
                      <div key={c.id} className="flex gap-2 text-sm">
                        <span className="font-semibold text-fg-soft flex-shrink-0">{c.author.split(" ")[0]} :</span>
                        <span className="text-fg">{c.body}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add comment */}
                <div className="mt-3 flex gap-2">
                  <input
                    value={commentText[p.id] ?? ""}
                    onChange={(e) => setCommentText((c) => ({ ...c, [p.id]: e.target.value }))}
                    onKeyDown={(e) => e.key === "Enter" && submitComment(p.id)}
                    placeholder={isAr ? "أضف تعليقًا…" : "Ajoute un commentaire…"}
                    className="flex-1 bg-surface-2 border border-line rounded-btn px-3 py-1.5 text-sm text-fg focus:outline-none focus:border-fg"
                  />
                  <button onClick={() => submitComment(p.id)} className="btn btn-outline btn-sm">
                    {isAr ? "إرسال" : "Envoyer"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
