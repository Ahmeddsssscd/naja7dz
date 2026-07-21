"use client";

/**
 * Reusable file upload widget for the admin zone — drag & drop + click.
 * Posts to /api/admin/upload and returns the public URL.
 */

import { useRef, useState } from "react";
import { toast } from "sonner";

export function AdminFileUpload({
  bucket = "exam-papers",
  accept = "application/pdf",
  onUploaded,
  label = "Glisse ton fichier ici ou clique pour choisir",
}: {
  bucket?: string;
  accept?: string;
  onUploaded: (url: string) => void;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [lastName, setLastName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("bucket", bucket);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || !json.url) throw new Error(json.error ?? "Upload failed");
      setLastName(file.name);
      onUploaded(json.url);
      toast.success("Fichier téléversé ✓");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setBusy(false);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await upload(file);
    e.target.value = "";
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (busy) return;
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    // Basic client-side type gate; the API re-validates strictly.
    if (accept && accept !== "*" && !accept.split(",").some((a) => {
      const t = a.trim();
      return t === file.type || (t.endsWith("/*") && file.type.startsWith(t.slice(0, -1)));
    })) {
      toast.error(`Type non accepté (attendu : ${accept})`);
      return;
    }
    await upload(file);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={label}
      onClick={() => !busy && inputRef.current?.click()}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); inputRef.current?.click(); } }}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`w-full rounded-card border-2 border-dashed px-5 py-6 text-center cursor-pointer transition-colors select-none ${
        dragging
          ? "border-gold bg-gold/10"
          : "border-line-strong bg-surface-2 hover:border-fg/40"
      } ${busy ? "opacity-60 pointer-events-none" : ""}`}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="mx-auto mb-2 text-fg-soft">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
      <div className="text-sm font-semibold text-fg">
        {busy ? "Téléversement…" : dragging ? "Dépose le fichier !" : label}
      </div>
      <div className="text-xs text-fg-faint mt-1">
        {lastName ? `Dernier fichier : ${lastName}` : "PDF · 25 MB max"}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        disabled={busy}
        className="sr-only"
      />
    </div>
  );
}
