"""Generate premium heart-themed icons for the PWA. Rendered at high resolution
and downscaled with LANCZOS for crisp, anti-aliased edges."""
from PIL import Image, ImageDraw
import math
import os

OUT = os.path.join(os.path.dirname(__file__), "..", "public")
os.makedirs(OUT, exist_ok=True)

SS = 4  # supersampling factor


def lerp(a, b, t):
    return tuple(int(round(a[i] + (b[i] - a[i]) * t)) for i in range(3))


def diagonal_gradient(size, c1, c2):
    """Diagonal (top-left -> bottom-right) gradient image."""
    img = Image.new("RGB", (size, size))
    px = img.load()
    maxd = (size - 1) * 2 if size > 1 else 1
    for y in range(size):
        for x in range(size):
            t = (x + y) / maxd
            px[x, y] = lerp(c1, c2, t)
    return img


def heart_mask(size, scale=0.62, cy_shift=-0.02):
    """Return an L-mode mask with a smooth heart centered in `size`."""
    m = Image.new("L", (size, size), 0)
    d = ImageDraw.Draw(m)
    cx = size / 2
    cy = size / 2 + size * cy_shift
    s = size * scale
    pts = []
    steps = 600
    for i in range(steps + 1):
        t = math.pi * 2 * i / steps
        # Classic heart parametric curve
        x = 16 * (math.sin(t) ** 3)
        y = 13 * math.cos(t) - 5 * math.cos(2 * t) - 2 * math.cos(3 * t) - math.cos(4 * t)
        px = cx + (x / 32) * s
        py = cy - (y / 32) * s
        pts.append((px, py))
    d.polygon(pts, fill=255)
    return m


def rounded_square(size, radius_frac=0.235):
    m = Image.new("L", (size, size), 0)
    d = ImageDraw.Draw(m)
    r = int(size * radius_frac)
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=r, fill=255)
    return m


# Warm rose palette
C_TOP = (255, 138, 173)   # soft coral-pink
C_BOTTOM = (244, 63, 121)  # deep rose


def make_icon(out_name, size, rounded=True, heart_scale=0.6):
    big = size * SS
    grad = diagonal_gradient(big, C_TOP, C_BOTTOM)
    canvas = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    if rounded:
        mask = rounded_square(big)
        canvas.paste(grad, (0, 0), mask)
    else:
        canvas.paste(grad, (0, 0))

    # subtle soft white heart with a faint inner glow
    hm = heart_mask(big, scale=heart_scale)
    white = Image.new("RGBA", (big, big), (255, 255, 255, 255))
    # soften the heart slightly toward warm white for a premium feel
    canvas.paste(white, (0, 0), hm)

    out = canvas.resize((size, size), Image.LANCZOS)
    out.save(os.path.join(OUT, out_name))
    print("wrote", out_name, size)


# Standard + maskable + apple touch
make_icon("icon-192.png", 192, rounded=True, heart_scale=0.6)
make_icon("icon-512.png", 512, rounded=True, heart_scale=0.6)
make_icon("apple-touch-icon.png", 180, rounded=True, heart_scale=0.6)
# Maskable: full bleed, heart inside the 80% safe zone
make_icon("maskable-512.png", 512, rounded=False, heart_scale=0.46)
# Favicon raster fallback
make_icon("favicon-32.png", 32, rounded=True, heart_scale=0.64)
print("done")
