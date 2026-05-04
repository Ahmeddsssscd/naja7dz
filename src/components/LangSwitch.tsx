"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { useTransition } from "react";

/**
 * Toggles between French (LTR) and Arabic (RTL).
 * Preserves the current path so the user stays on the same page.
 */
export function LangSwitch() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const otherLocale = locale === "fr" ? "ar" : "fr";
  const label = locale === "fr" ? "عربي" : "FR";

  const onClick = () => {
    startTransition(() => {
      router.replace(pathname, { locale: otherLocale });
    });
  };

  return (
    <button
      onClick={onClick}
      disabled={isPending}
      className="text-ink-soft text-sm font-medium px-3 py-2 rounded-btn transition-colors hover:bg-pale-blue hover:text-navy disabled:opacity-50"
      aria-label={locale === "fr" ? "Passer à l'arabe" : "Passer au français"}
    >
      {label}
    </button>
  );
}
