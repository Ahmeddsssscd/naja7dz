"use client";

/**
 * ChatThread — client-side chat UI for /fac/chat/[threadId].
 *
 * Polls /api/marketplace/chat/[threadId]/messages every 5s. Sends new
 * messages via POST. Helpers can also send "price proposals" (kind=price)
 * which render as a pay-now card on the buyer side.
 */

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { ArrowRightIcon } from "@/components/Icon";

interface Message {
  id: string;
  senderId: string;
  kind: string;
  body: string;
  createdAt: string;
}

interface Props {
  threadId: string;
  initialMessages: Message[];
  currentUserId: string;
  role: "buyer" | "helper";
  request: { flow: string; status: string; price_da: number | null } | null;
}

export function ChatThread({ threadId, initialMessages, currentUserId, role, request }: Props) {
  const locale = useLocale();
  const isAr = locale === "ar";

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  // Helper-only: price proposal modal
  const [proposingPrice, setProposingPrice] = useState(false);
  const [priceAmount, setPriceAmount] = useState("");
  const [priceNote, setPriceNote] = useState("");

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  // Poll every 5s
  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const r = await fetch(`/api/marketplace/chat/${threadId}/messages`);
        if (!r.ok) return;
        const j = await r.json();
        if (Array.isArray(j.messages)) setMessages(j.messages);
      } catch { /* ignore */ }
    }, 5000);
    return () => clearInterval(id);
  }, [threadId]);

  const send = async (kind: "text" | "price", body: string) => {
    if (!body.trim()) return;
    setSending(true);
    try {
      const r = await fetch(`/api/marketplace/chat/${threadId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, body }),
      });
      if (r.ok) {
        const j = await r.json();
        if (j.message) setMessages((m) => [...m, j.message]);
      }
    } catch { /* ignore */ }
    finally { setSending(false); }
  };

  const sendText = async () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    await send("text", text);
  };

  const sendPriceProposal = async () => {
    const amount = Number(priceAmount);
    if (!Number.isFinite(amount) || amount <= 0) return;
    const payload = JSON.stringify({ amount, note: priceNote.trim() });
    await send("price", payload);
    setProposingPrice(false);
    setPriceAmount(""); setPriceNote("");
  };

  return (
    <div className="bg-surface border border-line rounded-card overflow-hidden flex flex-col h-[65vh]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-surface-2/30">
        {messages.length === 0 && (
          <div className="text-center text-sm text-fg-soft mt-12">
            {isAr ? "ابدأ المحادثة..." : "Démarre la conversation…"}
          </div>
        )}
        {messages.map((m) => (
          <Bubble key={m.id} message={m} isMine={m.senderId === currentUserId} role={role} isAr={isAr} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Compose */}
      <div className="border-t border-line bg-surface p-3">
        {role === "helper" && request?.flow === "negotiate" && (
          <button
            onClick={() => setProposingPrice(true)}
            className="text-xs font-semibold text-gold hover:text-gold-soft mb-2 inline-flex items-center gap-1"
          >
            + {isAr ? "اقترح سعراً" : "Proposer un prix"}
          </button>
        )}
        <div className="flex items-end gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendText();
              }
            }}
            rows={1}
            placeholder={isAr ? "اكتب رسالة..." : "Écris un message…"}
            className="flex-1 rounded-btn border border-line bg-surface text-fg px-3 py-2 text-sm focus:outline-none focus:border-fg/40 resize-none"
            style={{ minHeight: 40, maxHeight: 120 }}
          />
          <button onClick={sendText} disabled={!draft.trim() || sending} className="btn btn-primary inline-flex items-center gap-1.5">
            {isAr ? "إرسال" : "Envoyer"} <ArrowRightIcon size={14} />
          </button>
        </div>
      </div>

      {/* Price proposal modal */}
      {proposingPrice && (
        <div className="fixed inset-0 z-50 bg-fg/60 flex items-center justify-center p-4" onClick={() => setProposingPrice(false)}>
          <div className="bg-surface border border-line rounded-card p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-fg mb-1">{isAr ? "اقترح سعراً" : "Proposer un prix"}</h3>
            <p className="text-xs text-fg-soft mb-4">
              {isAr
                ? "سيرى المشتري بطاقة دفع داخل المحادثة."
                : "L'acheteur verra une carte de paiement dans le chat."}
            </p>
            <label className="block text-xs font-semibold text-fg mb-1.5">{isAr ? "السعر (دج)" : "Prix (DA)"}</label>
            <input
              value={priceAmount}
              onChange={(e) => setPriceAmount(e.target.value.replace(/[^\d]/g, ""))}
              type="text"
              placeholder="5000"
              className="w-full rounded-btn border border-line bg-surface text-fg px-3 py-2 text-sm focus:outline-none focus:border-fg/40 mb-3"
            />
            <label className="block text-xs font-semibold text-fg mb-1.5">{isAr ? "ملاحظة (اختياري)" : "Note (facultatif)"}</label>
            <textarea
              value={priceNote}
              onChange={(e) => setPriceNote(e.target.value)}
              rows={2}
              placeholder={isAr ? "ما يشمله السعر..." : "Ce que ça couvre…"}
              className="w-full rounded-btn border border-line bg-surface text-fg px-3 py-2 text-sm focus:outline-none focus:border-fg/40 mb-4"
            />
            <div className="flex gap-2">
              <button onClick={() => setProposingPrice(false)} className="btn btn-outline flex-1">{isAr ? "إلغاء" : "Annuler"}</button>
              <button onClick={sendPriceProposal} disabled={!priceAmount} className="btn btn-cta flex-1">
                {isAr ? "إرسال الاقتراح" : "Envoyer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Bubble({ message, isMine, role, isAr }: { message: Message; isMine: boolean; role: "buyer" | "helper"; isAr: boolean }) {
  if (message.kind === "system") {
    return (
      <div className="text-center text-xs text-fg-faint italic py-2">
        {message.body}
      </div>
    );
  }

  if (message.kind === "price") {
    let payload: { amount?: number; note?: string } = {};
    try { payload = JSON.parse(message.body); } catch { /* ignore */ }
    return (
      <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
        <div className="bg-gold/15 border-2 border-gold rounded-card p-4 max-w-[85%] md:max-w-md">
          <div className="text-xs font-semibold text-gold uppercase tracking-wider mb-1">
            {isAr ? "اقتراح سعر" : "Proposition de prix"}
          </div>
          <div className="text-3xl font-bold text-fg leading-none mb-1">
            {payload.amount?.toLocaleString()} <span className="text-base font-medium text-fg-soft">DA</span>
          </div>
          {payload.note && <p className="text-sm text-fg-soft mt-2">{payload.note}</p>}
          {role === "buyer" && !isMine && (
            <button className="btn btn-cta w-full mt-3 text-sm">
              {isAr ? `ادفع ${payload.amount} دج` : `Payer ${payload.amount} DA`}
            </button>
          )}
          {(role === "helper" && isMine) && (
            <div className="text-xs text-fg-faint mt-2">{isAr ? "في انتظار الدفع..." : "En attente de paiement…"}</div>
          )}
        </div>
      </div>
    );
  }

  // text
  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`rounded-card px-3.5 py-2 max-w-[85%] md:max-w-md ${
          isMine ? "bg-fg text-bg" : "bg-surface border border-line text-fg"
        }`}
      >
        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.body}</p>
        <div className={`text-[10px] mt-1 ${isMine ? "text-bg/60" : "text-fg-faint"}`}>
          {new Date(message.createdAt).toLocaleTimeString(isAr ? "ar-DZ" : "fr-FR", { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  );
}
