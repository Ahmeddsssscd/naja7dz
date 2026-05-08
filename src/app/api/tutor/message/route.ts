import { NextResponse } from "next/server";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { getActiveSubscription, requireSubscriptionApi } from "@/lib/subscriptions";

const MOCK_REPLIES = [
  "Bonne question ! Décomposons ça étape par étape. D'abord, on isole le terme avec x, puis on divise des deux côtés. Veux-tu un exemple concret ?",
  "C'est un point qui revient souvent. La règle est simple : tu peux la mémoriser en pensant à un cas pratique. Essaie de l'appliquer à un exercice et dis-moi si ça reste flou.",
  "Tu es sur la bonne voie. La prochaine étape consiste à vérifier ton résultat en remplaçant la valeur trouvée dans l'équation initiale.",
  "Parfait, tu as compris l'idée principale. Pour aller plus loin, je peux te générer 3 exercices ciblés. Tu veux ?",
];

/**
 * Persists tutor messages.
 * If conversationId is missing, creates a new conversation.
 * Returns a mock assistant reply (real Claude API plugs in later).
 */
export async function POST(req: Request) {
  const auth = await createServerClient();
  const { data: { user } } = await auth.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  // Subscription required — tutor is a paid feature.
  const sub = await getActiveSubscription(user.id);
  const block = requireSubscriptionApi(sub);
  if (block) return block;

  let body: { conversationId?: string; childId?: string; message?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const message = (body.message ?? "").trim();
  if (!message) return NextResponse.json({ error: "Message vide" }, { status: 400 });
  if (!body.childId) return NextResponse.json({ error: "childId required" }, { status: 400 });

  const admin = createAdminClient();
  const { data: child } = await admin.from("children").select("id").eq("id", body.childId).eq("parent_id", user.id).maybeSingle();
  if (!child) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // Create or load conversation
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

  // Save user message
  await admin.from("tutor_messages").insert({
    conversation_id: conversationId,
    role: "user",
    content: message,
  });

  // Mock assistant reply (real Claude API plugs here later)
  const reply = MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)];
  await admin.from("tutor_messages").insert({
    conversation_id: conversationId,
    role: "assistant",
    content: reply,
  });

  // Update conversation last_message_at
  await admin
    .from("tutor_conversations")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", conversationId);

  return NextResponse.json({ ok: true, conversationId, reply });
}
