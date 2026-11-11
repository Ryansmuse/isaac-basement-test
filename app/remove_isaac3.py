"""Erase baked-in Isaac via diffusion inpainting + borrowed grain (final method)."""
import os, shutil
import numpy as np
from PIL import Image, ImageFilter

GAME = os.path.expanduser('~/workspace/isaac-app/public/game')
BACKUP = os.path.expanduser('~/workspace/isaac-app/floors-with-isaac')
WINDOWS = {
    'floor-flooded-caves.webp': (724, 370, 875, 640),
}
DEFAULT = (730, 377, 869, 533)

def inpaint(img, x0, y0, x1, y1):
    """Solve Laplace diffusion inside the window, pinned to a frame of real pixels."""
    m = 26  # frame margin of genuine pixels around the hole
    rx0, ry0, rx1, ry1 = x0 - m, y0 - m, x1 + m, y1 + m
    region = np.asarray(img.crop((rx0, ry0, rx1, ry1))).astype(np.float32)
    H, W, _ = region.shape
    hole = np.zeros((H, W), bool)
    hole[m:-m, m:-m] = True
    work = region.copy()
    # init hole with the mean of its border ring
    border = np.concatenate([region[m, m:-m].reshape(-1, 3), region[-m - 1, m:-m].reshape(-1, 3),
                             region[m:-m, m].reshape(-1, 3), region[m:-m, -m - 1].reshape(-1, 3)])
    work[hole] = border.mean(axis=0)
    inner = (slice(1, -1), slice(1, -1))
    for _ in range(600):
        avg = (work[:-2, 1:-1] + work[2:, 1:-1] + work[1:-1, :-2] + work[1:-1, 2:]) * 0.25
        cur = work[inner]
        upd = hole[inner]
        cur[upd] = avg[upd]
        work[inner] = cur
    filled = Image.fromarray(np.clip(work, 0, 255).astype(np.uint8))
    # borrow high-frequency grain from a clean rect to the left so the fill isn't glassy
    bw, bh = x1 - x0, y1 - y0
    clone = img.crop((x0 - 330, y0, x0 - 330 + bw, y0 + bh))
    grain = np.asarray(clone).astype(np.float32) - np.asarray(clone.filter(ImageFilter.GaussianBlur(6))).astype(np.float32)
    base = np.asarray(filled.crop((m, m, m + bw, m + bh))).astype(np.float32)
    base = np.clip(base + grain * 0.8, 0, 255).astype(np.uint8)
    filled.paste(Image.fromarray(base), (m, m))
    # feather-paste the repaired region back
    mask = Image.new('L', (rx1 - rx0, ry1 - ry0), 0)
    mask.paste(255, (m - 8, m - 8, rx1 - rx0 - m + 8, ry1 - ry0 - m + 8))
    mask = mask.filter(ImageFilter.GaussianBlur(8))
    img.paste(filled, (rx0, ry0), mask)
    return img

for name in sorted(os.listdir(BACKUP)):
    if not name.startswith('floor-'):
        continue
    dst = os.path.join(GAME, name)
    shutil.copy(os.path.join(BACKUP, name), dst)  # pristine start
    img = Image.open(dst).convert('RGB')
    x0, y0, x1, y1 = WINDOWS.get(name, DEFAULT)
    img = inpaint(img, x0, y0, x1, y1)
    img.save(dst, 'WEBP', quality=82)
    print(f'{name}: inpainted')
