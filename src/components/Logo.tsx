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

// Wordmark aspect ratio (365 × 150 px source file)
const WM_RATIO = 365 / 150;

type LogoProps = {
  height?: number;
  variant?: "wordmark" | "mark" | "combined";
  className?: string;
  priority?: boolean;
};

export function Logo({ height = 36, variant = "wordmark", className = "" }: LogoProps) {
  if (variant === "combined") {
    const iconH = height;
    const wmH = Math.round(height * 0.88);
    return (
      <span className={`inline-flex items-center gap-2 ${className}`}>
        {/* Icon — inlined base64, never fails to load */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LOGO_ICON_B64}
          alt=""
          aria-hidden="true"
          className="dark:invert flex-shrink-0 object-contain"
          style={{ height: iconH, width: iconH }}
        />
        {/* Wordmark */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-wordmark.png"
          alt="Najaح"
          className="dark:invert flex-shrink-0 object-contain"
          style={{ height: wmH, width: Math.round(wmH * WM_RATIO) }}
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
