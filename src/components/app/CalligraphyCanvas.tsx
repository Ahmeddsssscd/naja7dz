"use client";

/**
 * Calligraphy tracing canvas for kids.
 *
 * The child picks an Arabic letter → it appears large and faint as a guide →
 * they trace over it with mouse or finger. Brush size + colour, undo (stroke
 * history) and clear. Works on touch and pointer devices. No backend: it's a
 * practice pad, so strokes live only in the canvas.
 */

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";

const LETTERS = [
  "ا", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س",
  "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ك", "ل", "م",
  "ن", "ه", "و", "ي",
];

const COLORS = ["#0F1B33", "#D4A72C", "#1AA179", "#DC2626", "#7C3AED"];

export function CalligraphyCanvas() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const drawing = useRef(false);
  const strokes = useRef<ImageData[]>([]); // snapshots for undo

  const [letter, setLetter] = useState("ب");
  const [color, setColor] = useState(COLORS[0]);
  const [size, setSize] = useState(14);
  const [showGuide, setShowGuide] = useState(true);

  // Set up the canvas at device resolution for crisp lines.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const cssW = parent.clientWidth;
    const cssH = Math.round(cssW * 0.62);
    const dpr = window.devicePixelRatio || 1;
    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctxRef.current = ctx;
    strokes.current = [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pos = (e: React.PointerEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const start = (e: React.PointerEvent) => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    // Save a snapshot BEFORE this stroke for undo.
    strokes.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (strokes.current.length > 30) strokes.current.shift();
    drawing.current = true;
    const { x, y } = pos(e);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.beginPath();
    ctx.moveTo(x, y);
    canvas.setPointerCapture(e.pointerId);
  };

  const move = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    const ctx = ctxRef.current;
    if (!ctx) return;
    const { x, y } = pos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const end = () => {
    drawing.current = false;
  };

  const clear = () => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokes.current = [];
  };

  const undo = () => {
    const ctx = ctxRef.current;
    const last = strokes.current.pop();
    if (ctx && last) ctx.putImageData(last, 0, 0);
  };

  // Clear the drawing when the letter changes so the new guide is clean.
  useEffect(() => {
    clear();
  }, [letter]);

  return (
    <div className="space-y-5">
      {/* Letter picker */}
      <div>
        <h2 className="text-sm font-semibold text-fg mb-2">
          {isAr ? "اختر حرفًا لتتدرّب عليه" : "Choisis une lettre à tracer"}
        </h2>
        <div className="grid grid-cols-7 sm:grid-cols-10 gap-1.5">
          {LETTERS.map((l) => (
            <button
              key={l}
              onClick={() => setLetter(l)}
              className={`aspect-square rounded-xl flex items-center justify-center text-2xl font-arabic transition-all active:scale-95 ${
                letter === l
                  ? "bg-navy text-white shadow-card"
                  : "bg-surface border border-line text-navy dark:text-cream hover:border-gold"
              }`}
              aria-label={isAr ? `الحرف ${l}` : `Lettre ${l}`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas with faint guide letter behind */}
      <div className="relative bg-surface border-2 border-line rounded-card overflow-hidden">
        {/* dotted midline like a writing notebook */}
        <div className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-line pointer-events-none" />
        {showGuide && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none font-arabic text-fg"
            style={{ fontSize: "min(45vw, 260px)", opacity: 0.08, lineHeight: 1 }}
            aria-hidden
          >
            {letter}
          </div>
        )}
        <canvas
          ref={canvasRef}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerLeave={end}
          className="relative touch-none block w-full cursor-crosshair"
        />
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* colours */}
        <div className="flex gap-1.5">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-8 h-8 rounded-full transition-transform ${color === c ? "ring-2 ring-offset-2 ring-fg scale-110" : ""}`}
              style={{ background: c }}
              aria-label={`Couleur ${c}`}
            />
          ))}
        </div>

        {/* brush size */}
        <label className="flex items-center gap-2 text-xs text-fg-soft">
          {isAr ? "السُّمك" : "Épaisseur"}
          <input
            type="range"
            min={4}
            max={30}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="accent-gold"
          />
        </label>

        <button
          onClick={() => setShowGuide((v) => !v)}
          className="text-xs font-semibold px-3 py-1.5 rounded-full border border-line text-fg-soft hover:border-fg/40"
        >
          {showGuide ? (isAr ? "إخفاء النموذج" : "Masquer le modèle") : (isAr ? "إظهار النموذج" : "Afficher le modèle")}
        </button>

        <div className="ms-auto flex gap-2">
          <button onClick={undo} className="btn btn-outline btn-sm">
            {isAr ? "تراجع" : "Annuler"}
          </button>
          <button onClick={clear} className="btn btn-primary btn-sm">
            {isAr ? "مسح الكل" : "Tout effacer"}
          </button>
        </div>
      </div>
    </div>
  );
}
