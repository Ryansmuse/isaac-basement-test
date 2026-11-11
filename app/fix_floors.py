import os
from PIL import Image, ImageFilter

GAME = os.path.expanduser('~/workspace/isaac-app/public/game')
BACKUP = os.path.expanduser('~/workspace/isaac-app/floors-with-isaac')

def patch(path, x0, y0, x1, y1, clone_dx=-330):
    img = Image.open(path).convert('RGB')
    bw, bh = x1 - x0, y1 - y0
    sx = x0 + clone_dx
    src = img.crop((sx, y0, sx + bw, y0 + bh))
    mask = Image.new('L', (bw, bh), 0)
    mask.paste(255, (12, 12, bw - 12, bh - 12))
    mask = mask.filter(ImageFilter.GaussianBlur(10))
    img.paste(src, (x0, y0), mask)
    img.save(path, 'WEBP', quality=82)
    print(f'patched {os.path.basename(path)} window=({x0},{y0})-({x1},{y1}) clone_from={sx}')

# Chest: restore pristine copy first (gold trim fooled the detector), then patch only Isaac's window
import shutil
shutil.copy(os.path.join(BACKUP, 'floor-chest.webp'), os.path.join(GAME, 'floor-chest.webp'))
patch(os.path.join(GAME, 'floor-chest.webp'), 730, 377, 869, 533)
# Dank Depths: dim lavender skin fell below the detector thresholds — same fixed window
patch(os.path.join(GAME, 'floor-dank-depths.webp'), 730, 377, 869, 533)
# Flooded Caves: taller window to also erase his water reflection below
patch(os.path.join(GAME, 'floor-flooded-caves.webp'), 724, 370, 875, 640)
