"use client";

/**
 * Reusable file upload widget for the admin zone.
 * Posts to /api/admin/upload and returns the public URL.
 */

import { useState } from "react";
import { toast } from "sonner";

export function AdminFileUpload({
  bucket = "exam-papers",
  accept = "application/pdf",
  onUploaded,
  label = "Téléverser un fichier",
}: {
  bucket?: string;
  accept?: string;
  onUploaded: (url: string) => void;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("bucket", bucket);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || !json.url) throw new Error(json.error ?? "Upload failed");
      onUploaded(json.url);
      toast.success("Fichier téléversé ✓");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  };

  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <span className="btn btn-outline btn-sm">{busy ? "Téléversement…" : label}</span>
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        disabled={busy}
        className="sr-only"
      />
    </label>
  );
}
