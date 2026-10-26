"""Run from the repo root: python optimize_images.py   (needs: pip install pillow)
- assets/img/image3.jpg -> real JPEG, max 840px wide (original kept as image3.orig.png)
- assets/img/1.jpg, 2.jpg -> 1.webp, 2.webp (JPEGs stay as fallback)
"""
from pathlib import Path
from PIL import Image

img = Path("assets/img")

p = img / "image3.jpg"
backup = img / "image3.orig.png"
if p.exists():
    if not backup.exists():
        p.rename(backup)
        src = backup
    else:
        src = backup
    im = Image.open(src).convert("RGB")
    if im.width > 840:
        im = im.resize((840, round(im.height * 840 / im.width)), Image.LANCZOS)
    im.save(p, "JPEG", quality=82, optimize=True, progressive=True)
    print("portrait:", p.stat().st_size // 1024, "KB", im.size)

for n in ("1", "2"):
    src = img / f"{n}.jpg"
    if src.exists():
        im = Image.open(src).convert("RGB")
        if im.width > 1400:
            im = im.resize((1400, round(im.height * 1400 / im.width)), Image.LANCZOS)
        out = img / f"{n}.webp"
        im.save(out, "WEBP", quality=80, method=6)
        print(out.name, out.stat().st_size // 1024, "KB")