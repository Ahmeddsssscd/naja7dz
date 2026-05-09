"use client";

/**
 * Coloriage par numéros — color-by-number for kids.
 *
 * Templates are SVG grids of polygons; each polygon has a target number 1-6.
 * The kid picks a color from the palette, then taps cells; if the cell's
 * number matches the selected color's number, it fills.
 *
 * Templates are hand-coded geometric shapes (lion, fennec, palmier, drapeau,
 * mosquée, étoile). Doesn't try to be artistic — geometric is fine.
 *
 * On 100% complete, confetti + a "Sauvegarder" button that downloads PNG via
 * canvas.toDataURL.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { useGameBack } from "./useGameBack";
import confetti from "canvas-confetti";

type Phase = "pick" | "color" | "done";

interface Cell {
  /** Polygon points in SVG coords ("x1,y1 x2,y2 ...") */
  points: string;
  /** Target number 1..6 */
  n: number;
}

interface Template {
  id: string;
  label: string;
  emoji: string;
  /** SVG viewBox dimensions */
  width: number;
  height: number;
  cells: Cell[];
}

// Color palette: numeric key 1..6
const PALETTE: { n: number; name: string; hex: string }[] = [
  { n: 1, name: "Rouge",  hex: "#E53935" },
  { n: 2, name: "Bleu",   hex: "#1E88E5" },
  { n: 3, name: "Vert",   hex: "#43A047" },
  { n: 4, name: "Jaune",  hex: "#FDD835" },
  { n: 5, name: "Violet", hex: "#8E24AA" },
  { n: 6, name: "Orange", hex: "#FB8C00" },
];

const colorOfN = (n: number) => PALETTE.find((p) => p.n === n)?.hex ?? "#fff";

/** Compute centroid of a polygon (space-separated "x,y" pairs). */
function centroid(points: string): { x: number; y: number } {
  const pts = points.trim().split(/\s+/).map((p) => {
    const [x, y] = p.split(",").map(Number);
    return { x, y };
  });
  if (pts.length === 0) return { x: 0, y: 0 };
  const sum = pts.reduce(
    (acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }),
    { x: 0, y: 0 },
  );
  return { x: sum.x / pts.length, y: sum.y / pts.length };
}

/* ---------- TEMPLATE GENERATORS ----------
 * Each template is a simple grid of geometric polygons; not artistic but kid-
 * friendly. Functions return Cell[] arrays.
 * --------------------------------------- */

// Drapeau algérien: 8x6 grid; left half (cols 0-3) = 3 (vert), right half = 1
// (rouge sub-region only on stripe), background mostly white but we color
// vert + rouge stripe + crescent.
function drapeauCells(): Cell[] {
  const cells: Cell[] = [];
  const cols = 8, rows = 6;
  const cellW = 200 / cols, cellH = 130 / rows;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cellW, y = r * cellH;
      const points = `${x},${y} ${x + cellW},${y} ${x + cellW},${y + cellH} ${x},${y + cellH}`;
      // Half left: green (3); half right: white but middle row gets red star area
      let n: number;
      if (c < 4) n = 3;
      else n = 4; // jaune for star area on right
      // Crescent: cols 3-4, rows 2-3 are jaune (4)
      if ((c === 3 || c === 4) && (r === 2 || r === 3)) n = 4;
      cells.push({ points, n });
    }
  }
  return cells;
}

