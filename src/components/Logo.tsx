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
    // Icon canvas is square and fills ~90% of its box.
    // Wordmark canvas is wider and its text fills ~65% of its box height.
    // So we make the wordmark taller to compensate, then bottom-align both
    // so their visual baselines sit on the same line.
    const iconH = height;
    const wmH = Math.round(height * 1.3);
    return (
      <span className={`inline-flex items-end gap-2 ${className}`}>
        {/* Icon — inlined base64, never fails to load */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LOGO_ICON_B64}
          alt=""
          aria-hidden="true"
          className="dark:invert flex-shrink-0"
          style={{ height: iconH, width: iconH, display: "block" }}
        />
        {/* Wordmark */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-wordmark.png"
          alt="Najaح"
          className="dark:invert flex-shrink-0"
          style={{ height: wmH, width: Math.round(wmH * WM_RATIO), display: "block" }}
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
