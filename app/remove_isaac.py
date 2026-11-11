"""Clone-stamp the baked-in Isaac out of every floor room backdrop."""
import glob, os
from PIL import Image, ImageFilter

SRC_DIR = os.path.expanduser('~/workspace/isaac-app/public/game')

def find_isaac(img):
    """Locate pale-skin pixels in the center search region; return bbox."""
    w, h = img.size
    px = img.convert('RGB').load()
    xs, ys = [], []
    for y in range(int(h * 0.30), int(h * 0.62)):
        for x in range(int(w * 0.36), int(w * 0.64)):
            r, g, b = px[x, y]
            if r > 200 and g > 155 and b > 140 and (r - b) > 22 and (r - g) > 18:
                xs.append(x); ys.append(y)
    if len(xs) < 200:
        return None
    return min(xs), min(ys), max(xs), max(ys)

for path in sorted(glob.glob(os.path.join(SRC_DIR, 'floor-*.webp'))):
    img = Image.open(path).convert('RGB')
    w, h = img.size
    box = find_isaac(img)
    if box is None:
        print(f'{os.path.basename(path)}: NO ISAAC FOUND — skipped')
        continue
    x0, y0, x1, y1 = box
    # expand: outline + body + the soft shadow under his feet
    x0 = max(8, x0 - 26); x1 = min(w - 8, x1 + 26)
    y0 = max(8, y0 - 16); y1 = min(h - 8, y1 + 34)
    bw, bh = x1 - x0, y1 - y0
    # clone source: same size rect, same rows, shifted left (or right if no room)
    sx = x0 - 330
    if sx < int(w * 0.08):
        sx = x1 + 60
    patch = img.crop((sx, y0, sx + bw, y0 + bh))
    mask = Image.new('L', (bw, bh), 255)
    mask = mask.filter(ImageFilter.GaussianBlur(10))
    # hard core, feathered rim: rebuild mask so interior stays 255
    core = Image.new('L', (bw, bh), 255)
    rim = Image.new('L', (bw, bh), 0)
    rim.paste(255, (12, 12, bw - 12, bh - 12))
    rim = rim.filter(ImageFilter.GaussianBlur(10))
    img.paste(patch, (x0, y0), rim)
    img.save(path, 'WEBP', quality=82)
    print(f'{os.path.basename(path)}: isaac bbox=({x0},{y0})-({x1},{y1}) clone_from_x={sx}')