// Étoile: 8-pointed star arranged in 6 triangular wedges
function etoileCells(): Cell[] {
  const cells: Cell[] = [];
  // Big diamond split into 8 triangles around center, alternating 1/4
  const cx = 100, cy = 100;
  const R = 75;
  const r = 28;
  const points = 16; // 8 outer, 8 inner alternating
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < points; i++) {
    const angle = (i * Math.PI) / 8 - Math.PI / 2;
    const radius = i % 2 === 0 ? R : r;
    pts.push({ x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius });
  }
  for (let i = 0; i < points; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % points];
    const tri = `${cx},${cy} ${a.x.toFixed(1)},${a.y.toFixed(1)} ${b.x.toFixed(1)},${b.y.toFixed(1)}`;
    // Alternate 4 (jaune) and 1 (rouge)
    cells.push({ points: tri, n: i % 2 === 0 ? 4 : 1 });
  }
  // Surround squares for 4 corners with color 5 / 6
  const corners = [
    { x: 0,    y: 0,   n: 5 },
    { x: 150,  y: 0,   n: 6 },
    { x: 0,    y: 150, n: 6 },
    { x: 150,  y: 150, n: 5 },
  ];
  for (const cnr of corners) {
    cells.push({
      points: `${cnr.x},${cnr.y} ${cnr.x + 50},${cnr.y} ${cnr.x + 50},${cnr.y + 50} ${cnr.x},${cnr.y + 50}`,
      n: cnr.n,
    });
  }
  return cells;
}

// Lion (super-simplified): big head circle (4=jaune) with mane wedges around
function lionCells(): Cell[] {
  const cells: Cell[] = [];
  const cx = 100, cy = 100;
  const headR = 38;
  const maneR = 75;
  // 12 mane wedges around — orange (6)
  const wedges = 12;
  for (let i = 0; i < wedges; i++) {
    const a1 = (i / wedges) * Math.PI * 2 - Math.PI / 2;
    const a2 = ((i + 1) / wedges) * Math.PI * 2 - Math.PI / 2;
    const x1 = cx + Math.cos(a1) * headR;
    const y1 = cy + Math.sin(a1) * headR;
    const x2 = cx + Math.cos(a1) * maneR;
    const y2 = cy + Math.sin(a1) * maneR;
    const x3 = cx + Math.cos(a2) * maneR;
    const y3 = cy + Math.sin(a2) * maneR;
    const x4 = cx + Math.cos(a2) * headR;
    const y4 = cy + Math.sin(a2) * headR;
    cells.push({
      points: `${x1.toFixed(1)},${y1.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)} ${x3.toFixed(1)},${y3.toFixed(1)} ${x4.toFixed(1)},${y4.toFixed(1)}`,
      n: i % 2 === 0 ? 6 : 4, // alternating orange/yellow mane
    });
  }
  // Head — split into 4 quadrants for variety
  for (let q = 0; q < 4; q++) {
    const a1 = (q / 4) * Math.PI * 2 - Math.PI / 2;
    const a2 = ((q + 1) / 4) * Math.PI * 2 - Math.PI / 2;
    // approximate quarter circle as triangle from center
    const segs = 6;
    for (let s = 0; s < segs; s++) {
      const sa1 = a1 + ((a2 - a1) * s) / segs;
      const sa2 = a1 + ((a2 - a1) * (s + 1)) / segs;
      const x1 = cx + Math.cos(sa1) * headR;
      const y1 = cy + Math.sin(sa1) * headR;
      const x2 = cx + Math.cos(sa2) * headR;
      const y2 = cy + Math.sin(sa2) * headR;
      cells.push({
        points: `${cx},${cy} ${x1.toFixed(1)},${y1.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`,
        n: 4, // jaune for the face
      });
    }
  }
  // Eyes — two small squares
  cells.push({ points: "85,90 95,90 95,100 85,100", n: 2 });
  cells.push({ points: "105,90 115,90 115,100 105,100", n: 2 });
  // Nose — triangle
  cells.push({ points: "95,110 105,110 100,118", n: 1 });
  return cells;
}

