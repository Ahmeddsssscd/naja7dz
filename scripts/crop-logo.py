"""
crop-logo.py
Slices the brand-kit composite (public/logo.png) into clean separate assets:

  public/logo-wordmark.png         Wordmark, navy + gold on transparent (light mode)
  public/logo-wordmark-dark.png    Wordmark, cream + gold on transparent (dark mode)
  public/logo-mark-navy.png        Navy app icon (intact)
  public/logo-mark-white.png       White app icon (intact)

The wordmark uses PROPER ALPHA MATTING so anti-aliased edges blend cleanly
on any background — no white halo on dark mode.

Re-run any time public/logo.png is updated:
  python scripts/crop-logo.py
"""

from pathlib import Path
from PIL import Image, ImageChops


PUBLIC = Path(__file__).resolve().parent.parent / "public"
SOURCE = PUBLIC / "logo.png"

NAVY = (15, 27, 51)
CREAM = (250, 249, 246)
GOLD = (212, 167, 44)


def trim_white(im: Image.Image, tolerance: int = 10) -> Image.Image:
    """Tight-crop to the non-white content of an RGB image."""
    if im.mode != "RGB":
        im = im.convert("RGB")
    bg_im = Image.new(im.mode, im.size, (255, 255, 255))
    diff = ImageChops.difference(im, bg_im)
    diff = ImageChops.add(diff, diff, 2.0, -tolerance)
    bbox = diff.getbbox()
    return im.crop(bbox) if bbox else im


def is_gold_pixel(r: int, g: int, b: int) -> bool:
    """True if pixel is gold-leaning (yellow/orange-ish)."""
    return r > 130 and g > 90 and b < 130 and r > b + 30


def alpha_extract(img: Image.Image, mode: str) -> Image.Image:
    """
    Convert a logo on white background into a clean transparent PNG using
    PROPER ALPHA MATTING.

    For each pixel:
      - Detect whether it was originally navy or gold
      - Set the output color to a fixed brand color (navy or gold)
      - Set alpha based on how non-white the original pixel was
    Result: anti-aliased edges blend cleanly on any background.

    mode = "light"  → navy text + gold accent
    mode = "dark"   → cream text + gold accent
    """
    img = img.convert("RGBA")
    src = list(img.getdata())
    out = []

    text_color = NAVY if mode == "light" else CREAM

    for r, g, b, a in src:
        # Distance from white = how non-white this pixel is = how opaque
        d = max(255 - r, 255 - g, 255 - b)

        if d < 8:
            # Pure white or near-white → fully transparent
            out.append((0, 0, 0, 0))
            continue

        # Pick the brand color (gold for the tassel, text for everything else)
        target = GOLD if is_gold_pixel(r, g, b) else text_color

        # Final alpha. Boost lightly for crispness — non-linear curve helps.
        # Pixels at 95%+ darkness should be fully opaque.
        if d >= 220:
            alpha = 255
        else:
            # Smooth ramp: alpha grows quadratically with distance from white
            alpha = int((d / 255) * 255)
            # Soft floor so very faint pixels don't disappear
            if 8 <= d < 32:
                alpha = max(alpha, 24)

        out.append((target[0], target[1], target[2], alpha))

    img.putdata(out)
    return img


def main():
    if not SOURCE.exists():
        raise SystemExit(f"Source not found: {SOURCE}")

    src = Image.open(SOURCE)
    w, h = src.size
    print(f"Source: {SOURCE.name} ({w}x{h})")

    # ===== Wordmark — light mode (navy on transparent) =====
    wordmark_rgb = trim_white(src.crop((0, 0, w, 320)))
    wordmark_light = alpha_extract(wordmark_rgb, mode="light")
    wordmark_light.save(PUBLIC / "logo-wordmark.png", optimize=True)
    print(f"  -> logo-wordmark.png {wordmark_light.size}  [navy on transparent, alpha-matted]")

    # ===== Wordmark — dark mode (cream on transparent) =====
    wordmark_dark = alpha_extract(wordmark_rgb, mode="dark")
    wordmark_dark.save(PUBLIC / "logo-wordmark-dark.png", optimize=True)
    print(f"  -> logo-wordmark-dark.png {wordmark_dark.size}  [cream on transparent, alpha-matted]")

    # ===== Bottom row: 3 elements at y ~ 360-555 =====
    small_wm_rgb = trim_white(src.crop((20, 360, 230, 555)))
    small_wm = alpha_extract(small_wm_rgb, mode="light")
    small_wm.save(PUBLIC / "logo-wordmark-small.png", optimize=True)
    print(f"  -> logo-wordmark-small.png {small_wm.size}")

    # Navy + white app icons keep their backgrounds (they ARE rounded squares with bg)
    navy_icon = src.crop((245, 360, 410, 555))
    navy_icon.save(PUBLIC / "logo-mark-navy.png", optimize=True)
    print(f"  -> logo-mark-navy.png {navy_icon.size}")

    white_icon = src.crop((420, 360, 605, 555))
    white_icon.save(PUBLIC / "logo-mark-white.png", optimize=True)
    print(f"  -> logo-mark-white.png {white_icon.size}")

    print("\nDone.")


if __name__ == "__main__":
    main()
