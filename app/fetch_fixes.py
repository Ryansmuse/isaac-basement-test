#!/usr/bin/env python3
"""Fix-up pass: exact-file candidates first, then page-image scoring."""
import json
import os
import urllib.parse
import urllib.request

API = "https://bindingofisaacrebirth.wiki.gg/api.php"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public", "game")
UA = {"User-Agent": "Mozilla/5.0 (Ryansmuse fan-site asset fetch)"}


def api(params):
    url = API + "?" + urllib.parse.urlencode({**params, "format": "json"})
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.load(resp)


def file_url(file_title):
    data = api({"action": "query", "titles": file_title, "prop": "imageinfo", "iiprop": "url|size|mime"})
    for page in data.get("query", {}).get("pages", {}).values():
        ii = (page.get("imageinfo") or [{}])[0]
        if ii.get("url"):
            return ii
    return None


def download(url, dest):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = resp.read()
    if not data.startswith(b"\x89PNG"):
        return False
    with open(dest, "wb") as f:
        f.write(data)
    return True


def try_files(key, candidates):
    dest = os.path.join(OUT, key + ".png")
    for cand in candidates:
        try:
            ii = file_url("File:" + cand)
            if ii and download(ii["url"], dest):
                print(f"{key:24s} OK File:{cand} {ii.get('width')}x{ii.get('height')}")
                return True
        except Exception as e:  # noqa: BLE001
            print(f"{key:24s} ERR {cand}: {e}")
    print(f"{key:24s} MISS (kept existing/none)")
    return False


def page_best(key, page_title, tokens, exclude=()):
    data = api({"action": "query", "titles": page_title, "prop": "images", "imlimit": "500"})
    files = []
    for page in data.get("query", {}).get("pages", {}).values():
        files += [im["title"] for im in page.get("images", []) if im["title"].lower().endswith(".png")]
    if not files:
        print(f"{key:24s} NO IMAGES on {page_title}")
        return False
    infos = {}
    for i in range(0, len(files), 40):
        d = api({"action": "query", "titles": "|".join(files[i:i + 40]), "prop": "imageinfo", "iiprop": "url|size|mime"})
        for page in d.get("query", {}).get("pages", {}).values():
            ii = (page.get("imageinfo") or [{}])[0]
            if ii.get("url"):
                infos[page["title"]] = ii

    def score(t):
        name = t.lower()
        s = sum(100 for tok in tokens if tok in name)
        if any(x in name for x in exclude):
            s -= 500
        if "icon" in name or "achievement" in name:
            s -= 60
        w, h = infos[t].get("width", 0), infos[t].get("height", 0)
        return s + min(50, (w * h) / 20000) + (10 if w >= 100 else 0)

    best = max((t for t in files if t in infos), key=score)
    dest = os.path.join(OUT, key + ".png")
    if download(infos[best]["url"], dest):
        print(f"{key:24s} OK {best} {infos[best].get('width')}x{infos[best].get('height')}")
        return True
    return False


# Isaac: match the other characters' Transition portraits
try_files("isaac", ["Transition Isaac.png", "Isaac.png", "Character Isaac.png"])
# Items: the real collectible sprites
try_files("brimstone", ["Collectible Brimstone.png"])
try_files("magic-mushroom", ["Collectible Magic Mushroom.png"])
try_files("moms-knife", ["Collectible Mom's Knife.png"])
try_files("crickets-head", ["Collectible Cricket's Head.png"])
try_files("the-sad-onion", ["Collectible The Sad Onion.png"])
try_files("the-d6", ["Collectible The D6.png"])
# Bosses
try_files("isaac-boss", ["Boss Isaac portrait.png", "Isaac (boss).png", "Boss Isaac ingame.png"])
try_files("it-lives", ["Boss It Lives portrait.png", "It Lives.png", "Boss It Lives ingame.png"])
try_files("satan", ["Boss Satan portrait.png", "Satan.png", "Boss Satan ingame.png"])
# Floors that missed
try_files("floor-chest", ["Stage The Chest room.png", "Stage Chest room.png"])
try_files("floor-blue-womb", ["Stage Blue Womb room.png"])
# Fallbacks via page scoring
if not os.path.exists(os.path.join(OUT, "isaac-boss.png")):
    page_best("isaac-boss", "Isaac (Boss)", ["isaac"])
if not os.path.exists(os.path.join(OUT, "it-lives.png")):
    page_best("it-lives", "It Lives!", ["it lives"])
if not os.path.exists(os.path.join(OUT, "floor-chest.png")):
    page_best("floor-chest", "The Chest", ["chest", "room"])
if not os.path.exists(os.path.join(OUT, "floor-blue-womb.png")):
    page_best("floor-blue-womb", "Blue Womb", ["blue womb", "room"])
print("done")
