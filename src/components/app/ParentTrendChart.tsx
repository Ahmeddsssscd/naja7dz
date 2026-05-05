"use client";

import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

export function ParentTrendChart({ data }: { data: { day: string; avg: number }[] }) {
  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <XAxis dataKey="day" stroke="var(--fg-faint)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis stroke="var(--fg-faint)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} ticks={[0, 50, 100]} />
          <Tooltip
            contentStyle={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: "var(--fg-soft)" }}
            cursor={{ stroke: "var(--line-strong)" }}
          />
          <Line type="monotone" dataKey="avg" stroke="#D4A72C" strokeWidth={2.5} dot={{ fill: "#D4A72C", r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
