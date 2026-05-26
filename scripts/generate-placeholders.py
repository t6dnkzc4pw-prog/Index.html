"""Generate warm dark JPG placeholders so the site renders before the real
photography is dropped into public/images/. Replace each file with the
matching attachment once available."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import math
import random

OUT = Path(__file__).resolve().parent.parent / "public" / "images"
OUT.mkdir(parents=True, exist_ok=True)
(OUT / "scenes").mkdir(parents=True, exist_ok=True)


def warm_gradient(size, top, bottom, accents=None):
    w, h = size
    img = Image.new("RGB", (w, h), top)
    px = img.load()
    for y in range(h):
        t = y / max(h - 1, 1)
        r = int(top[0] * (1 - t) + bottom[0] * t)
        g = int(top[1] * (1 - t) + bottom[1] * t)
        b = int(top[2] * (1 - t) + bottom[2] * t)
        for x in range(w):
            # subtle horizontal vignette
            dx = (x - w / 2) / (w / 2)
            falloff = 1 - 0.18 * (dx * dx)
            px[x, y] = (int(r * falloff), int(g * falloff), int(b * falloff))

    if accents:
        overlay = Image.new("RGB", (w, h), (0, 0, 0))
        draw = ImageDraw.Draw(overlay)
        rnd = random.Random(42)
        for (cx_rel, cy_rel, radius_rel, color, alpha) in accents:
            cx = int(w * cx_rel)
            cy = int(h * cy_rel)
            radius = int(min(w, h) * radius_rel)
            for r in range(radius, 0, -2):
                a = alpha * (1 - r / radius) ** 2
                fill = tuple(int(c * a) for c in color)
                draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=fill)
        overlay = overlay.filter(ImageFilter.GaussianBlur(radius=40))
        img = Image.blend(img, Image.eval(overlay, lambda v: v), 0.55)

    # grain
    grain = Image.new("L", (w, h))
    gpx = grain.load()
    rnd = random.Random(7)
    for y in range(h):
        for x in range(w):
            gpx[x, y] = rnd.randint(0, 16)
    img = Image.merge("RGB", tuple(
        Image.eval(c, lambda v: min(255, v + 0)) for c in img.split()
    ))
    img = Image.blend(img, Image.merge("RGB", (grain, grain, grain)), 0.04)

    return img


def save(img, path, quality=82):
    img.save(path, "JPEG", quality=quality, optimize=True, progressive=True)
    print("wrote", path)


def hero():
    img = warm_gradient(
        (1920, 1200),
        top=(20, 26, 36),
        bottom=(10, 8, 10),
        accents=[
            (0.5, 0.55, 0.55, (200, 153, 104), 1.0),
            (0.2, 0.3, 0.4, (138, 112, 80), 0.6),
            (0.8, 0.7, 0.45, (90, 70, 50), 0.5),
        ],
    )
    save(img, OUT / "hero.jpg", quality=85)


def scene(name, palette):
    top, bottom, accent = palette
    img = warm_gradient(
        (1200, 1500),
        top=top,
        bottom=bottom,
        accents=[
            (0.5, 0.55, 0.55, accent, 1.0),
            (0.3, 0.3, 0.35, accent, 0.5),
        ],
    )
    save(img, OUT / "scenes" / f"{name}.jpg", quality=80)


def product_grid():
    img = warm_gradient(
        (1600, 1200),
        top=(28, 22, 16),
        bottom=(12, 10, 8),
        accents=[(0.5, 0.5, 0.7, (200, 153, 104), 0.9)],
    )
    save(img, OUT / "product-grid.jpg", quality=80)


def og():
    img = warm_gradient(
        (1200, 630),
        top=(18, 14, 12),
        bottom=(6, 6, 6),
        accents=[(0.5, 0.55, 0.5, (200, 153, 104), 1.0)],
    )
    save(img, OUT / "og.jpg", quality=85)
    # also drop at root for og-image.jpg
    save(img, OUT.parent / "og-image.jpg", quality=85)


if __name__ == "__main__":
    hero()
    scene("yacht", ((26, 32, 42), (8, 10, 14), (200, 153, 104)))
    scene("villa", ((22, 28, 22), (8, 10, 8), (160, 140, 90)))
    scene("suite", ((38, 22, 16), (10, 8, 8), (200, 153, 104)))
    scene("jet", ((22, 18, 16), (6, 6, 8), (180, 140, 95)))
    product_grid()
    og()
