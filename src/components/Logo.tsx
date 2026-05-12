/**
 * Najaح logo — uses transparent PNG brand assets from /public/.
 *
 * Variants:
 *   <Logo />                          Wordmark only
 *   <Logo variant="mark" />           Icon only
 *   <Logo variant="combined" />       Icon + wordmark side by side
 *
 * Dark mode: `dark:invert` flips navy (#0A1723) → cream, matching --fg.
 * No JS, no hydration, works during SSR.
 */

// Aspect ratios of the source PNGs
const WORDMARK_RATIO = 365 / 150; // width / height
const ICON_RATIO = 1;              // square

type LogoProps = {
  height?: number;
  variant?: "wordmark" | "mark" | "combined";
  className?: string;
  priority?: boolean; // kept for API compat, unused with <img>
};

export function Logo({
  height = 36,
  variant = "wordmark",
  className = "",
}: LogoProps) {
  if (variant === "combined") {
    const iconH = height;
    const wordmarkH = Math.round(height * 0.9);
    return (
      <span className={`inline-flex items-center gap-2 ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-icon.png"
          alt=""
          height={iconH}
          width={Math.round(iconH * ICON_RATIO)}
          className="dark:invert flex-shrink-0"
          style={{ height: iconH, width: Math.round(iconH * ICON_RATIO) }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-wordmark.png"
          alt="Najaح"
          height={wordmarkH}
          width={Math.round(wordmarkH * WORDMARK_RATIO)}
          className="dark:invert flex-shrink-0"
          style={{ height: wordmarkH, width: Math.round(wordmarkH * WORDMARK_RATIO) }}
        />
      </span>
    );
  }

  if (variant === "mark") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/logo-icon.png"
        alt="Najaح"
        height={height}
        width={Math.round(height * ICON_RATIO)}
        className={`dark:invert ${className}`}
        style={{ height, width: Math.round(height * ICON_RATIO) }}
      />
    );
  }

  // wordmark (default)
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo-wordmark.png"
      alt="Najaح"
      height={height}
      width={Math.round(height * WORDMARK_RATIO)}
      className={`dark:invert ${className}`}
      style={{ height, width: Math.round(height * WORDMARK_RATIO) }}
    />
  );
}
