"use client";

/**
 * Floating support button — fixed to the bottom-right corner on public pages.
 * Click to expand three contact channels (email, phone, support form).
 * Hidden inside the authenticated app spaces (parent/student/admin/teacher)
 * so it never collides with their own bottom navigation.
 */

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";

const HIDDEN_PREFIXES = ["/eleve", "/petits", "/parent", "/admin", "/enseignant", "/fac/mon-profil"];

export function SupportFab() {
  const pathname = usePathname();
  const isAr = useLocale() === "ar";
  const [open, setOpen] = useState(false);

  // Close on route change.
  useEffect(() => { setOpen(false); }, [pathname]);

  // Strip the /fr or /ar locale prefix, then hide inside app spaces.
  const path = pathname.replace(/^\/(fr|ar)(?=\/|$)/, "") || "/";
  if (HIDDEN_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`))) return null;

  const channels = [
    {
      label: isAr ? "بريد إلكتروني" : "Email",
      href: "mailto:support@naja7dz.com",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 6L2 7" /></svg>,
    },
    {
      label: isAr ? "الهاتف" : "Téléphone",
      href: "tel:+213000000000",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>,
    },
    {
      label: isAr ? "الدعم 24/7" : "Support 24/7",
      href: `/${isAr ? "ar/" : ""}contact`,
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
    },
  ];

  return (
    <div className="fixed bottom-5 end-5 z-[80] flex flex-col items-end gap-3">
      {/* Channel pills */}
      {open && (
        <div className="flex flex-col items-end gap-2">
          {channels.map((c) => (
            <a
              key={c.label}
              href={c.href}
              className="flex items-center gap-2.5 bg-surface border border-line shadow-card-hover rounded-full ps-3 pe-4 py-2.5 text-sm font-medium text-fg hover:border-gold transition-colors"
            >
              <span className="text-gold">{c.icon}</span>
              {c.label}
            </a>
          ))}
        </div>
      )}

      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={isAr ? "الدعم والتواصل" : "Aide et contact"}
        aria-expanded={open}
        className="w-14 h-14 rounded-full bg-navy text-white dark:bg-gold dark:text-navy shadow-card-hover flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
      >
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        )}
      </button>
    </div>
  );
}
