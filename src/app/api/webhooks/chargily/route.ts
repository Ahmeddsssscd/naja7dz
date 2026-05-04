import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { verifyWebhookSignature } from "@/lib/chargily";

/**
 * Receives webhook events from Chargily Pay.
 * Events we care about:
 *   - checkout.paid     → mark session paid, kick off welcome email
 *   - checkout.failed   → mark session failed
 *   - checkout.expired  → mark session expired
 *
 * Always returns 200 (we don't want Chargily retrying for our internal errors).
 * If we want a retry, we'd return 500.
 */
export async function POST(req: Request) {
  // Read raw body so we can verify the signature
  const rawBody = await req.text();
  const signature = req.headers.get("signature") ?? req.headers.get("x-signature");

  const valid = await verifyWebhookSignature(rawBody, signature);

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    console.error("[webhook] invalid JSON");
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const evt = payload as {
    id?: string;
    type?: string;
    data?: {
      id?: string;
      status?: string;
      metadata?: Record<string, string>;
      invoice_id?: string;
    };
  };

  const supabase = createServerClient();

  // Audit log every event regardless of validity
  await supabase.from("payment_events").insert({
    event_type: evt.type ?? "unknown",
    chargily_event_id: evt.id ?? null,
    payload: payload as object,
    signature: signature ?? null,
    signature_valid: valid,
    processed: false,
  });

  if (!valid) {
    console.warn("[webhook] invalid signature — ignoring");
    return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 401 });
  }

  const checkoutId = evt.data?.id;
  if (!checkoutId) {
    return NextResponse.json({ ok: true, ignored: "no checkout id" });
  }

  // Map event type → our internal status
  let newStatus: "paid" | "failed" | "expired" | "cancelled" | null = null;
  switch (evt.type) {
    case "checkout.paid":
      newStatus = "paid";
      break;
    case "checkout.failed":
      newStatus = "failed";
      break;
    case "checkout.expired":
      newStatus = "expired";
      break;
    case "checkout.cancelled":
      newStatus = "cancelled";
      break;
    default:
      return NextResponse.json({ ok: true, ignored: `unhandled type ${evt.type}` });
  }

  // Update the checkout session
  const updates: Record<string, unknown> = { status: newStatus };
  if (newStatus === "paid") {
    updates.paid_at = new Date().toISOString();
    updates.chargily_payment_id = evt.data?.invoice_id ?? null;
  }

  const { error: updErr } = await supabase
    .from("checkout_sessions")
    .update(updates)
    .eq("chargily_checkout_id", checkoutId);

  if (updErr) {
    console.error("[webhook] failed to update session", updErr);
    // Don't fail the webhook — Chargily would retry endlessly
    return NextResponse.json({ ok: true, warning: "db update failed" });
  }

  // Mark event as processed
  if (evt.id) {
    await supabase
      .from("payment_events")
      .update({ processed: true })
      .eq("chargily_event_id", evt.id);
  }

  // TODO: send welcome email on `paid` (Resend integration in next session)

  return NextResponse.json({ ok: true });
}
