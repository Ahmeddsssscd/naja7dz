"use client";

/**
 * RequestServiceForm — buyer-facing form on a helper detail page.
 *
 * Two flows:
 *   - "ask_student" : flat 400 DA (subscribers get -50% → 200 DA). Buyer
 *                     types a brief, taps Pay & Open Chat. We create the
 *                     service_requests row + a chat_thread, redirect to
 *                     a Chargily checkout. Once paid (webhook), the
 *                     thread unlocks.
 *   - "negotiate"   : buyer types a brief, taps Open Chat. We create the
 *                     row + thread immediately. The helper proposes a
 *                     price inside the chat (kind=price), buyer pays via
 *                     a link the helper sends.
 *
 * The Chargily integration is stubbed for now — the API returns a mock
 * "checkout URL" pointing back to the thread. Real wiring requires a new
 * Chargily checkout flow type ("service_request") in /api/checkout.
 */

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { ArrowRightIcon, HandshakeIcon, ClipboardIcon } from "@/components/Icon";

interface Props {
  helperId: string;
  helperName: string;
}

type Flow = "ask_student" | "negotiate";

export function RequestServiceForm({ helperId, helperName }: Props) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const router = useRouter();

  const [flow, setFlow] = useState<Flow>("ask_student");
  const [brief, setBrief] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async () => {
    if (brief.trim().length < 15) {
      setErr(isAr ? "اكتب على الأقل ١٥ حرفاً" : "Décris ton besoin (15 caractères min)");
      return;
    }
    setSubmitting(true); setErr(null);
    try {
      const r = await fetch("/api/marketplace/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ helperId, flow, brief: brief.trim() }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j.error ?? "Erreur");
      }
      const json = await r.json();
      // For ask_student, json.checkout_url should be a Chargily link.
      // For negotiate, json.thread_id is enough — chat opens immediately.
      if (json.checkout_url) {
        window.location.href = json.checkout_url;
      } else if (json.thread_id) {
        router.push(`/fac/chat/${json.thread_id}`);
      } else {
        throw new Error("Réponse inattendue");
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-surface border border-line rounded-card p-6">
      <h3 className="font-semibold text-fg mb-3">
        {isAr ? `اطلب من ${helperName}` : `Demander à ${helperName}`}
      </h3>

      {/* Flow toggle */}
      <div className="grid grid-cols-2 gap-2 mb-5">
        <FlowChip
          icon={<HandshakeIcon size={18} />}
          label={isAr ? "سؤال سريع" : "Question rapide"}
          sub={isAr ? "٤٠٠ دج" : "400 DA"}
          active={flow === "ask_student"}
          onClick={() => setFlow("ask_student")}
        />
        <FlowChip
          icon={<ClipboardIcon size={18} />}
          label={isAr ? "مشروع" : "Projet"}
          sub={isAr ? "سعر تفاوضي" : "Sur devis"}
          active={flow === "negotiate"}
          onClick={() => setFlow("negotiate")}
        />
      </div>

      {/* Pricing explainer per flow */}
      <div className="bg-surface-3 border border-line rounded-btn p-3 mb-4 text-xs text-fg-soft">
        {flow === "ask_student" ? (
          <>
            <strong className="text-fg block mb-1">{isAr ? "كيف تجري" : "Comment ça marche"}</strong>
            {isAr
              ? "ادفع ٤٠٠ دج لفتح محادثة. اطرح سؤالك، ويردّ خلال ٢٤ ساعة. مع اشتراك Najah، السعر ٢٠٠ دج (-٥٠٪)."
              : "Paie 400 DA pour ouvrir le chat. Pose ta question, réponse sous 24h. Avec un abonnement Najah, le tarif passe à 200 DA (-50%)."}
          </>
        ) : (
          <>
            <strong className="text-fg block mb-1">{isAr ? "كيف تجري" : "Comment ça marche"}</strong>
            {isAr
              ? "افتح محادثة مجاناً. شرح حاجتك، يقترح السعر، تدفع عبر رابط آمن داخل المحادثة."
              : "Ouvre le chat gratuitement. Explique ton besoin, il te propose un prix, tu paies via un lien Chargily dans le chat."}
          </>
        )}
      </div>

      <label className="block text-xs font-semibold text-fg mb-1.5">
        {flow === "ask_student" ? (isAr ? "سؤالك" : "Ta question") : (isAr ? "وصف المشروع" : "Brief du projet")}{" "}
        <span className="text-red-600">*</span>
      </label>
      <textarea
        value={brief}
        onChange={(e) => setBrief(e.target.value)}
        rows={4}
        placeholder={
          flow === "ask_student"
            ? (isAr ? "مثال: أنا في السنة الثانية...." : "Ex : Je suis en 2e année et j'hésite entre…")
            : (isAr ? "مثال: مذكرة في علوم الحاسوب،..." : "Ex : Mémoire en informatique, 60 pages, deadline juin…")
        }
        className="w-full rounded-btn border border-line bg-surface text-fg px-3 py-2 text-sm focus:outline-none focus:border-fg/40 mb-3"
      />

      {err && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-300 text-red-700 dark:text-red-400 rounded-btn p-2 text-xs mb-3">
          {err}
        </div>
      )}

      <button
        onClick={submit}
        disabled={brief.trim().length < 15 || submitting}
        className={`btn w-full inline-flex items-center justify-center gap-2 ${
          brief.trim().length < 15 ? "btn-outline opacity-50" : "btn-cta"
        }`}
      >
        {submitting
          ? (isAr ? "..." : "…")
          : flow === "ask_student"
          ? (isAr ? "ادفع ٤٠٠ دج وافتح المحادثة" : "Payer 400 DA & ouvrir le chat")
          : (isAr ? "افتح المحادثة" : "Ouvrir le chat")}
        <ArrowRightIcon size={14} />
      </button>
    </div>
  );
}

function FlowChip({
  icon, label, sub, active, onClick,
}: { icon: React.ReactNode; label: string; sub: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-card border-2 p-3 text-start transition ${
        active ? "border-gold bg-gold/10" : "border-line bg-surface hover:border-fg/40"
      }`}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className={active ? "text-gold" : "text-fg-soft"}>{icon}</span>
        <span className={`font-semibold text-sm ${active ? "text-fg" : "text-fg-soft"}`}>{label}</span>
      </div>
      <div className="text-xs text-fg-soft">{sub}</div>
    </button>
  );
}
