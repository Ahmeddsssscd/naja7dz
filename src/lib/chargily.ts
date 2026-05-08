/**
 * Chargily Pay v2 — server-side helper.
 *
 * Docs: https://dev.chargily.com/pay-v2/
 * Flow:
 *   1. Create a Customer (or reuse one)
 *   2. Create a Checkout linked to the customer + amount
 *   3. Redirect user to checkout.checkout_url
 *   4. Chargily POSTs to our webhook when paid/failed
 *
 * NEVER import this from a Client Component — secret key is server-only.
 */
import "server-only";

// Defensive: env vars copied from CLI/UI sometimes carry trailing whitespace,
// CR, LF, or escaped "\n" sequences. Strip them — they corrupt the URL path
// and the Authorization header (Chargily rejects with cryptic errors).
function cleanEnv(v: string | undefined): string {
  if (!v) return "";
  return v
    .replace(/\\n/g, "")    // literal backslash-n
    .replace(/\\r/g, "")
    .replace(/[\r\n\t]/g, "")
    .trim();
}

const BASE = cleanEnv(process.env.CHARGILY_API_BASE) || "https://pay.chargily.net/test/api/v2";
const SECRET = cleanEnv(process.env.CHARGILY_SECRET_KEY);

if (!SECRET && process.env.NODE_ENV === "production") {
  console.warn("[chargily] CHARGILY_SECRET_KEY missing in production!");
}

interface ChargilyFetchInit {
  method?: string;
  headers?: Record<string, string>;
  body?: object | string;
}

async function chargilyFetch<T>(path: string, init?: ChargilyFetchInit): Promise<T> {
  const body =
    init?.body && typeof init.body === "object"
      ? JSON.stringify(init.body)
      : (init?.body as string | undefined);

  const res = await fetch(`${BASE}${path}`, {
    method: init?.method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SECRET}`,
      ...(init?.headers ?? {}),
    },
    body,
    cache: "no-store",
  });

  const text = await res.text();
  let parsed: unknown = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    /* not JSON */
  }

  if (!res.ok) {
    const errMsg =
      (parsed && typeof parsed === "object" && "message" in parsed
        ? String((parsed as { message: unknown }).message)
        : null) ?? `Chargily ${path} failed (${res.status})`;
    throw new Error(errMsg);
  }
  return parsed as T;
}

/* ============================ Customers ============================ */

export interface ChargilyCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export async function createCustomer(input: {
  name: string;
  email: string;
  phone?: string;
}): Promise<ChargilyCustomer> {
  return chargilyFetch<ChargilyCustomer>("/customers", {
    method: "POST",
    body: input,
  });
}

/* ============================ Checkouts ============================ */

export interface CreateCheckoutInput {
  amount: number;          // integer DZD (smallest unit)
  currency?: "dzd";
  customerId?: string;
  successUrl: string;      // where Chargily redirects on success
  failureUrl?: string;     // where Chargily redirects on failure
  webhookEndpoint?: string;
  description?: string;
  locale?: "fr" | "ar" | "en";
  metadata?: Record<string, string>;
}

export interface ChargilyCheckout {
  id: string;
  status: "pending" | "paid" | "failed" | "cancelled" | "expired";
  amount: number;
  currency: string;
  customer_id?: string;
  checkout_url: string;
  invoice_id?: string;
  metadata?: Record<string, string>;
  created_at: number;
  updated_at: number;
}

export async function createCheckout(input: CreateCheckoutInput): Promise<ChargilyCheckout> {
  return chargilyFetch<ChargilyCheckout>("/checkouts", {
    method: "POST",
    body: {
      amount: input.amount,
      currency: input.currency ?? "dzd",
      customer_id: input.customerId,
      success_url: input.successUrl,
      failure_url: input.failureUrl,
      webhook_endpoint: input.webhookEndpoint,
      description: input.description,
      locale: input.locale,
      metadata: input.metadata,
    },
  });
}

export async function getCheckout(id: string): Promise<ChargilyCheckout> {
  return chargilyFetch<ChargilyCheckout>(`/checkouts/${id}`);
}

/* ============================ Webhook signature ============================ */

/**
 * Verify a Chargily webhook signature.
 * Chargily sends `Signature: <hmac-sha256>` header — HMAC of the raw body
 * with our webhook secret as key.
 *
 * Behaviour when CHARGILY_WEBHOOK_SECRET is not configured:
 *   - production : REJECT (return false). Anything else means an attacker who
 *                  guesses the webhook URL could mint paid subscriptions for
 *                  free. Production must always have the secret set.
 *   - dev/test   : allow with a loud warning so local development against a
 *                  test Chargily instance keeps working.
 */
export async function verifyWebhookSignature(
  rawBody: string,
  signature: string | null,
): Promise<boolean> {
  const secret = process.env.CHARGILY_WEBHOOK_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.error("[chargily] CHARGILY_WEBHOOK_SECRET missing in production — rejecting webhook");
      return false;
    }
    console.warn("[chargily] No CHARGILY_WEBHOOK_SECRET (dev only) — accepting webhook unverified");
    return true;
  }
  if (!signature) return false;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(rawBody));
  const expectedHex = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  // Constant-time compare
  if (expectedHex.length !== signature.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expectedHex.length; i++) {
    mismatch |= expectedHex.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return mismatch === 0;
}
