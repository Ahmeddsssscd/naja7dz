"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "@/i18n/routing";

type Message = { role: "user" | "assistant"; text: string };

const INITIAL: Message = {
  role: "assistant",
  text:
    "Salut ! Je suis ton tuteur Najaح. Pose-moi n'importe quelle question sur tes cours — je peux expliquer une notion, corriger un exercice, ou t'aider à comprendre une erreur. En quoi puis-je t'aider aujourd'hui ?",
};

const MOCK_REPLIES = [
  "Bonne question ! Décomposons ça étape par étape. D'abord, on isole le terme avec x, puis on divise des deux côtés. Veux-tu que je te montre avec un exemple concret ?",
  "C'est un point qui revient souvent. La règle est simple : tu peux la mémoriser en pensant à un cas pratique. Essaie de l'appliquer à un exercice et dis-moi si ça reste flou.",
  "Tu es sur la bonne voie. La prochaine étape consiste à vérifier ton résultat en remplaçant la valeur trouvée dans l'équation initiale. Si les deux côtés sont égaux, c'est bon !",
  "Parfait, tu as compris l'idée principale. Pour aller plus loin, je te suggère 3 exercices ciblés que je peux te générer maintenant. Tu veux ?",
];

export function TutorChat() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([INITIAL]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", text: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setThinking(true);
    // Mock AI reply
    setTimeout(() => {
      const reply = MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)];
      setMessages((m) => [...m, { role: "assistant", text: reply }]);
      setThinking(false);
    }, 900 + Math.random() * 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-2">
      <header className="bg-surface border-b border-line sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-5 h-16 flex items-center gap-3">
          <button onClick={() => router.push("/eleve")} className="text-fg-soft" aria-label="Retour">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <span className="w-9 h-9 rounded-full bg-navy text-white flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
          </span>
          <div className="flex-1">
            <div className="text-sm font-semibold text-fg">Tuteur Najaح</div>
            <div className="text-xs text-green-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> En ligne
            </div>
          </div>
        </div>
      </header>

      <main ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6">
        <div className="max-w-2xl mx-auto space-y-4 pb-4">
          {messages.map((m, i) => (
            <Bubble key={i} role={m.role} text={m.text} />
          ))}
          {thinking && <TypingBubble />}
        </div>
      </main>

      <footer className="bg-surface border-t border-line p-3 sticky bottom-0">
        <form onSubmit={onSubmit} className="max-w-2xl mx-auto flex items-end gap-2">
          <button type="button" className="w-11 h-11 rounded-full bg-cream text-fg-soft flex items-center justify-center" aria-label="Photo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3"/></svg>
          </button>
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSubmit(e);
              }
            }}
            placeholder="Pose ta question…"
            className="flex-1 resize-none px-4 py-2.5 rounded-btn bg-cream text-fg placeholder:text-fg-faint border border-transparent focus:border-fg outline-none text-sm"
            style={{ maxHeight: 120 }}
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="bg-navy text-white w-11 h-11 rounded-full flex items-center justify-center disabled:opacity-40"
            aria-label="Envoyer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </form>
      </footer>
    </div>
  );
}

function Bubble({ role, text }: { role: "user" | "assistant"; text: string }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
          isUser ? "bg-navy text-white" : "bg-surface border border-line text-fg"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex justify-start">
      <div className="bg-surface border border-line text-fg-soft px-4 py-3 rounded-2xl flex gap-1.5">
        <span className="w-1.5 h-1.5 bg-fg-faint rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-1.5 h-1.5 bg-fg-faint rounded-full animate-bounce" style={{ animationDelay: "120ms" }} />
        <span className="w-1.5 h-1.5 bg-fg-faint rounded-full animate-bounce" style={{ animationDelay: "240ms" }} />
      </div>
    </div>
  );
}
