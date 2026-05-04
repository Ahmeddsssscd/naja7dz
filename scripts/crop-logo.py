"""
crop-logo.py
Slices the brand-kit composite (public/logo.png) into clean separate assets:

  public/logo-wordmark.png         Wordmark, navy on transparent (light mode)
  public/logo-wordmark-dark.png    Wordmark, cream on transparent (dark mode)
  public/logo-mark-navy.png        Navy app icon (navy bg + white mark)
  public/logo-mark-white.png       White app icon (white bg + navy mark)

Re-run any time public/logo.png is updated:
  python scripts/crop-logo.py
"""

from pathlib import Path
from PIL import Image, ImageChops


PUBLIC = Path(__file__).resolve().parent.parent / "public"
SOURCE = PUBLIC / "logo.png"

# Brand colors used in the wordmark
NAVY = (15, 27, 51)         # #0F1B33
CREAM = (250, 249, 246)     # #FAF9F6
GOLD_R_LO = 180             # rough "gold" detection thresholds
WHITE_THRESHOLD = 235       # pixels lighter than this are treated as background


def trim_white(im: Image.Image, tolerance=10) -> Image.Image:
    """Tight-crop to the non-white content of an RGB image."""
    if im.mode != "RGB":
        im = im.convert("RGB")
    bg_im = Image.new(im.mode, im.size, (255, 255, 255))
    diff = ImageChops.difference(im, bg_im)
    diff = ImageChops.add(diff, diff, 2.0, -tolerance)
    bbox = diff.getbbox()
    return im.crop(bbox) if bbox else im


def remove_white_background(img: Image.Image) -> Image.Image:
    """Make near-white pixels fully transparent. Keeps everything else as-is."""
    img = img.convert("RGBA")
    pixels = img.getdata()
    new_pixels = []
    for r, g, b, a in pixels:
        if r >= WHITE_THRESHOLD and g >= WHITE_THRESHOLD and b >= WHITE_THRESHOLD:
            new_pixels.append((r, g, b, 0))  # transparent
        else:
            # Smooth alpha for near-white-but-not-quite (anti-aliased edges)
            min_chan = min(r, g, b)
            if min_chan >= 200:
                # gradient between white-ish (semi-transparent) and full color
                fade = int((255 - min_chan) * 5)
                fade = max(0, min(255, fade))
                new_pixels.append((r, g, b, fade))
            else:
                new_pixels.append((r, g, b, a))
    img.putdata(new_pixels)
    return img


def is_navy(r, g, b, threshold=70) -> bool:
    """True if pixel is dark navy (the wordmark text color)."""
    return r < threshold and g < threshold and b < threshold + 30


def is_gold(r, g, b) -> bool:
    """True if pixel is gold-ish (the cap tassel)."""
    return r >= GOLD_R_LO and g >= 130 and b < 100


def make_dark_mode_version(img: Image.Image) -> Image.Image:
    """Take a wordmark with navy text + gold accent + transparent bg,
    swap navy -> cream while keeping gold. For use on dark backgrounds."""
    img = img.convert("RGBA")
    pixels = img.getdata()
    new_pixels = []
    for r, g, b, a in pixels:
        if a == 0:
            new_pixels.append((r, g, b, a))
        elif is_gold(r, g, b):
            new_pixels.append((r, g, b, a))   # keep gold
        elif is_navy(r, g, b):
            new_pixels.append((*CREAM, a))     # navy -> cream
        else:
            # Mid-tones (anti-aliased edges of navy) — interpolate toward cream
            # Brightness factor: invert dark to light, preserving alpha
            inverted = (255 - r, 255 - g, 255 - b)
            # Blend with cream to keep it warm, not pure white
            blended = (
                (inverted[0] + CREAM[0]) // 2,
                (inverted[1] + CREAM[1]) // 2,
                (inverted[2] + CREAM[2]) // 2,
            )
            new_pixels.append((*blended, a))
    img.putdata(new_pixels)
    return img


def main():
    if not SOURCE.exists():
        raise SystemExit(f"Source not found: {SOURCE}")

    src = Image.open(SOURCE)
    w, h = src.size
    print(f"Source: {SOURCE.name} ({w}x{h})")

    # ===== Wordmark (top half, transparent) =====
    wordmark_rgb = trim_white(src.crop((0, 0, w, 320)))
    wordmark_light = remove_white_background(wordmark_rgb)
    wordmark_light.save(PUBLIC / "logo-wordmark.png", optimize=True)
    print(f"  -> logo-wordmark.png {wordmark_light.size}  [navy on transparent]")

    # ===== Wordmark dark-mode version (cream text on transparent) =====
    wordmark_dark = make_dark_mode_version(wordmark_light)
    wordmark_dark.save(PUBLIC / "logo-wordmark-dark.png", optimize=True)
    print(f"  -> logo-wordmark-dark.png {wordmark_dark.size}  [cream on transparent]")

    # ===== Bottom row: 3 elements at y ~ 360-555 =====
    # Small wordmark — left third
    small_wm_rgb = trim_white(src.crop((20, 360, 230, 555)))
    small_wm = remove_white_background(small_wm_rgb)
    small_wm.save(PUBLIC / "logo-wordmark-small.png", optimize=True)
    print(f"  -> logo-wordmark-small.png {small_wm.size}")

    # Navy app icon — keep navy background as designed
    navy_icon = src.crop((245, 360, 410, 555))
    navy_icon.save(PUBLIC / "logo-mark-navy.png", optimize=True)
    print(f"  -> logo-mark-navy.png {navy_icon.size}  [navy bg + white mark]")

    # White app icon — keep white "card" look but trim outer whitespace
    white_icon = src.crop((420, 360, 605, 555))
    white_icon.save(PUBLIC / "logo-mark-white.png", optimize=True)
    print(f"  -> logo-mark-white.png {white_icon.size}  [white bg + navy mark]")

    print("\nDone.")


if __name__ == "__main__":
    main()
