"use client";

/**
 * Alternative sign-in methods: Google (OAuth) and phone (OTP).
 *
 * IMPORTANT: these require provider configuration in the Supabase dashboard:
 *   - Google: enable the Google provider (client ID/secret) and add
 *     <site>/api/auth/callback to the allowed redirect URLs.
 *   - Phone: configure an SMS provider (Twilio, etc.) in Supabase Auth.
 * Until then the buttons render but the provider returns an error, which we
 * surface to the user.
 */

import { useState } from "react";
import { useTranslations } from "next-intl";
import { createBrowserClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function SocialAuth({ next = "/espace" }: { next?: string }) {
  const t = useTranslations("Connexion");
  const [phoneMode, setPhoneMode] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const google = async () => {
    setBusy(true);
    try {
      const supabase = createBrowserClient();
      const redirectTo = `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(next)}`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });
      if (error) throw error;
      // On success the browser is redirected to Google; nothing else to do.
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Google indisponible");
      setBusy(false);
    }
  };

  const sendOtp = async () => {
    const clean = phone.replace(/\s+/g, "");
    if (!/^\+?\d{8,15}$/.test(clean)) {
      toast.error(t("phone_invalid"));
      return;
    }
    setBusy(true);
    try {
      const supabase = createBrowserClient();
      const { error } = await supabase.auth.signInWithOtp({ phone: clean });
      if (error) throw error;
      setOtpSent(true);
      toast.success(t("otp_sent"));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "SMS indisponible");
    } finally {
      setBusy(false);
    }
  };

  const verifyOtp = async () => {
    setBusy(true);
    try {
      const supabase = createBrowserClient();
      const { error } = await supabase.auth.verifyOtp({
        phone: phone.replace(/\s+/g, ""),
        token: otp.trim(),
        type: "sms",
      });
      if (error) throw error;
      window.location.href = next;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("otp_invalid"));
    } finally {
      setBusy(false);
    }
  };

  const inputClass =
    "w-full h-11 px-3.5 bg-surface border-[1.5px] border-line-strong rounded-lg text-fg text-[15px] focus:outline-none focus:border-fg";

  return (
    <div className="mt-5">
      <div className="flex items-center gap-3 mb-5">
        <span className="h-px bg-line flex-1" />
        <span className="text-xs text-fg-faint">{t("or")}</span>
        <span className="h-px bg-line flex-1" />
      </div>

      {/* Google */}
      <button
        type="button"
        onClick={google}
        disabled={busy}
        className="w-full h-11 flex items-center justify-center gap-2.5 border-[1.5px] border-line-strong rounded-lg text-fg font-medium text-sm hover:bg-surface-3 transition-colors disabled:opacity-60"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
        </svg>
        {t("continue_google")}
      </button>

      {/* Phone */}
      {!phoneMode ? (
        <button
          type="button"
          onClick={() => setPhoneMode(true)}
          className="w-full h-11 mt-3 flex items-center justify-center gap-2.5 border-[1.5px] border-line-strong rounded-lg text-fg font-medium text-sm hover:bg-surface-3 transition-colors"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/>
          </svg>
          {t("continue_phone")}
        </button>
      ) : (
        <div className="mt-3 border border-line rounded-lg p-3.5 space-y-2.5">
          {!otpSent ? (
            <>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+213 …"
                dir="ltr"
                className={inputClass}
                inputMode="tel"
              />
              <button onClick={sendOtp} disabled={busy} className="btn btn-primary w-full disabled:opacity-60">
                {busy ? t("submitting") : t("send_code")}
              </button>
            </>
          ) : (
            <>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder={t("otp_placeholder")}
                dir="ltr"
                className={`${inputClass} tracking-[0.4em] text-center font-mono`}
                inputMode="numeric"
              />
              <button onClick={verifyOtp} disabled={busy} className="btn btn-primary w-full disabled:opacity-60">
                {busy ? t("submitting") : t("verify_code")}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
