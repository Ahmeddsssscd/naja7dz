"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";

type Item = { href: string; label: string };

/**
 * Hamburger drawer for mobile screens.
 * Slides in from the end (right in LTR, left in RTL).
 * Closes on link click, Escape, or backdrop tap.
 */
export function MobileMenu({ items, ctaHref = "/inscription", ctaLabel = "Commencer" }: { items: Item[]; ctaHref?: string; ctaLabel?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden inline-flex w-10 h-10 items-center justify-center rounded-btn text-fg hover:bg-surface-3"
        aria-label="Menu"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {open && (
        <div
          className="md:hidden fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={`md:hidden fixed top-0 end-0 h-full w-[80vw] max-w-xs bg-surface border-s border-line z-[101] transform transition-transform duration-200 ${
          open ? "translate-x-0" : "translate-x-full rtl:-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        <div className="flex justify-between items-center h-16 px-5 border-b border-line">
          <span className="text-sm font-semibold text-fg-soft">Menu</span>
          <button onClick={() => setOpen(false)} className="w-9 h-9 rounded-full hover:bg-surface-3 flex items-center justify-center" aria-label="Fermer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <nav className="p-5 flex flex-col gap-1">
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href as never}
              onClick={() => setOpen(false)}
              className="px-3 py-3 rounded-btn text-fg font-medium hover:bg-surface-3"
            >
              {it.label}
            </Link>
          ))}
          <Link
            href={ctaHref as never}
            onClick={() => setOpen(false)}
            className="btn btn-primary w-full mt-4"
          >
            {ctaLabel}
          </Link>
        </nav>
      </aside>
    </>
  );
}
