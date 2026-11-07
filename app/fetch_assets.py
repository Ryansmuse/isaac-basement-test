#!/usr/bin/env python3
"""Fetch real Binding of Isaac PNGs from the community wiki (wiki.gg MediaWiki API).

For each target page: list its images, fetch imageinfo, pick the best candidate
(exact name match first, then largest), download it into public/game/<key>.png,
and verify the PNG magic bytes.
"""
import json
import os
import sys
import urllib.parse
import urllib.request

API = "https://bindingofisaacrebirth.wiki.gg/api.php"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public", "game")
UA = {"User-Agent": "Mozilla/5.0 (Ryansmuse fan-site asset fetch)"}

# key -> (page title, preferred filename tokens)
TARGETS = {
    # characters
    "isaac": ("Isaac (character)", ["isaac"]),
    "magdalene": ("Magdalene", ["magdalene"]),
    "cain": ("Cain", ["cain"]),
    "judas": ("Judas", ["judas"]),
    "samson": ("Samson", ["samson"]),
    "eve": ("Eve", ["eve"]),
    # items
    "brimstone": ("Brimstone", ["brimstone"]),
    "magic-mushroom": ("Magic Mushroom", ["magic mushroom", "magicmushroom"]),
    "moms-knife": ("Mom's Knife", ["mom's knife", "moms knife", "mom knife"]),
    "crickets-head": ("Cricket's Head", ["cricket's head", "crickets head"]),
    "the-sad-onion": ("The Sad Onion", ["sad onion"]),
    "the-d6": ("The D6", ["d6"]),
    # bosses
    "monstro": ("Monstro", ["monstro"]),
    "mom": ("Mom", ["mom"]),
    "satan": ("Satan", ["satan"]),
    "isaac-boss": ("Isaac (boss)", ["isaac"]),
    "it-lives": ("It Lives", ["it lives"]),
    "hush": ("Hush", ["hush"]),
    # floors -> saved as floor-<key>.png
    "floor-basement": ("Basement", ["basement"]),
    "floor-cellar": ("Cellar", ["cellar"]),
    "floor-burning-basement": ("Burning Basement", ["burning basement", "burning"]),
    "floor-caves": ("Caves", ["caves"]),
    "floor-catacombs": ("Catacombs", ["catacombs"]),
    "floor-flooded-caves": ("Flooded Caves", ["flooded caves", "flooded"]),
    "floor-depths": ("Depths", ["depths"]),
    "floor-necropolis": ("Necropolis", ["necropolis"]),
    "floor-dank-depths": ("Dank Depths", ["dank depths", "dank"]),
    "floor-womb": ("Womb", ["womb"]),
    "floor-utero": ("Utero", ["utero"]),
    "floor-scarred-womb": ("Scarred Womb", ["scarred womb", "scarred"]),
    "floor-blue-womb": ("Blue Womb", ["blue womb", "blue"]),
    "floor-sheol": ("Sheol", ["sheol"]),
    "floor-cathedral": ("Cathedral", ["cathedral"]),
    "floor-chest": ("Chest", ["chest"]),
    "floor-dark-room": ("Dark Room", ["dark room"]),
    "floor-void": ("The Void", ["void"]),
}


def api(params):
    url = API + "?" + urllib.parse.urlencode({**params, "format": "json"})
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.load(resp)


def page_images(title):
    data = api({"action": "query", "titles": title, "prop": "images", "imlimit": "500"})
    pages = data.get("query", {}).get("pages", {})
    out = []
    for page in pages.values():
        for im in page.get("images", []):
            out.append(im["title"])
    return out


def image_info(file_titles):
    infos = {}
    for i in range(0, len(file_titles), 40):
        chunk = file_titles[i : i + 40]
        data = api(
            {
                "action": "query",
                "titles": "|".join(chunk),
                "prop": "imageinfo",
                "iiprop": "url|size|mime",
            }
        )
        for page in data.get("query", {}).get("pages", {}).values():
            ii = (page.get("imageinfo") or [{}])[0]
            if ii.get("url"):
                infos[page["title"]] = ii
    return infos


def score(title, tokens, info):
    name = title.lower().replace("_", " ")
    s = 0
    for tok in tokens:
        if tok in name:
            s += 100
    if "icon" in name or "achievement" in name or "unlock" in name:
        s -= 60
    if "grid" in name or "map" in name:
        s -= 40
    w, h = info.get("width", 0), info.get("height", 0)
    s += min(50, (w * h) / 20000)
    if w >= 100:
        s += 10
    return s


def main():
    os.makedirs(OUT, exist_ok=True)
    results = {}
    for key, (title, tokens) in TARGETS.items():
        dest = os.path.join(OUT, key + ".png")
        try:
            files = [f for f in page_images(title) if f.lower().endswith(".png")]
            if not files:
                results[key] = "NO IMAGES on page " + title
                continue
            infos = image_info(files)
            candidates = [(score(t, tokens, infos[t]), t) for t in files if t in infos]
            if not candidates:
                results[key] = "NO IMAGEINFO"
                continue
            candidates.sort(reverse=True)
            best = candidates[0][1]
            url = infos[best]["url"]
            req = urllib.request.Request(url, headers=UA)
            with urllib.request.urlopen(req, timeout=60) as resp:
                data = resp.read()
            if not data.startswith(b"\x89PNG"):
                results[key] = f"NOT PNG: {best}"
                continue
            with open(dest, "wb") as f:
                f.write(data)
            results[key] = f"OK {best} {infos[best].get('width')}x{infos[best].get('height')} {len(data)//1024}KB"
        except Exception as e:  # noqa: BLE001
            results[key] = f"ERROR {type(e).__name__}: {e}"
    for key in TARGETS:
        print(f"{key:24s} {results.get(key)}")
    ok = sum(1 for v in results.values() if v.startswith("OK"))
    print(f"\n{ok}/{len(TARGETS)} downloaded to {OUT}")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
