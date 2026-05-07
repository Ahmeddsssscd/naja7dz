"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

interface Controls {
  daily_time_limit_minutes: number | null;
  lock_games_until_quizzes: boolean;
  allowed_kids_universe: boolean;
  allowed_social: boolean;
  bedtime_start: string | null;
  bedtime_end: string | null;
}

export function ControlsForm({ childId, initial }: { childId: string; initial: Controls }) {
  const t = useTranslations("ParentControls");
  const [form, setForm] = useState<Controls>(initial);
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/parent/controls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childId, ...form }),
      });
      if (!res.ok) throw new Error();
      toast.success(t("saved"));
    } catch {
      toast.error(t("save_error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Time limit */}
      <Section title={t("screen_time_title")} desc={t("screen_time_text")}>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={0}
            max={240}
            step={15}
            value={form.daily_time_limit_minutes ?? 60}
            onChange={(e) => setForm((f) => ({ ...f, daily_time_limit_minutes: Number(e.target.value) }))}
            className="flex-1 accent-navy"
          />
          <div className="text-fg font-semibold tabular-nums w-24 text-end">
            <bdi>{form.daily_time_limit_minutes ?? 60}</bdi> {t("minutes_unit")}
          </div>
        </div>
        <div className="text-xs text-fg-faint mt-1.5">{t("screen_time_hint")}</div>
      </Section>

      {/* Toggles */}
      <Section title={t("kids_world_title")} desc={t("kids_world_text")}>
        <Toggle checked={form.allowed_kids_universe} onChange={(v) => setForm((f) => ({ ...f, allowed_kids_universe: v }))} />
      </Section>

      <Section title={t("social_title")} desc={t("social_text")}>
        <Toggle checked={form.allowed_social} onChange={(v) => setForm((f) => ({ ...f, allowed_social: v }))} />
      </Section>

      <Section title={t("block_games_title")} desc={t("block_games_text")}>
        <Toggle checked={form.lock_games_until_quizzes} onChange={(v) => setForm((f) => ({ ...f, lock_games_until_quizzes: v }))} />
      </Section>

      {/* Bedtime */}
      <Section title={t("sleep_title")} desc={t("sleep_text")}>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="block text-xs text-fg-soft mb-1">{t("sleep_start")}</span>
            <input
              type="time"
              value={form.bedtime_start ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, bedtime_start: e.target.value || null }))}
              className="ctrl-input"
            />
          </label>
          <label className="block">
            <span className="block text-xs text-fg-soft mb-1">{t("sleep_end")}</span>
            <input
              type="time"
              value={form.bedtime_end ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, bedtime_end: e.target.value || null }))}
              className="ctrl-input"
            />
          </label>
        </div>
      </Section>

      <button onClick={onSave} disabled={saving} className="btn btn-primary btn-lg w-full mt-4 disabled:opacity-60">
        {saving ? t("submitting") : t("submit")}
      </button>

      <style jsx>{`
        :global(.ctrl-input) {
          width: 100%;
          padding: 10px 12px;
          background: var(--surface);
          border: 1.5px solid var(--line-strong);
          border-radius: 8px;
          color: var(--fg);
          font-family: inherit;
        }
        :global(.ctrl-input:focus) {
          outline: none;
          border-color: var(--fg);
        }
      `}</style>
    </div>
  );
}

function Section({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface border border-line rounded-card p-5">
      <h3 className="font-semibold text-fg mb-1">{title}</h3>
      <p className="text-sm text-fg-soft mb-4">{desc}</p>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-7 rounded-full transition-colors ${checked ? "bg-navy" : "bg-pale-blue dark:bg-surface-3"}`}
    >
      <span
        className={`absolute top-0.5 ${checked ? "end-0.5" : "start-0.5"} w-6 h-6 rounded-full bg-white shadow transition-all`}
      />
    </button>
  );
}
