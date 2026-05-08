/**
 * Admin file upload endpoint. Accepts a multipart form with field `file` and
 * an optional `bucket` (defaults to `exam-papers`). Returns the public URL.
 *
 * The bucket is auto-created (public) on first call if it doesn't exist.
 */
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdminApi } from "@/lib/admin-auth";

const ALLOWED_BUCKETS = new Set(["exam-papers", "adab-images", "branding"]);
const MAX_BYTES = 25 * 1024 * 1024; // 25 MB

// Per-bucket MIME allow-list. We refuse anything not in this list — without
// it an admin (or compromised admin account) could upload arbitrary binaries
// served from our domain (XSS via SVG, malware, etc.).
const ALLOWED_MIME: Record<string, ReadonlySet<string>> = {
  "exam-papers": new Set(["application/pdf"]),
  "adab-images": new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]),
  "branding": new Set(["image/png", "image/jpeg", "image/webp", "image/svg+xml"]),
};

// Extension fallback used if the browser sends a bogus / missing MIME.
const EXT_TO_MIME: Record<string, string> = {
  pdf: "application/pdf",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
};

export async function POST(req: Request) {
  const gate = await requireAdminApi();
  if ("response" in gate) return gate.response;

  const form = await req.formData().catch(() => null);
  if (!form) {
    return NextResponse.json({ error: "multipart/form-data attendu" }, { status: 400 });
  }

  const file = form.get("file");
  const bucketRaw = String(form.get("bucket") ?? "exam-papers");
  const bucket = ALLOWED_BUCKETS.has(bucketRaw) ? bucketRaw : "exam-papers";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Champ 'file' manquant" }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "Fichier vide" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: `Fichier trop grand (max ${MAX_BYTES / 1024 / 1024}MB)` }, { status: 413 });
  }

  // MIME allow-list per bucket. Cross-check the browser-sent MIME with the
  // file extension — refuse if either is unsupported.
  const allowed = ALLOWED_MIME[bucket] ?? new Set<string>();
  const ext = (file.name.split(".").pop() ?? "").toLowerCase();
  const mimeFromExt = EXT_TO_MIME[ext];
  const declaredMime = (file.type || "").toLowerCase();
  const effectiveMime = declaredMime || mimeFromExt || "application/octet-stream";
  if (!allowed.has(effectiveMime)) {
    return NextResponse.json(
      { error: `Type de fichier non autorisé pour le bucket "${bucket}". Autorisés: ${[...allowed].join(", ")}` },
      { status: 415 },
    );
  }
  // Also refuse the rare case where extension and declared MIME disagree
  // (e.g. .pdf with image/png MIME — likely a confused or malicious upload).
  if (mimeFromExt && declaredMime && mimeFromExt !== declaredMime) {
    return NextResponse.json(
      { error: "Type MIME et extension du fichier ne correspondent pas" },
      { status: 415 },
    );
  }

  const admin = createAdminClient();

  // Ensure bucket exists (idempotent).
  const { data: buckets } = await admin.storage.listBuckets();
  if (!buckets?.some((b) => b.name === bucket)) {
    const { error: createErr } = await admin.storage.createBucket(bucket, {
      public: true,
      fileSizeLimit: MAX_BYTES,
    });
    if (createErr) {
      console.error("[upload] bucket create failed", createErr);
      return NextResponse.json({ error: createErr.message }, { status: 500 });
    }
  }

  // Sanitize filename: timestamp + safe basename.
  const orig = file.name || "file";
  const safe = orig.replace(/[^a-zA-Z0-9.\-_]/g, "_").slice(0, 100);
  const path = `${Date.now()}-${safe}`;

  const { error: uploadErr } = await admin.storage
    .from(bucket)
    .upload(path, file, {
      contentType: effectiveMime,
      upsert: false,
    });

  if (uploadErr) {
    return NextResponse.json({ error: uploadErr.message }, { status: 500 });
  }

  const { data: pub } = admin.storage.from(bucket).getPublicUrl(path);

  return NextResponse.json({
    ok: true,
    url: pub.publicUrl,
    path,
    bucket,
    filename: orig,
    size: file.size,
  });
}
