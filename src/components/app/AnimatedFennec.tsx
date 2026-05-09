"use client";

/**
 * AnimatedFennec — small CSS-only animated fennec mascot.
 *
 * No new assets — pure inline SVG with keyframe animations: gentle bob,
 * tail wag, occasional blink. Designed to drop in anywhere the static
 * 🦊 emoji used to be (e.g. /petits hero). Sized via the parent's font-
 * size by default; pass `size` prop to override (in px).
 *
 * Why CSS-only: we don't want to drag framer-motion into bundles for
 * every kid page (they're already heavy with confetti). Pure CSS keeps
 * the cost at <2 kB.
 */
interface Props {
  /** Pixel size; defaults to 96. */
  size?: number;
  /** Disable animation (e.g. when prefers-reduced-motion). */
  static?: boolean;
}

export function AnimatedFennec({ size = 96, static: isStatic = false }: Props) {
  const cls = isStatic ? "fennec-static" : "fennec-bob";
  return (
    <>
      <svg viewBox="0 0 100 100" width={size} height={size} className={cls} aria-hidden>
        {/* Tail — wags */}
        <g className={isStatic ? "" : "fennec-tail"} style={{ transformOrigin: "30px 70px" }}>
          <path d="M30 70 Q15 50 8 65 Q15 78 30 75 Z" fill="#F59E0B" stroke="#0F1B33" strokeWidth="2" />
          <path d="M12 60 L8 55" stroke="#fff" strokeWidth="2" />
        </g>
        {/* Body */}
        <ellipse cx="55" cy="68" rx="22" ry="18" fill="#F59E0B" stroke="#0F1B33" strokeWidth="2" />
        <ellipse cx="55" cy="72" rx="14" ry="10" fill="#FEF3C7" />
        {/* Legs */}
        <rect x="44" y="80" width="5" height="10" fill="#F59E0B" stroke="#0F1B33" strokeWidth="1.5" />
        <rect x="62" y="80" width="5" height="10" fill="#F59E0B" stroke="#0F1B33" strokeWidth="1.5" />
        {/* Head */}
        <ellipse cx="60" cy="42" rx="22" ry="20" fill="#F59E0B" stroke="#0F1B33" strokeWidth="2" />
        {/* Inner face mark */}
        <path d="M50 38 Q60 55 70 38 Q70 50 60 56 Q50 50 50 38 Z" fill="#FEF3C7" />
        {/* Ears — large fennec ears */}
        <path d="M42 28 L36 8 L52 22 Z" fill="#F59E0B" stroke="#0F1B33" strokeWidth="2" />
        <path d="M40 24 L38 14 L48 22 Z" fill="#FEF3C7" />
        <path d="M78 28 L84 8 L68 22 Z" fill="#F59E0B" stroke="#0F1B33" strokeWidth="2" />
        <path d="M80 24 L82 14 L72 22 Z" fill="#FEF3C7" />
        {/* Eyes — blink animated */}
        <g className={isStatic ? "" : "fennec-eyes"}>
          <circle cx="52" cy="42" r="3" fill="#0F1B33" />
          <circle cx="68" cy="42" r="3" fill="#0F1B33" />
          <circle cx="53" cy="41" r="1" fill="#fff" />
          <circle cx="69" cy="41" r="1" fill="#fff" />
        </g>
        {/* Nose */}
        <ellipse cx="60" cy="50" rx="2.5" ry="2" fill="#0F1B33" />
        {/* Mouth */}
        <path d="M55 54 Q60 58 65 54" fill="none" stroke="#0F1B33" strokeWidth="1.5" strokeLinecap="round" />
        {/* Cheeks */}
        <circle cx="46" cy="50" r="2.5" fill="#FCA5A5" opacity="0.6" />
        <circle cx="74" cy="50" r="2.5" fill="#FCA5A5" opacity="0.6" />
      </svg>

      {/* Inline styles so the component is self-contained — no global CSS edits */}
      <style jsx>{`
        .fennec-bob {
          animation: fennec-bob 4s ease-in-out infinite;
        }
        @keyframes fennec-bob {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-4px); }
        }
        :global(.fennec-tail) {
          animation: fennec-tail 1.6s ease-in-out infinite;
        }
        @keyframes fennec-tail {
          0%, 100% { transform: rotate(-5deg); }
          50%      { transform: rotate(8deg); }
        }
        :global(.fennec-eyes) {
          animation: fennec-blink 5s linear infinite;
          transform-origin: 60px 42px;
        }
        @keyframes fennec-blink {
          0%, 90%, 100% { transform: scaleY(1); }
          93%, 96%      { transform: scaleY(0.1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .fennec-bob, :global(.fennec-tail), :global(.fennec-eyes) {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}
