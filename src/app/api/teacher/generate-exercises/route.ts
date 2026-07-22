/**
 * AI exercise generator for teachers.
 *
 * POST /api/teacher/generate-exercises
 * Body: { subject, grade, topic, count, difficulty, kind, locale }
 *
 * Returns a set of ready-to-use exercises aligned to the Algerian program.
 * Gated to registered teachers (a teacher_profiles row). Rate-limited.
 * Falls back to a clear message when ANTHROPIC_API_KEY isn't configured.
 */
import { NextResponse } from "next/server";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { rateLimit, getClientKey } from "@/lib/rate-limit";

interface Exercise {
  prompt: string;
  options?: string[];
  answer: string;
  explanation?: string;
}

interface Body {
  subject?: string;
  grade?: string;
  topic?: string;
  count?: number;
  difficulty?: string;
  kind?: string; // "mcq" | "open"
  locale?: "fr" | "ar";
}

const GRADES = new Set([
  "1AP", "2AP", "3AP", "4AP", "5AP", "1AM", "2AM", "3AM", "4AM", "1AS", "2AS", "3AS",
]);

function systemPrompt(kind: string): string {
  return `Tu es un concepteur d'exercices pour enseignants algériens, aligné sur le programme officiel de l'Éducation nationale.
Tu réponds UNIQUEMENT en JSON valide, sans texte autour :
{"exercises": [${kind === "mcq"
    ? `{"prompt": "...", "options": ["...","...","...","..."], "answer": "la bonne option", "explanation": "..."}`
    : `{"prompt": "...", "answer": "corrigé attendu", "explanation": "..."}`}]}
Règles :
- Respecte strictement le niveau scolaire et le chapitre demandés.
- Rédige dans la langue demandée (français ou arabe).
- Les énoncés doivent être clairs, corrects et variés en difficulté.
- Pour les QCM : exactement 4 options, une seule correcte, "answer" = le texte exact de la bonne option.
- Fournis un corrigé et une courte explication pédagogique pour chaque exercice.`;
}

async function generate(body: Required<Pick<Body, "subject" | "grade" | "topic" | "count" | "difficulty" | "kind" | "locale">>): Promise<Exercise[] | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const userMsg = `Niveau : ${body.grade}
Matière : ${body.subject}
Chapitre / thème : ${body.topic}
Nombre d'exercices : ${body.count}
Difficulté : ${body.difficulty}
Type : ${body.kind === "mcq" ? "QCM à choix multiples" : "questions ouvertes avec corrigé"}
Langue : ${body.locale === "ar" ? "arabe" : "français"}

Génère les exercices au format JSON demandé.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2000,
      system: systemPrompt(body.kind),
      messages: [{ role: "user", content: userMsg }],
    }),
    cache: "no-store",
  });
  if (!res.ok) {
    console.error("[generate-exercises] Anthropic error", res.status);
    return null;
  }
  const data = (await res.json()) as { content: Array<{ type: string; text: string }> };
  const raw = data.content.find((b) => b.type === "text")?.text ?? "";
  try {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return null;
    const parsed = JSON.parse(match[0]) as { exercises?: Exercise[] };
    if (!Array.isArray(parsed.exercises)) return null;
    return parsed.exercises.slice(0, 20);
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const rl = rateLimit(`gen-ex:${getClientKey(req)}`, { max: 8, windowSec: 120 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Trop de générations. Réessaye dans un instant." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter ?? 120) } },
    );
  }

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  // Teacher gate: must have a teacher profile.
  const admin = createAdminClient();
  const { data: teacher } = await admin
    .from("teacher_profiles")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!teacher) return NextResponse.json({ error: "Réservé aux enseignants" }, { status: 403 });

  let body: Body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const subject = (body.subject ?? "").trim().slice(0, 60);
  const grade = (body.grade ?? "").trim();
  const topic = (body.topic ?? "").trim().slice(0, 160);
  const count = Math.max(3, Math.min(15, Number(body.count) || 5));
  const difficulty = ["facile", "moyen", "difficile"].includes(body.difficulty ?? "") ? body.difficulty! : "moyen";
  const kind = body.kind === "open" ? "open" : "mcq";
  const locale = body.locale === "ar" ? "ar" : "fr";

  if (!subject || !topic) return NextResponse.json({ error: "Matière et thème requis" }, { status: 400 });
  if (!GRADES.has(grade)) return NextResponse.json({ error: "Niveau invalide" }, { status: 400 });

  let exercises: Exercise[] | null = null;
  try {
    exercises = await generate({ subject, grade, topic, count, difficulty, kind, locale });
  } catch (e) {
    console.error("[generate-exercises] error", e);
  }

  if (!exercises) {
    return NextResponse.json(
      { error: "Le générateur IA n'est pas encore configuré. Contacte l'administrateur." },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true, exercises });
}
