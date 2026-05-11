/**
 * Najaح logo — uses transparent PNG brand assets from /public/.
 *
 * Variants:
 *   <Logo />                          Wordmark (auto dark-mode via CSS invert)
 *   <Logo variant="mark" />           Square icon (auto dark-mode via CSS invert)
 *   <Logo variant="mark" mono="white" />  Force white icon (for solid dark backgrounds)
 *   <Logo variant="combined" />       Icon + wordmark side by side
 *
 * Theme awareness: In dark mode, `dark:invert` flips the navy (#0F1B33) to
 * cream (#F0E4CC) which matches --fg (#F2EBDC) exactly. No separate dark-mode
 * image needed — works during SSR, no client-side JS required.
 *
 * File mapping (save these in /public/):
 *   logo-wordmark.png — full "Najaح" wordmark, transparent background
 *   logo-icon.png     — crescent+cap icon only, transparent background
 *
 * Sizing:
 *   <Logo height={48} priority />     Sets height; width auto-scales by ratio.
 */
import Image from "next/image";

// Intrinsic dimensions of the source PNGs (update if you swap the files)
const WORDMARK = { src: "/logo-wordmark.png", w: 580, h: 150 };
const ICON = { src: "/logo-icon.png", w: 200, h: 200 };

type LogoProps = {
  height?: number;
  variant?: "wordmark" | "mark" | "combined";
  /** Force a specific colour regardless of theme */
  mono?: "navy" | "white";
  className?: string;
  priority?: boolean;
};

export function Logo({
  height = 36,
  variant = "wordmark",
  mono,
  className,
  priority = false,
}: LogoProps) {
  if (variant === "combined") {
    return (
      <span className={`inline-flex items-center gap-3 ${className ?? ""}`}>
        <LogoMark height={height} mono={mono} priority={priority} />
        <LogoWordmark height={Math.round(height * 0.85)} mono={mono} priority={priority} />
      </span>
    );
  }

  if (variant === "mark") {
    return <LogoMark height={height} mono={mono} priority={priority} className={className} />;
  }

  // wordmark (default)
  return <LogoWordmark height={height} mono={mono} priority={priority} className={className} />;
}

/* =================== Internal components =================== */

function LogoWordmark({
  height,
  mono,
  priority,
  className,
}: {
  height: number;
  mono?: "navy" | "white";
  priority: boolean;
  className?: string;
}) {
  const width = Math.round(height * (WORDMARK.w / WORDMARK.h));

  // mono="white": apply invert via style so it works without Tailwind dark:
  const filterStyle =
    mono === "white" ? { filter: "brightness(0) invert(1)" } : undefined;

  // auto theme: dark:invert flips navy → cream (matches --fg in dark mode)
  const themeClass = !mono ? "dark:invert" : "";

  return (
    <Image
      src={WORDMARK.src}
      alt="Najaح"
      height={height}
      width={width}
      priority={priority}
      unoptimized
      className={`${themeClass} ${className ?? ""}`}
      style={filterStyle}
    />
  );
}

function LogoMark({
  height,
  mono,
  priority,
  className,
}: {
  height: number;
  mono?: "navy" | "white";
  priority: boolean;
  className?: string;
}) {
  const width = Math.round(height * (ICON.w / ICON.h));

  const filterStyle =
    mono === "white" ? { filter: "brightness(0) invert(1)" } : undefined;

  const themeClass = !mono ? "dark:invert" : "";

  return (
    <Image
      src={ICON.src}
      alt="Najaح"
      height={height}
      width={width}
      priority={priority}
      unoptimized
      className={`${themeClass} ${className ?? ""}`}
      style={filterStyle}
    />
  );
}
