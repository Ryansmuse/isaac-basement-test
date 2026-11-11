# The Basement — A Binding of Isaac Field Guide

**Live site:** https://ryansmuse.github.io/isaac-basement-test/

## What this repo is

This repository belongs to **Ryansmuse**, the GitHub account of Ryan Edward's
Muse (an AI assistant). Ryan created the account for Muse on Nov 7, 2026 so
Muse could write code, commit, push, and deploy on his behalf. Ryan's own
GitHub is [@RedWARd42](https://github.com/RedWARd42).

This repo is an **end-to-end test of Muse's coding capabilities**: Muse
researched, built, committed, pushed, and deployed everything here itself.

- **v1** was a hand-written HTML/CSS/JS tribute page.
- **v2** is a full rebuild as an **info site**: React + TypeScript +
  Tailwind CSS with **shadcn/ui** components (Card, Badge, Button, Tabs,
  Accordion, Separator, Progress), real game sprites pulled from the community
  wiki, and 3D parallax throughout — a mouse-parallax hero with layered
  character sprites, scroll-parallax floor graphics, and 3D tilt item cards.
- **v3** (current) makes the descent real: the **cursor is one of Isaac's
  tears** (click anywhere and he fires one), and an **Isaac in the background
  runs down the screen as you scroll**, locked 1:1 to the scroll pace — one
  full descent per viewport of scrolling, falling through a trapdoor at the
  bottom into the next run. The page backdrop is a fixed full-screen room
  graphic that **crossfades to match whichever floor you're on**; the room
  backdrops are the game's real room screenshots with the baked-in Isaac
  inpainted out (diffusion fill + borrowed grain), so the only Isaac in a
  room is the one running through it.

## What's on the site

- **The Characters** — Isaac, Magdalene, Cain, Judas, Samson and Eve, with
  real starting stats and starting-item notes (shadcn Tabs + Progress bars).
- **Iconic Items** — Brimstone, Magic Mushroom, Mom's Knife, Cricket's Head,
  The Sad Onion and The D6, with effects and pools.
- **Every Floor** — a dedicated section for each of the 18 floors: Basement,
  Cellar, Burning Basement, Caves, Catacombs, Flooded Caves, Depths,
  Necropolis, Dank Depths, Womb, Utero, Scarred Womb, Blue Womb, Sheol,
  Cathedral, Chest, Dark Room, and The Void — each with a boss pool and
  field notes.

## Tech

- Vite + React 19 + TypeScript
- Tailwind CSS v4, shadcn/ui (Base UI primitives), lucide icons
- Sprites: The Binding of Isaac artwork via
  [bindingofisaacrebirth.wiki.gg](https://bindingofisaacrebirth.wiki.gg)
- Deployed to GitHub Pages from the `main` branch (built output at repo root;
  app source in `app/`)

## Disclaimer

Fan-made tribute. Not affiliated with Edmund McMillen or Nicalis. The Binding
of Isaac and all game artwork are trademarks/copyrights of their respective
owners.
