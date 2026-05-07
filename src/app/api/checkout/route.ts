import { NextResponse } from "next/server";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { createCheckout, createCustomer } from "@/lib/chargily";

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Defensive: env vars sometimes have stray "\n" / whitespace from CLI input.
// A bad value here corrupts the redirect URLs we hand to Chargily.
const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://naja7dz.com")
  .replace(/\\n|\\r/g, "")
  .replace(/[\r\n\t]/g, "")
  .trim()
  .replace(/\/+$/, "");

interface CheckoutRequest {
  planId?: string;
  email?: string;
  name?: string;
  phone?: string;
  locale?: string;
}

export async function POST(req: Request) {
  let body: CheckoutRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // ----- Validate -----
  const planId = (body.planId ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const name = (body.name ?? "").trim().slice(0, 200);
  const phone = (body.phone ?? "").trim().slice(0, 32);
  const locale = body.locale === "ar" ? "ar" : "fr";

  if (!planId) return NextResponse.json({ error: "planId required" }, { status: 400 });
  if (!email || !EMAIL_RX.test(email))
    return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  if (!name) return NextResponse.json({ error: "Nom requis" }, { status: 400 });

  // Resolve the authenticated user (if any). We do NOT require login —
  // visitors can still pay — but if they ARE logged in we link the checkout
  // to their user_id so the webhook can activate their subscription
  // immediately. If not logged in, the webhook resolves the link by email.
  const userClient = await createServerClient();
  const {
    data: { user: authUser },
  } = await userClient.auth.getUser();
  const linkedUserId = authUser?.id ?? null;

  const supabase = createAdminClient();

  // ----- Look up the plan from DB (source of truth on price) -----
  const { data: plan, error: planErr } = await supabase
    .from("plans")
    .select("id, name_fr, amount_dzd, period")
    .eq("id", planId)
    .eq("active", true)
    .maybeSingle();

  if (planErr || !plan) {
    return NextResponse.json({ error: "Plan introuvable ou inactif" }, { status: 404 });
  }

  // ----- Insert pending checkout session -----
  const { data: session, error: sessionErr } = await supabase
    .from("checkout_sessions")
    .insert({
      plan_id: plan.id,
      email,
      customer_name: name,
      customer_phone: phone || null,
      amount_dzd: plan.amount_dzd,
      locale,
      status: "pending",
      source: "web-checkout",
      user_id: linkedUserId,
    })
    .select("id")
    .single();

  if (sessionErr || !session) {
    console.error("[checkout] db insert failed", sessionErr);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }

  // ----- Create Chargily customer + checkout -----
  try {
    const customer = await createCustomer({ name, email, phone: phone || undefined });

    const checkout = await createCheckout({
      amount: plan.amount_dzd,
      currency: "dzd",
      customerId: customer.id,
      description: plan.name_fr,
      locale,
      successUrl: `${SITE}/${locale}/checkout/success?session=${session.id}`,
      failureUrl: `${SITE}/${locale}/checkout/cancel?session=${session.id}`,
      webhookEndpoint: `${SITE}/api/webhooks/chargily`,
      metadata: {
        session_id: session.id,
        plan_id: plan.id,
      },
    });

    // ----- Store the Chargily IDs back on our session -----
    await supabase
      .from("checkout_sessions")
      .update({ chargily_checkout_id: checkout.id })
      .eq("id", session.id);

    return NextResponse.json({
      ok: true,
      sessionId: session.id,
      checkoutUrl: checkout.checkout_url,
    });
  } catch (err) {
    console.error("[checkout] chargily failed", err);
    await supabase
      .from("checkout_sessions")
      .update({ status: "failed" })
      .eq("id", session.id);
    return NextResponse.json(
      { error: "Erreur de paiement. Réessaye dans un instant." },
      { status: 500 },
    );
  }
}
