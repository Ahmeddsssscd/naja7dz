/**
 * Najaح logo — uses official brand assets from /public/.
 *
 * Variants:
 *   <Logo />                          Wordmark (auto-swaps light/dark image)
 *   <Logo variant="mark" />           Just the navy app icon
 *   <Logo variant="mark" mono="white" />  White app icon (for use on dark bg)
 *   <Logo variant="combined" />       Icon + wordmark side by side
 *
 * Theme awareness: rendered as two <Image> tags — one shown in light mode,
 * one in dark mode — toggled via Tailwind `dark:` utility classes. No
 * client-side JS needed; works during SSR.
 *
 * Sizing:
 *   <Logo height={48} priority />     Sets height; width auto-scales by ratio.
 *
 * Source assets are produced by scripts/crop-logo.py from public/logo.png.
 */
import Image from "next/image";

const ASSETS = {
  // Wordmark — paired light/dark
  wordmarkLight: { src: "/logo-wordmark.png", w: 653, h: 320 },
  wordmarkDark: { src: "/logo-wordmark-dark.png", w: 653, h: 320 },

  // Mark — paired navy/white
  markNavy: { src: "/logo-mark-navy.png", w: 165, h: 195 },
  markWhite: { src: "/logo-mark-white.png", w: 185, h: 195 },
} as const;

type LogoProps = {
  height?: number;
  variant?: "wordmark" | "mark" | "combined";
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
    // Icon + wordmark together. Icon is square, sits at the start.
    return (
      <span className={`inline-flex items-center gap-3 ${className ?? ""}`}>
        <ThemedMark height={height} priority={priority} />
        <ThemedWordmark height={Math.round(height * 0.85)} priority={priority} />
      </span>
    );
  }

  if (variant === "mark") {
    // If user explicitly chose navy or white, render that single asset.
    if (mono) {
      const asset = mono === "white" ? ASSETS.markWhite : ASSETS.markNavy;
      const width = Math.round(height * (asset.w / asset.h));
      return (
        <Image
          src={asset.src}
          alt="Najaح"
          height={height}
          width={width}
          priority={priority}
          className={className}
          unoptimized
        />
      );
    }
    // Otherwise auto-swap: navy in light mode, white in dark mode.
    return <ThemedMark height={height} priority={priority} className={className} />;
  }

  // wordmark (default)
  return <ThemedWordmark height={height} priority={priority} className={className} />;
}

/* =================== Theme-aware pairs =================== */

function ThemedWordmark({
  height,
  priority,
  className,
}: {
  height: number;
  priority: boolean;
  className?: string;
}) {
  const lightW = Math.round(height * (ASSETS.wordmarkLight.w / ASSETS.wordmarkLight.h));
  const darkW = Math.round(height * (ASSETS.wordmarkDark.w / ASSETS.wordmarkDark.h));
  return (
    <span className={`inline-flex ${className ?? ""}`}>
      <Image
        src={ASSETS.wordmarkLight.src}
        alt="Najaح"
        height={height}
        width={lightW}
        priority={priority}
        unoptimized
        className="dark:hidden"
      />
      <Image
        src={ASSETS.wordmarkDark.src}
        alt="Najaح"
        height={height}
        width={darkW}
        priority={priority}
        unoptimized
        className="hidden dark:block"
      />
    </span>
  );
}

function ThemedMark({
  height,
  priority,
  className,
}: {
  height: number;
  priority: boolean;
  className?: string;
}) {
  const navyW = Math.round(height * (ASSETS.markNavy.w / ASSETS.markNavy.h));
  const whiteW = Math.round(height * (ASSETS.markWhite.w / ASSETS.markWhite.h));
  return (
    <span className={`inline-flex ${className ?? ""}`}>
      <Image
        src={ASSETS.markNavy.src}
        alt="Najaح"
        height={height}
        width={navyW}
        priority={priority}
        unoptimized
        className="dark:hidden"
      />
      <Image
        src={ASSETS.markWhite.src}
        alt="Najaح"
        height={height}
        width={whiteW}
        priority={priority}
        unoptimized
        className="hidden dark:block"
      />
    </span>
  );
}
