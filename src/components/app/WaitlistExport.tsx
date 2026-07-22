"use client";

import { toast } from "sonner";

/**
 * Client actions for the waitlist: copy all emails, download a CSV.
 * Data is passed in from the server page (already admin-gated).
 */
export function WaitlistExport({ emails, csv }: { emails: string[]; csv: string }) {
  const copyEmails = () => {
    navigator.clipboard?.writeText(emails.join(", ")).then(
      () => toast.success(`${emails.length} emails copiés`),
      () => toast.error("Copie impossible"),
    );
  };

  const downloadCsv = () => {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `liste-attente-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (emails.length === 0) return null;

  return (
    <div className="flex gap-2">
      <button onClick={copyEmails} className="btn btn-outline btn-sm">
        Copier les emails
      </button>
      <button onClick={downloadCsv} className="btn btn-primary btn-sm">
        Exporter CSV
      </button>
    </div>
  );
}
