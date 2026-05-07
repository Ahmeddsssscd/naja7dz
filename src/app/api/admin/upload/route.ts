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
      contentType: file.type || "application/octet-stream",
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
