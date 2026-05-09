"use client";

/**
 * Tiny wrapper around `window.speechSynthesis` for the English-learning section.
 *
 * Why a hook instead of a one-liner? We need to:
 *  1. Cancel any pending utterance before starting a new one — without this,
 *     a kid spamming the 🔊 button queues 10 copies and the section feels broken.
 *  2. Pick the best-available English voice once, lazily. Modern Chrome ships
 *     several en-* voices; we prefer en-US, then en-GB, then any en-* voice.
 *  3. Track an `isSpeaking` flag so callers can disable the button while audio
 *     is playing (visual feedback for the kid).
 *  4. Be SSR-safe (no `window` access at module scope).
 */

import { useCallback, useEffect, useRef, useState } from "react";

interface UseSpeakResult {
  speak: (text: string, opts?: { rate?: number; pitch?: number; lang?: string }) => void;
  cancel: () => void;
  isSpeaking: boolean;
  /** True when the browser exposes a usable speechSynthesis API. */
  supported: boolean;
}

let cachedVoice: SpeechSynthesisVoice | null = null;

function pickEnglishVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  if (cachedVoice) return cachedVoice;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;
  // Prefer en-US, then en-GB, then any en-*.
  const enUS = voices.find((v) => v.lang === "en-US");
  if (enUS) return (cachedVoice = enUS);
  const enGB = voices.find((v) => v.lang === "en-GB");
  if (enGB) return (cachedVoice = enGB);
  const anyEn = voices.find((v) => v.lang.startsWith("en"));
  if (anyEn) return (cachedVoice = anyEn);
  return null;
}

export function useSpeak(): UseSpeakResult {
  const [supported, setSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.speechSynthesis) {
      setSupported(false);
      return;
    }
    setSupported(true);
    // Voices list is async on Chrome — populate cache when ready.
    const refreshVoices = () => {
      cachedVoice = null;
      pickEnglishVoice();
    };
    window.speechSynthesis.addEventListener?.("voiceschanged", refreshVoices);
    refreshVoices();
    return () => {
      window.speechSynthesis.removeEventListener?.("voiceschanged", refreshVoices);
      // On unmount, stop any in-flight speech so audio doesn't leak across pages.
      window.speechSynthesis.cancel();
    };
  }, []);

  const cancel = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(
    (text: string, opts?: { rate?: number; pitch?: number; lang?: string }) => {
      if (typeof window === "undefined" || !window.speechSynthesis) return;
      // Cancel anything pending — kids tap fast.
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = opts?.lang ?? "en-US";
      u.rate = opts?.rate ?? 0.9; // slightly slower — these are L3 learners
      u.pitch = opts?.pitch ?? 1.05;
      const voice = pickEnglishVoice();
      if (voice) u.voice = voice;
      u.onstart = () => setIsSpeaking(true);
      u.onend = () => setIsSpeaking(false);
      u.onerror = () => setIsSpeaking(false);
      utteranceRef.current = u;
      window.speechSynthesis.speak(u);
    },
    [],
  );

  return { speak, cancel, isSpeaking, supported };
}
