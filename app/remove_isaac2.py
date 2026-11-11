"""Erase baked-in Isaac via gradient-matched blur fill (v2 of the patcher)."""
import os, shutil
from PIL import Image, ImageFilter

GAME = os.path.expanduser('~/workspace/isaac-app/public/game')
BACKUP = os.path.expanduser('~/workspace/isaac-app/floors-with-isaac')

WINDOWS = {  # (x0, y0, x1, y1, blur) — blur (rx, ry); flooded needs a taller window (water reflection)
    'floor-flooded-caves.webp': (724, 370, 875, 640, (26, 26)),
    'floor-chest.webp':         (730, 377, 869, 533, (36, 3)),   # horizontal blur keeps the wood plank bands
}
DEFAULT = (730, 377, 869, 533, (26, 26))

for name in sorted(os.listdir(BACKUP)):
    if not name.startswith('floor-'):
        continue
    src_path = os.path.join(BACKUP, name)
    dst_path = os.path.join(GAME, name)
    shutil.copy(src_path, dst_path)  # always start from the pristine original
    img = Image.open(dst_path).convert('RGB')
    x0, y0, x1, y1, blur = WINDOWS.get(name, DEFAULT)
    fill = img.filter(ImageFilter.GaussianBlur(blur))
    bw, bh = x1 - x0, y1 - y0
    mask = Image.new('L', (bw, bh), 0)
    mask.paste(255, (10, 10, bw - 10, bh - 10))
    mask = mask.filter(ImageFilter.GaussianBlur(9))
    img.paste(fill.crop((x0, y0, x1, y1)), (x0, y0), mask)
    img.save(dst_path, 'WEBP', quality=82)
    print(f'{name}: blur-filled window ({x0},{y0})-({x1},{y1}) blur={blur}')
