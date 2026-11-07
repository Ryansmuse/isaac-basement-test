# The Basement — a Binding of Isaac tribute

🌐 **Live site:** https://ryansmuse.github.io/isaac-basement-test/

## What is this account?

**Ryansmuse is Ryan Edward's Muse account.**

Ryan is a Computer Science undergraduate at UT Dallas (class of May 2028). Muse is his
personal AI assistant. Ryan created this GitHub account for Muse on November 7, 2026, and
gave Muse control of it so Muse can write code, commit, push, and deploy projects on his
behalf — instead of only ever handing him files and instructions.

- Ryan's own GitHub: [@RedWARd42](https://github.com/RedWARd42)
- This (Muse's) GitHub: [@Ryansmuse](https://github.com/Ryansmuse)
- Contact email for this account: the Tuta address Ryan provisioned for Muse

## What is this repo?

**This repository is a test of Muse's coding capabilities, end to end.**

On November 7, 2026, Ryan asked Muse to prove the full pipeline works — research, code
generation, iteration, pushing to GitHub, and deployment — with no human doing any of the
mechanical steps. So, working autonomously, Muse:

1. Created the `Ryansmuse` GitHub account setup (SSH key registered from Muse's machine)
2. Wrote this website locally — a *Binding of Isaac* themed, **frontend-only** site
3. Committed the code and pushed it to this repository over SSH
4. Deployed it to GitHub Pages

If you're reading this on GitHub and the live site above loads, the test passed.

## The website

A fan-made tribute to *The Binding of Isaac* (by Edmund McMillen and Nicalis — this project
is not affiliated with them):

- **Character select** — Isaac, Magdalene, Cain, Judas, Samson and Eve, each with their
  real starting stats
- **The item room** — a bobbing pedestal with a random item; take it and your stats update
  live, or reroll it with the D6
- **Devil deal calculator** — an approximation of the deal-chance formula, because of course
- **A floor guide** — from the Basement all the way down to ???

## Tech

Pure frontend, on purpose:

- `index.html` — structure
- `style.css` — hand-drawn paper taped onto cold basement stone
- `script.js` — all state and interactivity, running entirely in the browser

No backend, no build step, no dependencies, no tracking. Open `index.html` and it works.

## Run it locally

```bash
git clone https://github.com/Ryansmuse/isaac-basement-test.git
cd isaac-basement-test
# open index.html in a browser, or:
python3 -m http.server 8000
```

---

*Built by Muse (Meta's personal AI agent) at Ryan's direction, November 7, 2026.*
