/**
 * Najaح logo — icon is inlined as base64 (no loading failures),
 * wordmark is served from /public/logo-wordmark.png.
 *
 * Variants:
 *   <Logo />                   Wordmark only
 *   <Logo variant="mark" />    Icon only
 *   <Logo variant="combined" /> Icon + wordmark side by side  ← default for nav
 *
 * Dark mode: dark:invert flips navy → cream automatically.
 */
import { LOGO_ICON_B64 } from "./logo-icon-data";

// Wordmark aspect ratio (365 × 113 px — trimmed to remove bottom padding)
const WM_RATIO = 365 / 113;

type LogoProps = {
  height?: number;
  variant?: "wordmark" | "mark" | "combined";
  className?: string;
  priority?: boolean;
};

export function Logo({ height = 36, variant = "wordmark", className = "" }: LogoProps) {
  if (variant === "combined") {
    // Both images have their visual content centered at ~52% of canvas height,
    // so items-center + equal height produces perfect visual alignment.
    return (
      <span className={`inline-flex items-center gap-2 ${className}`}>
        {/* Icon — inlined base64, never fails to load */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LOGO_ICON_B64}
          alt=""
          aria-hidden="true"
          className="dark:invert flex-shrink-0"
          style={{ height, width: height, display: "block" }}
        />
        {/* Wordmark */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-wordmark.png"
          alt="Najaح"
          className="dark:invert flex-shrink-0"
          style={{ height, width: Math.round(height * WM_RATIO), display: "block" }}
        />
      </span>
    );
  }

  if (variant === "mark") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={LOGO_ICON_B64}
        alt="Najaح"
        className={`dark:invert ${className}`}
        style={{ height, width: height }}
      />
    );
  }

  // wordmark (default)
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo-wordmark.png"
      alt="Najaح"
      className={`dark:invert ${className}`}
      style={{ height, width: Math.round(height * WM_RATIO) }}
    />
  );
}
