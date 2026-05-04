/**
 * Najaح logo — uses the official brand asset from /public/.
 *
 * Variants:
 *   <Logo />                          full wordmark "Najaح" + cap (default, nav/footer)
 *   <Logo variant="mark" />           navy app icon (rounded square, navy bg)
 *   <Logo variant="mark" mono="white" /> white app icon (rounded square, white bg)
 *
 * Sizing:
 *   <Logo height={32} />              explicit pixel height; width auto-scales
 *
 * The image files were cropped from the brand kit /public/logo.png by
 * scripts/crop-logo.py — re-run that script if the brand kit changes.
 */
import Image from "next/image";

// Source image dimensions, used to compute the correct width:height ratio
// so next/image can avoid layout shift while loading.
const ASSETS = {
  wordmark: { src: "/logo-wordmark.png", w: 653, h: 320 },
  navy: { src: "/logo-mark-navy.png", w: 165, h: 195 },
  white: { src: "/logo-mark-white.png", w: 185, h: 195 },
} as const;

type LogoProps = {
  height?: number;
  variant?: "wordmark" | "mark";
  /** For variant="mark", choose the navy or white icon. Default: navy. */
  mono?: "navy" | "white";
  className?: string;
  priority?: boolean;
};

export function Logo({
  height = 32,
  variant = "wordmark",
  mono = "navy",
  className,
  priority = false,
}: LogoProps) {
  const asset =
    variant === "mark" ? (mono === "white" ? ASSETS.white : ASSETS.navy) : ASSETS.wordmark;

  const width = Math.round(height * (asset.w / asset.h));

  return (
    <Image
      src={asset.src}
      alt="Najaح"
      height={height}
      width={width}
      priority={priority}
      className={className}
      // Disable Next.js image optimization for tiny brand assets — keep them crisp,
      // avoid the optimizer adding latency for files that are already small.
      unoptimized
    />
  );
}
