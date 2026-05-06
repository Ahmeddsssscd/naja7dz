"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

const STORAGE_KEY = "naja7-cookie-ack-v1";

/**
 * Loi 18-07 / RGPD-style minimal banner. We only use strictly-necessary
 * cookies (session, theme, locale), so this is informational rather than
 * a consent-toggle. User dismisses it once.
 */
export function CookieBanner() {
  const t = useTranslations("Cookies");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY) !== "1") {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      className="fixed bottom-4 inset-x-4 md:inset-auto md:bottom-6 md:end-6 md:max-w-md z-50 bg-surface border border-line shadow-modal rounded-card p-5 flex flex-col gap-3"
    >
      <h3 className="font-semibold text-fg">{t("title")}</h3>
      <p className="text-sm text-fg-soft leading-relaxed">{t("text")}</p>
      <div className="flex gap-2 mt-1">
        <button onClick={dismiss} className="btn btn-primary btn-sm flex-1">
          {t("accept")}
        </button>
        <Link href="/legal/confidentialite" className="btn btn-outline btn-sm">
          {t("more")}
        </Link>
      </div>
    </div>
  );
}
