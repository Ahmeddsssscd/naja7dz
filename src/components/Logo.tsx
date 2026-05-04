/**
 * Najaح wordmark — Latin "Naja" + Arabic ح + graduation cap with gold tassel.
 * This is a CSS/SVG render. When the user provides the official SVG file,
 * swap this component to render that file instead.
 */
export function Logo({ size = 26 }: { size?: number }) {
  const fontSize = size;
  const haSize = size * 1.15;
  return (
    <span
      className="inline-flex items-center gap-1 font-bold text-navy tracking-tight"
      style={{ fontSize }}
      aria-label="Najaح"
    >
      <span>Naja</span>
      <span
        className="relative font-arabic font-bold -ms-0.5"
        style={{ fontSize: haSize }}
      >
        ح
        <svg
          className="absolute -top-2.5 -end-0.5 w-4 h-4 text-navy"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M2 8L12 3L22 8L12 13L2 8Z" fill="currentColor" />
          <path
            d="M6 10V14C6 14 8 16 12 16C16 16 18 14 18 14V10"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
          <line x1="20" y1="9" x2="20" y2="14" stroke="#D4A72C" strokeWidth="1.5" />
          <circle cx="20" cy="15" r="1.2" fill="#D4A72C" />
        </svg>
      </span>
    </span>
  );
}
