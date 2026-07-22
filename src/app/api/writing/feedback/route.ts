/**
 * AI feedback on a student's writing (rédaction).
 *
 * POST /api/writing/feedback
 * Body: { prompt: string; text: string; locale?: "fr" | "ar" }
 *
 * Returns structured pedagogical feedback WITHOUT rewriting the whole text
 * for the student — the goal is to teach, not to do the work. Falls back to
 * a rule-based summary when ANTHROPIC_API_KEY is not configured, so the tool
 * still gives useful signal in every environment.
 */
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getActiveSubscription, requireSubscriptionApi } from "@/lib/subscriptions";
import { rateLimit, getClientKey } from "@/lib/rate-limit";

interface Body {
  prompt?: string;
  text?: string;
  locale?: "fr" | "ar";
}

interface Feedback {
  score: number; // out of 20
  strengths: string[];
  improvements: string[];
  comment: string;
}

const SYSTEM_PROMPT = `Tu es un professeur de langue bienveillant qui corrige la rédaction d'un élève algérien (collège/lycée).
Tu réponds UNIQUEMENT en JSON valide, sans texte autour, avec ce format exact :
{"score": <note sur 20>, "strengths": ["...","..."], "improvements": ["...","..."], "comment": "..."}
Règles :
- Ne réécris JAMAIS la rédaction à la place de l'élève. Guide-le pour qu'il progresse lui-même.
- "strengths" : 2 à 3 points positifs concrets.
- "improvements" : 2 à 4 pistes d'amélioration précises (orthographe, structure, richesse du vocabulaire, arguments…).
- "comment" : 2 phrases d'encouragement personnalisées.
- Réponds dans la langue de la rédaction (français ou arabe).
- Sois juste mais bienveillant : la note reflète le niveau scolaire de l'élève.`;

async function aiFeedback(prompt: string, text: string, locale: string): Promise<Feedback | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const userMsg = `Sujet de la rédaction : « ${prompt} »\n\nRédaction de l'élève (langue : ${locale}) :\n"""\n${text}\n"""\n\nDonne ton évaluation au format JSON demandé.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 800,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMsg }],
    }),
    cache: "no-store",
  });
  if (!res.ok) {
    console.error("[writing] Anthropic error", res.status);
    return null;
  }
  const data = (await res.json()) as { content: Array<{ type: string; text: string }> };
  const raw = data.content.find((b) => b.type === "text")?.text ?? "";
  try {
    // Model may wrap JSON in prose or code fences — extract the object.
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return null;
    const parsed = JSON.parse(match[0]) as Feedback;
    if (typeof parsed.score !== "number" || !Array.isArray(parsed.strengths)) return null;
    parsed.score = Math.max(0, Math.min(20, Math.round(parsed.score * 10) / 10));
    return parsed;
  } catch {
    return null;
  }
}

/** Rule-based fallback when the AI key isn't set — still useful signal. */
function heuristicFeedback(text: string, locale: string): Feedback {
  const isAr = locale === "ar";
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const sentences = text.split(/[.!?؟]/).filter((s) => s.trim().length > 0).length;
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;
  const avgSentence = sentences ? Math.round(words / sentences) : words;

  const strengths: string[] = [];
  const improvements: string[] = [];

  if (words >= 120) strengths.push(isAr ? "نص غني بطول مناسب." : "Un texte développé, de bonne longueur.");
  else improvements.push(isAr ? "طوّل نصك أكثر بإضافة أفكار وأمثلة." : "Développe davantage : ajoute des idées et des exemples.");

  if (paragraphs >= 2) strengths.push(isAr ? "تقسيم جيد إلى فقرات." : "Un texte bien structuré en paragraphes.");
  else improvements.push(isAr ? "قسّم نصك إلى فقرات (مقدمة، تطوير، خاتمة)." : "Structure ton texte en paragraphes (introduction, développement, conclusion).");

  if (avgSentence > 0 && avgSentence <= 20) strengths.push(isAr ? "جمل واضحة ومقروءة." : "Des phrases claires et lisibles.");
  if (avgSentence > 25) improvements.push(isAr ? "جملك طويلة جدًا — قسّمها لتصبح أوضح." : "Tes phrases sont longues — découpe-les pour plus de clarté.");

  improvements.push(isAr ? "أعد قراءة نصك للتحقق من الإملاء وعلامات الوقف." : "Relis-toi pour corriger l'orthographe et la ponctuation.");

  // A gentle heuristic score based on length + structure.
  let score = 8;
  if (words >= 80) score += 3;
  if (words >= 150) score += 2;
  if (paragraphs >= 2) score += 2;
  if (avgSentence <= 22) score += 2;
  score = Math.min(18, score);

  return {
    score,
    strengths: strengths.length ? strengths : [isAr ? "لقد بذلت مجهودًا في الكتابة." : "Tu as fait l'effort d'écrire, c'est déjà bien."],
    improvements,
    comment: isAr
      ? "استمر في التدرّب على الكتابة، فكل نص يجعلك أفضل. التقييم التفصيلي بالذكاء الاصطناعي سيصبح متاحًا قريبًا."
      : "Continue à t'entraîner, chaque rédaction te fait progresser. L'évaluation détaillée par IA sera bientôt disponible.",
  };
}

export async function POST(req: Request) {
  const rl = rateLimit(`writing:${getClientKey(req)}`, { max: 10, windowSec: 60 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessaye dans un instant." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter ?? 60) } },
    );
  }

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  const sub = await getActiveSubscription(user.id);
  const block = requireSubscriptionApi(sub);
  if (block) return block;

  let body: Body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const prompt = (body.prompt ?? "").trim().slice(0, 500);
  const text = (body.text ?? "").trim();
  const locale = body.locale === "ar" ? "ar" : "fr";

  if (text.split(/\s+/).filter(Boolean).length < 10) {
    return NextResponse.json({ error: "Texte trop court" }, { status: 400 });
  }
  if (text.length > 8000) {
    return NextResponse.json({ error: "Texte trop long" }, { status: 400 });
  }

  let feedback: Feedback | null = null;
  try {
    feedback = await aiFeedback(prompt, text, locale);
  } catch (e) {
    console.error("[writing] feedback error", e);
  }
  if (!feedback) feedback = heuristicFeedback(text, locale);

  return NextResponse.json({ ok: true, feedback });
}