// Fennec (simple desert fox): big triangular ears, rounded body
function fennecCells(): Cell[] {
  const cells: Cell[] = [];
  // Body — circle approximated by 8 triangles around (60,120)
  const cx = 100, cy = 130, R = 50;
  const segs = 8;
  for (let i = 0; i < segs; i++) {
    const a1 = (i / segs) * Math.PI * 2;
    const a2 = ((i + 1) / segs) * Math.PI * 2;
    const x1 = cx + Math.cos(a1) * R;
    const y1 = cy + Math.sin(a1) * R;
    const x2 = cx + Math.cos(a2) * R;
    const y2 = cy + Math.sin(a2) * R;
    cells.push({
      points: `${cx},${cy} ${x1.toFixed(1)},${y1.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`,
      n: 6, // orange body
    });
  }
  // Ears — two big triangles
  cells.push({ points: "60,90 50,30 80,75", n: 4 });
  cells.push({ points: "140,90 150,30 120,75", n: 4 });
  // Inner ears
  cells.push({ points: "65,75 60,50 75,72", n: 1 });
  cells.push({ points: "135,75 140,50 125,72", n: 1 });
  // Eyes
  cells.push({ points: "85,115 95,115 95,125 85,125", n: 2 });
  cells.push({ points: "105,115 115,115 115,125 105,125", n: 2 });
  // Nose
  cells.push({ points: "95,135 105,135 100,142", n: 1 });
  // Sky background — 4 squares
  cells.push({ points: "0,0 100,0 100,30 0,30", n: 2 });
  cells.push({ points: "100,0 200,0 200,30 100,30", n: 2 });
  // Sand background bottom
  cells.push({ points: "0,170 100,170 100,200 0,200", n: 4 });
  cells.push({ points: "100,170 200,170 200,200 100,200", n: 4 });
  return cells;
}

// Palmier (palm tree): trunk rectangle, fronds triangles, sun, sand
function palmierCells(): Cell[] {
  const cells: Cell[] = [];
  // Sky split into 2 (gradient effect via 2 cells)
  cells.push({ points: "0,0 100,0 100,80 0,80", n: 2 });
  cells.push({ points: "100,0 200,0 200,80 100,80", n: 2 });
  // Sun
  cells.push({ points: "150,15 175,15 175,40 150,40", n: 4 });
  cells.push({ points: "150,40 175,40 165,55 160,55", n: 6 });
  // Trunk — 3 rectangles stacked
  cells.push({ points: "92,80 108,80 108,110 92,110", n: 6 });
  cells.push({ points: "92,110 108,110 108,140 92,140", n: 6 });
  cells.push({ points: "92,140 108,140 108,170 92,170", n: 6 });
  // Fronds — 6 triangles radiating from top
  const top = { x: 100, y: 80 };
  const fronds = [
    { x: 30, y: 50 },
    { x: 60, y: 30 },
    { x: 100, y: 20 },
    { x: 140, y: 30 },
    { x: 170, y: 50 },
    { x: 130, y: 70 },
  ];
  for (let i = 0; i < fronds.length; i++) {
    const f = fronds[i];
    const next = fronds[(i + 1) % fronds.length];
    cells.push({
      points: `${top.x},${top.y} ${f.x},${f.y} ${next.x},${next.y}`,
      n: 3, // green
    });
  }
  // Sand
  cells.push({ points: "0,170 100,170 100,200 0,200", n: 4 });
  cells.push({ points: "100,170 200,170 200,200 100,200", n: 4 });
  return cells;
}

// Mosquée (geometric mosque silhouette): main hall, dome, minaret
function mosqueeCells(): Cell[] {
  const cells: Cell[] = [];
  // Sky
  cells.push({ points: "0,0 100,0 100,80 0,80", n: 2 });
  cells.push({ points: "100,0 200,0 200,80 100,80", n: 2 });
  // Star + crescent decoration (top-left)
  cells.push({ points: "20,15 30,15 25,25", n: 4 });
  // Minaret — tall rectangle
  cells.push({ points: "40,50 55,50 55,170 40,170", n: 5 });
  cells.push({ points: "40,40 55,40 55,50 40,50", n: 6 });
  cells.push({ points: "37,30 58,30 58,40 37,40", n: 6 });
  cells.push({ points: "44,15 51,15 51,30 44,30", n: 1 });
  // Main hall — big rectangle
  cells.push({ points: "70,100 170,100 170,170 70,170", n: 5 });
  // Dome — half-circle approximated by 6 triangles
  const cx = 120, cy = 100, R = 40;
  const segs = 6;
  for (let i = 0; i < segs; i++) {
    const a1 = Math.PI + (i / segs) * Math.PI;
    const a2 = Math.PI + ((i + 1) / segs) * Math.PI;
    const x1 = cx + Math.cos(a1) * R;
    const y1 = cy + Math.sin(a1) * R;
    const x2 = cx + Math.cos(a2) * R;
    const y2 = cy + Math.sin(a2) * R;
    cells.push({
      points: `${cx},${cy} ${x1.toFixed(1)},${y1.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`,
      n: 4, // gold dome
    });
  }
  // Door
  cells.push({ points: "112,140 128,140 128,170 112,170", n: 6 });
  // Windows — small squares
  cells.push({ points: "85,115 100,115 100,130 85,130", n: 4 });
  cells.push({ points: "140,115 155,115 155,130 140,130", n: 4 });
  // Ground
  cells.push({ points: "0,170 100,170 100,200 0,200", n: 6 });
  cells.push({ points: "100,170 200,170 200,200 100,200", n: 6 });
  return cells;
}

