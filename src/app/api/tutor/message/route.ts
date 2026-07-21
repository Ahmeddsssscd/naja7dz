import { NextResponse } from "next/server";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { getActiveSubscription, requireSubscriptionApi } from "@/lib/subscriptions";

const SYSTEM_PROMPT = `Tu es Naja, le tuteur IA de la plateforme éducative algérienne Najaح (naja7dz.com).
Tu aides les élèves algériens (collège et lycée) à comprendre leurs cours scolaires.
Réponds toujours en français sauf si l'élève écrit en arabe (alors réponds en arabe).
Sois encourageant, clair et pédagogique. Adapte ta réponse au niveau scolaire algérien (programme officiel).
Ne fournis jamais de réponses directes aux examens — guide l'élève à raisonner lui-même.
Limite tes réponses à 3-4 paragraphes maximum.`;

async function callAnthropicApi(message: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return "Le tuteur IA sera disponible très bientôt. En attendant, contacte ton enseignant ou consulte tes cours.";
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 600,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: message }],
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("[tutor] Anthropic API error", res.status);
    throw new Error("AI unavailable");
  }

  const data = await res.json() as {
    content: Array<{ type: string; text: string }>;
  };

  return data.content.find((b) => b.type === "text")?.text ??
    "Je n'ai pas pu générer une réponse. Réessaye dans un instant.";
}

export async function POST(req: Request) {
  const auth = await createServerClient();
  const { data: { user } } = await auth.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  const sub = await getActiveSubscription(user.id);
  const block = requireSubscriptionApi(sub);
  if (block) return block;

  let body: { conversationId?: string; childId?: string; message?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const message = (body.message ?? "").trim();
  if (!message) return NextResponse.json({ error: "Message vide" }, { status: 400 });
  if (message.length > 2000) return NextResponse.json({ error: "Message trop long" }, { status: 400 });
  if (!body.childId) return NextResponse.json({ error: "childId required" }, { status: 400 });

  const admin = createAdminClient();
  const { data: child } = await admin.from("children").select("id").eq("id", body.childId).eq("parent_id", user.id).maybeSingle();
  if (!child) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let conversationId = body.conversationId;
  if (!conversationId) {
    const { data: conv } = await admin
      .from("tutor_conversations")
      .insert({ child_id: child.id, title: message.slice(0, 60), language: "fr" })
      .select("id")
      .single();
    conversationId = conv?.id;
  }
  if (!conversationId) return NextResponse.json({ error: "Conversation init failed" }, { status: 500 });

  await admin.from("tutor_messages").insert({
    conversation_id: conversationId,
    role: "user",
    content: message,
  });

  let reply: string;
  try {
    reply = await callAnthropicApi(message);
  } catch {
    reply = "Une erreur s'est produite. Réessaye dans un instant.";
  }

  await admin.from("tutor_messages").insert({
    conversation_id: conversationId,
    role: "assistant",
    content: reply,
  });

  await admin
    .from("tutor_conversations")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", conversationId);

  return NextResponse.json({ ok: true, conversationId, reply });
}
