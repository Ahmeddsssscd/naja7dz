/**
 * POST /api/parent/explain — receive a "comment expliquer X à un Y" question.
 *
 * For now we return a generic 4-step pedagogical framework template (in FR
 * + AR), populated with the parent's question for personalisation. A real
 * AI hookup (Claude / GPT) plugs in here later — UI never has to change.
 *
 * The question + reply are stored in `parent_questions` so a Najah tutor
 * can follow up with a deeper answer + so we have training data for
 * eventually moving to fine-tuning.
 */
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { checkSetupErr } from "@/lib/db-errors";

export async function POST(req: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  let body: { question?: string; grade?: string; subject_fr?: string; subject_ar?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const question = String(body.question ?? "").trim().slice(0, 1500);
  const grade    = String(body.grade ?? "").trim().slice(0, 8);
  const subject_fr = String(body.subject_fr ?? "").trim().slice(0, 50);
  const subject_ar = String(body.subject_ar ?? "").trim().slice(0, 50);

  if (question.length < 8) return NextResponse.json({ error: "Question trop courte" }, { status: 400 });

  // Build a generic 4-step framework using the inputs. This is a deliberate
  // placeholder — the value is in collecting questions + giving the parent
  // *something* concrete right away, not in nailing the perfect explanation
  // before our AI is wired up.
  const reply = {
    fr: [
      `Commence par une image concrète tirée de leur quotidien (${grade}). Cherche un objet dans la maison ou un dessin animé qu'ils connaissent et qui illustre l'idée principale.`,
      `Définis l'idée en 1 phrase courte, sans jargon. Si possible, utilise les mots qu'ils utilisent déjà.`,
      `Donne 2 exemples opposés (un OUI, un NON) pour qu'ils sentent les limites de l'idée. Demande-leur ensuite d'inventer leur propre exemple.`,
      `Termine par une question ouverte : "À quoi ça sert dans la vraie vie ?". Si la réponse hésite, propose une piste — ne corrige pas trop vite.`,
    ],
    ar: [
      `ابدأ بصورة من حياتهم اليومية (${grade}). ابحث عن شيء في البيت أو رسم متحرك يعرفونه ويلخّص الفكرة.`,
      `عرّف الفكرة بجملة واحدة قصيرة بلا مصطلحات صعبة. استخدم كلماتهم.`,
      `أعطِ مثالين متضادين (نعم/لا) ليُحسّوا بحدود الفكرة. ثم اطلب منهم اختراع مثال خاصّ بهم.`,
      `اختم بسؤال مفتوح: "لماذا هذا مهمّ في الحياة ؟". إذا تردّدوا، اقترح اتجاهاً ولا تصحّح بسرعة.`,
    ],
    takeaway_fr: `Pour ${question}, l'enfant retient mieux quand l'explication est ancrée dans son monde, courte, et invite à parler.`,
    takeaway_ar: `بخصوص "${question}"، الطفل يفهم أكثر حين يكون الشرح من عالمه، قصيراً، ويدعوه للكلام.`,
  };

  // Store the question so a tutor can follow up with a personalised reply.
  // If the table doesn't exist yet (migration pending), don't block the user.
  const { error } = await supabase
    .from("parent_questions")
    .insert({
      user_id: user.id,
      question,
      grade,
      subject_fr,
      subject_ar,
      reply: reply,
      status: "answered_template",
    });

  // 503 if schema isn't ready (helpful debug, but still return reply)
  const setup = checkSetupErr(error);
  if (setup) {
    console.warn("[parent/explain] DB not ready:", setup.body);
    return NextResponse.json({ reply, stored: false });
  }
  if (error) {
    console.error("[parent/explain] insert failed", error);
    // Still return the reply — the template is useful even if storage fails.
    return NextResponse.json({ reply, stored: false });
  }

  return NextResponse.json({ reply, stored: true });
}
