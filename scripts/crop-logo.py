"""
crop-logo.py
Slices the brand-kit composite (public/logo.png) into clean separate assets:
  - public/logo-wordmark.png   The full "Najaح" wordmark (top of brand kit)
  - public/logo-mark-navy.png  Navy app icon (bottom middle)
  - public/logo-mark-white.png White app icon (bottom right)

Crop boxes are hand-tuned to the brand kit's known layout (653x582).
If you replace public/logo.png with a different brand kit, re-tune below.

Usage:
  python scripts/crop-logo.py
"""

from pathlib import Path
from PIL import Image, ImageChops


PUBLIC = Path(__file__).resolve().parent.parent / "public"
SOURCE = PUBLIC / "logo.png"


def trim_white(im: Image.Image, bg=(255, 255, 255), tolerance=10) -> Image.Image:
    """Tight-crop to the non-white content of an RGB image."""
    if im.mode != "RGB":
        im = im.convert("RGB")
    bg_im = Image.new(im.mode, im.size, bg)
    diff = ImageChops.difference(im, bg_im)
    diff = ImageChops.add(diff, diff, 2.0, -tolerance)
    bbox = diff.getbbox()
    return im.crop(bbox) if bbox else im


def main():
    if not SOURCE.exists():
        raise SystemExit(f"Source not found: {SOURCE}")

    src = Image.open(SOURCE)
    w, h = src.size
    print(f"Source: {SOURCE.name} ({w}x{h})")

    # ===== Brand kit layout (653x582) — tuned to the actual image =====
    # Top half: big wordmark
    wordmark = trim_white(src.crop((0, 0, w, 320)))
    wordmark.save(PUBLIC / "logo-wordmark.png")
    print(f"  -> logo-wordmark.png {wordmark.size}")

    # Bottom row: 3 elements at y ~ 365-545
    # Small wordmark — left third
    small_wm = trim_white(src.crop((20, 360, 230, 555)))
    small_wm.save(PUBLIC / "logo-wordmark-small.png")
    print(f"  -> logo-wordmark-small.png {small_wm.size}")

    # Navy app icon — middle (the rounded square has navy bg, so DO NOT trim white)
    navy_icon = src.crop((245, 360, 410, 555))
    navy_icon.save(PUBLIC / "logo-mark-navy.png")
    print(f"  -> logo-mark-navy.png {navy_icon.size}")

    # White app icon — right (white bg with subtle shadow — trim outer whitespace lightly)
    white_icon = src.crop((420, 360, 605, 555))
    white_icon.save(PUBLIC / "logo-mark-white.png")
    print(f"  -> logo-mark-white.png {white_icon.size}")

    print("\nDone. Files saved to public/.")


if __name__ == "__main__":
    main()