const TEMPLATES: Template[] = [
  { id: "drapeau",  label: "Drapeau",  emoji: "🇩🇿", width: 200, height: 130, cells: drapeauCells() },
  { id: "etoile",   label: "Étoile",   emoji: "⭐", width: 200, height: 200, cells: etoileCells() },
  { id: "lion",     label: "Lion",     emoji: "🦁", width: 200, height: 200, cells: lionCells() },
  { id: "fennec",   label: "Fennec",   emoji: "🦊", width: 200, height: 200, cells: fennecCells() },
  { id: "palmier",  label: "Palmier",  emoji: "🌴", width: 200, height: 200, cells: palmierCells() },
  { id: "mosquee",  label: "Mosquée",  emoji: "🕌", width: 200, height: 200, cells: mosqueeCells() },
];

export function ColorageNumeros() {
  const goBack = useGameBack();
  const [phase, setPhase] = useState<Phase>("pick");
  const [tplId, setTplId] = useState<string>("drapeau");
  const [filled, setFilled] = useState<Record<number, boolean>>({});
  const [activeColor, setActiveColor] = useState<number>(1);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [donePopped, setDonePopped] = useState(false);

  const tpl = useMemo(() => TEMPLATES.find((t) => t.id === tplId)!, [tplId]);
  const total = tpl.cells.length;
  const filledCount = Object.values(filled).filter(Boolean).length;
  const pct = Math.round((filledCount / total) * 100);

  useEffect(() => {
    if (phase === "color" && filledCount === total && total > 0 && !donePopped) {
      setDonePopped(true);
      confetti({ particleCount: 120, spread: 100, colors: ["#D4A72C", "#0F1B33", "#1AD18C", "#E53935"] });
      setTimeout(() => setPhase("done"), 600);
    }
  }, [filledCount, total, phase, donePopped]);

  const start = (id: string) => {
    setTplId(id);
    setFilled({});
    setActiveColor(1);
    setDonePopped(false);
    setPhase("color");
  };

  const onCellTap = (idx: number) => {
    const cell = tpl.cells[idx];
    if (filled[idx]) return;
    if (cell.n === activeColor) {
      setFilled((f) => ({ ...f, [idx]: true }));
    }
  };

  const onSave = () => {
    if (!svgRef.current) return;
    try {
      // Serialize SVG, draw to canvas, export PNG
      const svg = svgRef.current;
      const xml = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = tpl.width * 4; // upscale
        canvas.height = tpl.height * 4;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        const png = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = png;
        a.download = `coloriage-${tpl.id}.png`;
        a.click();
      };
      img.src = url;
    } catch { /* ignore */ }
  };

  if (phase === "pick") {
    return (
      <div className="min-h-screen bg-cream flex flex-col">
        <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-pale-blue">
          <button onClick={goBack} className="w-10 h-10 rounded-full bg-white border border-pale-blue flex items-center justify-center text-navy" aria-label="Retour">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <h1 className="text-base font-bold text-navy">Coloriage par numéros</h1>
          <div className="w-10" />
        </header>
        <main className="flex-1 px-5 py-6 max-w-md md:max-w-2xl lg:max-w-3xl mx-auto w-full">
          <p className="text-fg-soft text-sm text-center mb-6">
            Choisis un dessin à colorier. Tape un numéro à gauche, puis tape les zones du même numéro.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => start(t.id)}
                className="bg-white border-2 border-pale-blue rounded-2xl p-5 flex flex-col items-center gap-2 hover:border-gold hover:scale-[1.03] active:scale-95 transition-all"
              >
                <span className="text-5xl">{t.emoji}</span>
                <span className="font-bold text-navy text-sm">{t.label}</span>
                <span className="text-xs text-fg-soft">{t.cells.length} zones</span>
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-5">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">🎨</div>
          <h1 className="text-3xl font-bold text-navy mb-2">Magnifique !</h1>
          <p className="text-fg-soft text-sm mb-6">Tu as fini ton coloriage. Tu peux le sauvegarder !</p>

          <div className="bg-white border-4 border-navy rounded-2xl p-4 mb-6 inline-block">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${tpl.width} ${tpl.height}`}
              className="w-48 h-48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width={tpl.width} height={tpl.height} fill="#FFFFFF" />
              {tpl.cells.map((c, i) => (
                <polygon
                  key={i}
                  points={c.points}
                  fill={colorOfN(c.n)}
                  stroke="#0F1B33"
                  strokeWidth="0.6"
                />
              ))}
            </svg>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setPhase("pick")} className="btn btn-outline flex-1">Autre</button>
            <button onClick={onSave} className="btn btn-primary flex-1">💾 Sauvegarder</button>
          </div>
        </div>
      </div>
    );
  }

  // Color phase
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="px-5 py-4 flex items-center justify-between bg-white border-b border-pale-blue">
        <button onClick={() => setPhase("pick")} className="w-10 h-10 rounded-full bg-white border border-pale-blue flex items-center justify-center text-navy" aria-label="Retour">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 className="text-base font-bold text-navy">{tpl.label}</h1>
        <div className="text-xs font-bold text-gold tabular-nums">{pct}%</div>
      </header>

      {/* Progress bar */}
      <div className="h-1.5 bg-pale-blue overflow-hidden">
        <div className="h-full bg-gold transition-all duration-300" style={{ width: `${pct}%` }} />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-3 py-4 gap-4">
        <div className="bg-white border-4 border-navy rounded-2xl p-3 max-w-full">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${tpl.width} ${tpl.height}`}
            className="w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] max-w-[80vw] max-h-[55vh]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width={tpl.width} height={tpl.height} fill="#FFFFFF" />
            {tpl.cells.map((c, i) => {
              const isFilled = !!filled[i];
              const { x: cx, y: cy } = centroid(c.points);
              return (
                <g key={i}>
                  <polygon
                    points={c.points}
                    fill={isFilled ? colorOfN(c.n) : "#FFFFFF"}
                    stroke="#0F1B33"
                    strokeWidth="0.7"
                    onClick={() => onCellTap(i)}
                    className="cursor-pointer transition-all"
                  />
                  {!isFilled && (
                    <text
                      x={cx}
                      y={cy}
                      fontSize="6"
                      fontWeight="bold"
                      fill="#0F1B33"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      pointerEvents="none"
                    >
                      {c.n}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Palette */}
        <div className="flex flex-wrap gap-2 justify-center w-full max-w-md">
          {PALETTE.map((p) => {
            const isActive = activeColor === p.n;
            return (
              <button
                key={p.n}
                onClick={() => setActiveColor(p.n)}
                className={`flex flex-col items-center gap-1 rounded-xl border-2 p-2 min-w-[60px] transition-all active:scale-95 ${
                  isActive ? "border-navy scale-110 shadow-card" : "border-pale-blue hover:border-gold"
                }`}
                aria-label={`Couleur ${p.n} ${p.name}`}
              >
                <div
                  className="w-8 h-8 rounded-lg border border-navy/20 flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: p.hex }}
                >
                  {p.n}
                </div>
                <span className="text-[10px] font-semibold text-navy">{p.name}</span>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
