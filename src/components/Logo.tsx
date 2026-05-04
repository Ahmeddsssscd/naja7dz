/**
 * Najaح logo — wordmark and mark variants.
 *
 * Two ways to render the logo:
 *   <Logo />              full wordmark "Najaح" + cap   (default, for nav/footer)
 *   <Logo variant="mark" />   just the ح-curl + cap         (for app icon, favicon)
 *
 * Sizing:
 *   <Logo height={32} />           explicit height in px
 *   <Logo height={40} variant="mark" />
 *
 * To swap in the official designer asset later:
 *   1. Save the official SVG to /public/logo-wordmark.svg
 *   2. Save the icon-only version to /public/logo-mark.svg
 *   3. Set USE_OFFICIAL_ASSET to true below.
 *   The component will then use <Image> from next/image with those files.
 */
import Image from "next/image";

const USE_OFFICIAL_ASSET = false; // flip to true once /public/logo-*.svg exist

type LogoProps = {
  height?: number;
  variant?: "wordmark" | "mark";
  className?: string;
  // Mono mode: render entirely in white (for navy app icon background)
  mono?: "white" | "navy" | null;
};

export function Logo({
  height = 32,
  variant = "wordmark",
  className,
  mono = null,
}: LogoProps) {
  if (USE_OFFICIAL_ASSET) {
    const src = variant === "mark" ? "/logo-mark.svg" : "/logo-wordmark.svg";
    const aspect = variant === "mark" ? 1 : 240 / 60;
    return (
      <Image
        src={src}
        alt="Najaح"
        height={height}
        width={Math.round(height * aspect)}
        priority
        className={className}
      />
    );
  }

  if (variant === "mark") {
    return <MarkSvg height={height} className={className} mono={mono} />;
  }
  return <WordmarkSvg height={height} className={className} mono={mono} />;
}

/* ============================================================
   Inline SVG — wordmark "Najaح" with cap
   viewBox 240×60 (4:1 ratio). Scales to whatever height you set.
   ============================================================ */
function WordmarkSvg({
  height,
  className,
  mono,
}: {
  height: number;
  className?: string;
  mono: "white" | "navy" | null;
}) {
  const ink = mono === "white" ? "#FFFFFF" : "#0F1B33";
  const accent = mono === "white" ? "#FFFFFF" : "#D4A72C";

  return (
    <svg
      height={height}
      viewBox="0 0 240 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Najaح"
      className={className}
    >
      {/* "Naja" — uses Poppins (loaded globally via next/font) */}
      <text
        x="0"
        y="48"
        fontFamily="var(--font-poppins), Poppins, system-ui, sans-serif"
        fontWeight={700}
        fontSize="48"
        fill={ink}
        letterSpacing="-1.6"
      >
        Naja
      </text>

      {/* ح — flowing curl. Single stroke, rounded ends. */}
      <path
        d="M148 22 Q148 10 162 10 Q190 10 200 26 Q210 48 184 54 Q164 57 150 44"
        stroke={ink}
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Graduation cap, perched on top of the ح */}
      <CapGroup x={158} y={-2} ink={ink} accent={accent} />
    </svg>
  );
}

/* ============================================================
   Inline SVG — just the mark (ح + cap) — for app icons / favicon
   viewBox 64×64 (square). Scales to whatever height you set.
   ============================================================ */
function MarkSvg({
  height,
  className,
  mono,
}: {
  height: number;
  className?: string;
  mono: "white" | "navy" | null;
}) {
  const ink = mono === "white" ? "#FFFFFF" : "#0F1B33";
  const accent = mono === "white" ? "#FFFFFF" : "#D4A72C";

  return (
    <svg
      height={height}
      width={height}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Najaح"
      className={className}
    >
      {/* ح curl (centered) */}
      <path
        d="M14 28 Q14 16 28 16 Q48 16 54 32 Q58 52 36 56 Q20 58 12 48"
        stroke={ink}
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Cap on top */}
      <CapGroup x={20} y={2} ink={ink} accent={accent} scale={1.2} />
    </svg>
  );
}

/* ============================================================
   Reusable cap-with-tassel — used by both wordmark + mark.
   ============================================================ */
function CapGroup({
  x,
  y,
  ink,
  accent,
  scale = 1,
}: {
  x: number;
  y: number;
  ink: string;
  accent: string;
  scale?: number;
}) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Mortarboard (top diamond) */}
      <path d="M0 12 L18 4 L36 12 L18 20 Z" fill={ink} />
      {/* Cap base */}
      <path
        d="M8 14 L18 20 L28 14 L28 22 Q28 25 24 26 L12 26 Q8 25 8 22 Z"
        fill={ink}
      />
      {/* Button on top */}
      <circle cx="18" cy="6" r="1.6" fill={accent} />
      {/* Tassel cord */}
      <path
        d="M30 14 Q35 17 36 26"
        stroke={accent}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Tassel knob */}
      <circle cx="36" cy="28" r="2.6" fill={accent} />
      {/* Tassel strands */}
      <path
        d="M34 30.5 L33 35 M36 30.5 L36 36 M38 30.5 L39 35"
        stroke={accent}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
}
