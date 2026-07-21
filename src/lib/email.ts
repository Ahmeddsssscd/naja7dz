/**
 * Resend email helpers — server-side only.
 * Requires RESEND_API_KEY and RESEND_FROM_EMAIL in environment variables.
 *
 * If RESEND_API_KEY is missing the functions log a warning and resolve
 * without throwing — so emails failing never break the payment webhook.
 */
import "server-only";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = process.env.RESEND_FROM_EMAIL ?? "Najaح <noreply@naja7dz.com>";

function warnIfUnconfigured(fn: string) {
  if (!resend) {
    console.warn(`[email] ${fn} skipped — RESEND_API_KEY not set`);
    return true;
  }
  return false;
}

export async function sendWelcomeEmail({
  to,
  name,
}: {
  to: string;
  name?: string;
}) {
  if (warnIfUnconfigured("sendWelcomeEmail")) return;
  const displayName = name ? name.split(" ")[0] : "là";

  await resend!.emails.send({
    from: FROM,
    to,
    subject: "Bienvenue sur Najaح — ton abonnement est activé !",
    html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAF9F6;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF9F6;padding:40px 0">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #E8EDF5">
        <tr><td style="background:#0F1B33;padding:28px 40px;text-align:center">
          <span style="font-size:24px;font-weight:700;color:#D4A72C;letter-spacing:-0.5px">Najaح</span>
        </td></tr>
        <tr><td style="padding:40px">
          <h1 style="margin:0 0 16px;font-size:22px;font-weight:700;color:#0F1B33">
            Bonjour ${displayName} ! 🎉
          </h1>
          <p style="margin:0 0 16px;color:#4B5563;font-size:16px;line-height:1.6">
            Ton abonnement <strong>Najaح</strong> est maintenant actif. Tu peux dès maintenant accéder à toutes les fonctionnalités de la plateforme.
          </p>
          <p style="margin:0 0 24px;color:#4B5563;font-size:16px;line-height:1.6">
            Connecte-toi et commence à explorer les cours, quiz, et le tuteur IA.
          </p>
          <a href="https://naja7dz.com/connexion" style="display:inline-block;background:#D4A72C;color:#0F1B33;font-weight:700;font-size:15px;padding:14px 28px;border-radius:8px;text-decoration:none">
            Accéder à mon espace →
          </a>
          <p style="margin:32px 0 0;color:#9CA3AF;font-size:13px">
            Des questions ? Réponds à cet email ou visite <a href="https://naja7dz.com/contact" style="color:#D4A72C">naja7dz.com/contact</a>.
          </p>
        </td></tr>
        <tr><td style="background:#F9FAFB;padding:20px 40px;text-align:center;border-top:1px solid #E8EDF5">
          <p style="margin:0;color:#9CA3AF;font-size:12px">© 2026 Najaح · Algérie</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}

export async function sendContactConfirmation({
  to,
  name,
}: {
  to: string;
  name: string;
}) {
  if (warnIfUnconfigured("sendContactConfirmation")) return;
  await resend!.emails.send({
    from: FROM,
    to,
    subject: "Nous avons reçu ton message — Najaح",
    html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#FAF9F6;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF9F6;padding:40px 0">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #E8EDF5">
        <tr><td style="background:#0F1B33;padding:24px 40px;text-align:center">
          <span style="font-size:22px;font-weight:700;color:#D4A72C">Najaح</span>
        </td></tr>
        <tr><td style="padding:36px 40px">
          <h1 style="margin:0 0 12px;font-size:20px;color:#0F1B33">Bonjour ${name.split(" ")[0]},</h1>
          <p style="margin:0 0 16px;color:#4B5563;font-size:15px;line-height:1.6">
            Nous avons bien reçu ton message et nous te répondrons dans les plus brefs délais (généralement sous 24h).
          </p>
          <p style="margin:0;color:#9CA3AF;font-size:13px">L'équipe Najaح</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}
