/**
 * POST /api/marketplace/request
 *
 * Buyer creates a service request against a helper.
 *
 * Body:
 *   { helperId: string, flow: 'ask_student' | 'negotiate', brief: string }
 *
 * Returns:
 *   - For 'ask_student': { checkout_url } — Chargily checkout (stubbed for now)
 *   - For 'negotiate'  : { thread_id }    — chat opens immediately
 *
 * Side effects:
 *   - Inserts service_requests row (status='open')
 *   - Inserts chat_threads row tied to that request
 *   - For 'negotiate': inserts a system message into the thread
 *   - TODO real Chargily: create checkout intent for 'ask_student' flow
 */
import { NextResponse } from "next/server";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { getActiveSubscription } from "@/lib/subscriptions";
import { checkSetupErr } from "@/lib/db-errors";

const FLAT_PRICE_DA = 400;
const SUBSCRIBER_DISCOUNT_PCT = 50;

export async function POST(req: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  let body: { helperId?: string; flow?: string; brief?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const helperId = String(body.helperId ?? "");
  const flow = String(body.flow ?? "");
  const brief = String(body.brief ?? "").trim().slice(0, 4000);

  if (!helperId) return NextResponse.json({ error: "helperId requis" }, { status: 400 });
  if (!["ask_student", "negotiate"].includes(flow)) {
    return NextResponse.json({ error: "flow invalide" }, { status: 400 });
  }
  if (brief.length < 15) {
    return NextResponse.json({ error: "Brief trop court (15 caractères min)" }, { status: 400 });
  }

  // Fetch the helper to verify they're approved + grab user_id for the thread
  const { data: helper, error: helperErr } = await supabase
    .from("helper_profiles")
    .select("id, user_id, status")
    .eq("id", helperId)
    .maybeSingle();

  const setup = checkSetupErr(helperErr);
  if (setup) return NextResponse.json(setup.body, { status: setup.status });
  if (!helper) return NextResponse.json({ error: "Helper introuvable" }, { status: 404 });
  if (helper.status !== "approved") return NextResponse.json({ error: "Helper non disponible" }, { status: 403 });
  if (helper.user_id === user.id) {
    return NextResponse.json({ error: "Tu ne peux pas te contacter toi-même" }, { status: 400 });
  }

  // Price calc
  let price: number | null = null;
  let discounted = false;
  if (flow === "ask_student") {
    const sub = await getActiveSubscription(user.id);
    if (sub) {
      price = Math.round((FLAT_PRICE_DA * (100 - SUBSCRIBER_DISCOUNT_PCT)) / 100);
      discounted = true;
    } else {
      price = FLAT_PRICE_DA;
    }
  }

  // Use service role so we can write the matching chat_thread row even though
  // chat_threads has no INSERT RLS policy by design (only system creates).
  const admin = createAdminClient();

  const { data: reqRow, error: reqErr } = await admin
    .from("service_requests")
    .insert({
      buyer_id: user.id,
      helper_id: helper.id,
      flow,
      price_da: price,
      subscriber_discount_applied: discounted,
      brief,
      status: "open",
    })
    .select("id")
    .single();

  if (reqErr) {
    const s = checkSetupErr(reqErr);
    if (s) return NextResponse.json(s.body, { status: s.status });
    console.error("[marketplace/request] insert request failed", reqErr);
    return NextResponse.json({ error: reqErr.message }, { status: 500 });
  }

  const { data: thread, error: threadErr } = await admin
    .from("chat_threads")
    .insert({
      request_id: reqRow.id,
      buyer_id: user.id,
      helper_user_id: helper.user_id,
    })
    .select("id")
    .single();

  if (threadErr) {
    console.error("[marketplace/request] insert thread failed", threadErr);
    return NextResponse.json({ error: threadErr.message }, { status: 500 });
  }

  // Initial system message — the buyer's brief
  await admin.from("chat_messages").insert({
    thread_id: thread.id,
    sender_id: user.id,
    kind: "text",
    body: brief,
  });

  if (flow === "negotiate") {
    // For negotiate, no payment yet — chat opens immediately. Drop a system
    // message so the helper knows to propose a price.
    await admin.from("chat_messages").insert({
      thread_id: thread.id,
      sender_id: helper.user_id, // system msg attributed to helper for now
      kind: "system",
      body: "Nouveau projet — propose un prix pour démarrer.",
    });
    return NextResponse.json({ thread_id: thread.id, flow });
  }

  // ask_student flow — would normally trigger a Chargily checkout here.
  // For MVP we return a stub URL that lands on the thread page; real
  // Chargily integration plugs in when the marketplace plan is signed off.
  // TODO: call /api/chargily/marketplace-checkout once that flow exists.
  const checkoutUrl = `/fac/chat/${thread.id}?pending_payment=${price}`;
  return NextResponse.json({
    checkout_url: checkoutUrl,
    thread_id: thread.id,
    price,
    discounted,
    flow,
  });
}
