/**
 * /fac/chat/[threadId] — buyer ↔ helper chat thread.
 *
 * Both parties of the thread can see messages and send new ones. Helpers
 * can also drop "price proposal" messages that buyers can pay. For the
 * ask_student flow, payment was already handled at request creation —
 * the buyer just chats here.
 *
 * Polling-based for now (no realtime); 5s refresh interval. Realtime via
 * Supabase channels is a next-step optimization.
 */
import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PageShell } from "@/components/landing/PageShell";
import { Link } from "@/i18n/routing";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { ChatThread } from "@/components/app/fac/ChatThread";

export const metadata = { title: "Chat — Najaح" };

interface Props {
  params: Promise<{ threadId: string }>;
  searchParams: Promise<{ pending_payment?: string }>;
}

export default async function ChatPage({ params, searchParams }: Props) {
  const { threadId } = await params;
  const { pending_payment } = await searchParams;
  const t = await getTranslations("FacChat");

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/connexion?next=/fac/chat/${threadId}`);

  const admin = createAdminClient();
  const { data: thread } = await admin
    .from("chat_threads")
    .select("id, buyer_id, helper_user_id, request_id")
    .eq("id", threadId)
    .maybeSingle();
  if (!thread) notFound();
  if (thread.buyer_id !== user.id && thread.helper_user_id !== user.id) {
    notFound();
  }

  const { data: request } = await admin
    .from("service_requests")
    .select("id, flow, status, price_da, brief")
    .eq("id", thread.request_id)
    .maybeSingle();

  const { data: helperProfile } = await admin
    .from("helper_profiles")
    .select("id, display_name, last_initial, university_slug")
    .eq("user_id", thread.helper_user_id)
    .maybeSingle();

  const { data: msgs } = await admin
    .from("chat_messages")
    .select("id, sender_id, kind, body, created_at")
    .eq("thread_id", threadId)
    .order("created_at");

  const role = thread.buyer_id === user.id ? "buyer" : "helper";

  return (
    <PageShell active="fac">
      <section className="py-6 bg-surface border-b border-line">
        <div className="container-x max-w-3xl flex items-center justify-between gap-3">
          <Link href={role === "buyer" ? "/fac/aide" : "/fac/mon-profil"} className="text-xs text-fg-soft hover:text-fg">
            ← {t("back")}
          </Link>
          {helperProfile && (
            <Link href={`/fac/aide/${helperProfile.id}` as never} className="text-xs text-fg-soft hover:text-fg">
              {role === "buyer"
                ? `${helperProfile.display_name.split(" ")[0]} ${helperProfile.last_initial ?? ""}`
                : t("your_request")}
            </Link>
          )}
        </div>
      </section>

      <section className="py-8 bg-surface">
        <div className="container-x max-w-3xl">
          {pending_payment && (
            <div className="bg-gold/15 border border-gold rounded-card p-4 mb-5 text-sm">
              <strong className="text-fg block mb-1">Paiement requis</strong>
              <span className="text-fg-soft">
                Cette conversation se débloque une fois les {pending_payment} DA versés. (Intégration Chargily à venir — pour le test, considère que le paiement est validé et discute librement.)
              </span>
            </div>
          )}

          <ChatThread
            threadId={threadId}
            initialMessages={(msgs ?? []).map((m) => ({
              id: m.id,
              senderId: m.sender_id,
              kind: m.kind,
              body: m.body,
              createdAt: m.created_at,
            }))}
            currentUserId={user.id}
            role={role}
            request={request ? { flow: request.flow, status: request.status, price_da: request.price_da } : null}
          />
        </div>
      </section>
    </PageShell>
  );
}
