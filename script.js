// The Basement — all frontend, all in the browser. No server was consulted.
"use strict";

/* ---------------- data ---------------- */
const CHARACTERS = [
  { name: "Isaac",      face: "👶", flavor: "Starts with the D6 — if he ever finds it.",
    stats: { hp: 3, dmg: 3.5, tears: 2.73, speed: 1.0, range: 6.5, luck: 0 } },
  { name: "Magdalene",  face: "👧", flavor: "A full heart and a Yum Heart. Slow, but she can take a hit.",
    stats: { hp: 4, dmg: 3.5, tears: 2.73, speed: 0.85, range: 6.5, luck: 0 } },
  { name: "Cain",       face: "🏴‍☠️", flavor: "Eye patch, paper clip, and all the luck in the basement.",
    stats: { hp: 2, dmg: 4.2, tears: 2.73, speed: 1.3, range: 4.5, luck: 1 } },
  { name: "Judas",      face: "😈", flavor: "One heart, huge damage, and a book full of bad ideas.",
    stats: { hp: 1, dmg: 5.25, tears: 2.73, speed: 1.0, range: 6.5, luck: 0 } },
  { name: "Samson",     face: "💪", flavor: "Gets angrier (and stronger) every time he gets hurt.",
    stats: { hp: 3, dmg: 3.5, tears: 2.5, speed: 1.1, range: 5.5, luck: 0 } },
  { name: "Eve",        face: "🐦‍⬛", flavor: "A dead bird, a safety razor, and trust issues.",
    stats: { hp: 2, dmg: 3.5, tears: 2.73, speed: 1.23, range: 6.5, luck: 0 } },
];

// Item effects are applied on top of base stats when taken.
const ITEMS = [
  { icon: "🍄", name: "Magic Mushroom",    quote: "I'm seeing stars.",            fx: { hp: 1, dmg: 0.3, speed: 0.3, range: 0.5 }, fxText: "+1 HP, +0.3 DMG, +speed, +range" },
  { icon: "👁️", name: "Cricket's Head",    quote: "DMG up, and a very good boy.", fx: { dmg: 0.5 }, fxText: "+0.5 DMG (and a hidden multiplier in our hearts)" },
  { icon: "🥛", name: "Chocolate Milk",    quote: "Charged tears. Worth the wait.", fx: { dmg: 1.0, tears: -0.4 }, fxText: "+1.0 DMG, −0.4 tears" },
  { icon: "🩸", name: "The Halo",          quote: "All stats up. Blessed run.",    fx: { hp: 1, dmg: 0.3, tears: 0.2, speed: 0.2, range: 0.5, luck: 1 }, fxText: "ALL STATS UP" },
  { icon: "🔪", name: "Mom's Knife",       quote: "She finally found it.",         fx: { dmg: 2.0, range: -1.0 }, fxText: "+2.0 DMG, −range. It stabs now." },
  { icon: "🪰", name: "Distant Admiration", quote: "A fly friend who never leaves.", fx: { dmg: 0.4 }, fxText: "+0.4 DMG (orbital friendship)" },
  { icon: "🧦", name: "Wooden Spoon",      quote: "Speed up. Run from your problems.", fx: { speed: 0.3 }, fxText: "+0.3 speed" },
  { icon: "🎯", name: "Sagittarius",       quote: "Piercing tears + speed up.",    fx: { speed: 0.2, tears: 0.15 }, fxText: "+0.2 speed, +0.15 tears, piercing" },
  { icon: "💧", name: "Sad Onion",         quote: "Tears up. Obviously.",          fx: { tears: 0.7 }, fxText: "+0.7 tears" },
  { icon: "🍀", name: "Lucky Foot",        quote: "Luck up. Pills taste better.",  fx: { luck: 1 }, fxText: "+1 luck" },
  { icon: "📖", name: "Book of Belial",    quote: "+DMG for the room. Choose violence.", fx: { dmg: 1.0 }, fxText: "+1.0 DMG (this room, forever, here)" },
  { icon: "🕯️", name: "Black Candle",      quote: "No more curses. Deals get better.", fx: { luck: 1 }, fxText: "+1 luck, curse immunity" },
  { icon: "🧲", name: "Transcendence",     quote: "You can fly now. Mind the spikes.", fx: { speed: 0.1 }, fxText: "FLIGHT, +0.1 speed" },
  { icon: "👑", name: "Crown of Light",    quote: "Shots of pure light.",          fx: { dmg: 1.0, tears: 0.3 }, fxText: "+1.0 DMG, +0.3 tears (while untouched)" },
  { icon: "🦴", name: "Growth Hormones",   quote: "DMG + speed up. Puberty hits.", fx: { dmg: 1.0, speed: 0.4 }, fxText: "+1.0 DMG, +0.4 speed" },
  { icon: "🍪", name: "Wooden Nickel's Cookie*", quote: "*Not a real item. Still delicious.", fx: { hp: 1 }, fxText: "+1 HP (probably)" },
];

const STAT_META = [
  { key: "hp",    label: "❤️ Health", max: 12,  fmt: v => v.toFixed(0) },
  { key: "dmg",   label: "⚔️ Damage", max: 12,  fmt: v => v.toFixed(2), cls: "dmg" },
  { key: "tears", label: "💧 Tears",  max: 7,   fmt: v => v.toFixed(2) },
  { key: "speed", label: "👟 Speed",  max: 2.3, fmt: v => v.toFixed(2) },
  { key: "range", label: "🎯 Range",  max: 12,  fmt: v => v.toFixed(1) },
  { key: "luck",  label: "🍀 Luck",   max: 10,  fmt: v => (v >= 0 ? "+" : "") + v.toFixed(0), cls: "luck" },
];

/* ---------------- state ---------------- */
let run = null;         // { character, stats: {...}, items: [] }
let pedestal = null;    // current item object
let d6Charges = 1;      // you get one free reroll to start; be grateful

const $ = sel => document.querySelector(sel);

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove("show"), 2600);
}

/* ---------------- characters ---------------- */
function renderCharacters() {
  const grid = $("#char-grid");
  grid.innerHTML = "";
  CHARACTERS.forEach((c, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "char-card" + (run && run.character.name === c.name ? " selected" : "");
    b.innerHTML = `<div class="char-face">${c.face}</div>
      <div class="char-name">${c.name}</div>
      <div class="char-mini">❤️ ${c.stats.hp} · ⚔️ ${c.stats.dmg.toFixed(2)} · 👟 ${c.stats.speed.toFixed(2)}</div>`;
    b.addEventListener("click", () => startRun(i));
    grid.appendChild(b);
  });
}

function startRun(index) {
  const c = CHARACTERS[index];
  run = { character: c, stats: { ...c.stats }, items: [] };
  d6Charges = 1;
  newPedestal();
  renderCharacters();
  renderRun();
  toast(`${c.name} descends into the Basement…`);
}

/* ---------------- the run ---------------- */
function renderRun() {
  if (!run) return;
  $("#active-face").textContent = run.character.face;
  $("#active-name").textContent = run.character.name;
  $("#active-flavor").textContent = run.character.flavor;

  const statsEl = $("#stats");
  statsEl.innerHTML = "";
  STAT_META.forEach(m => {
    const v = run.stats[m.key];
    const pct = Math.max(0, Math.min(100, (v / m.max) * 100));
    const row = document.createElement("div");
    row.className = "stat-row";
    row.innerHTML = `<span>${m.label}</span>
      <span class="stat-bar"><span class="stat-fill ${m.cls || ""}" style="width:${pct}%"></span></span>
      <span class="stat-val">${m.fmt(v)}</span>`;
    statsEl.appendChild(row);
  });

  const list = $("#collected");
  list.innerHTML = "";
  if (run.items.length === 0) {
    list.innerHTML = `<li class="empty">Nothing yet. The pedestal provides.</li>`;
  } else {
    run.items.forEach(it => {
      const li = document.createElement("li");
      li.innerHTML = `${it.icon} <strong>${it.name}</strong> — <span class="fx">${it.fxText}</span>`;
      list.appendChild(li);
    });
  }
  updateDeal();
}

function newPedestal() {
  // Don't offer duplicates of one-time stat sticks — the basement has standards.
  const owned = new Set(run ? run.items.map(i => i.name) : []);
  const pool = ITEMS.filter(i => !owned.has(i.name));
  pedestal = pool.length ? pick(pool) : null;
  if (!pedestal) {
    $("#pedestal-item").textContent = "🏆";
    $("#pedestal-name").textContent = "You took everything";
    $("#pedestal-quote").textContent = "\"There's nothing left. Go fight Mom.\"";
    return;
  }
  $("#pedestal-item").textContent = pedestal.icon;
  $("#pedestal-name").textContent = pedestal.name;
  $("#pedestal-quote").textContent = `"${pedestal.quote}"`;
}

function takeItem() {
  if (!run || !pedestal) return;
  Object.entries(pedestal.fx).forEach(([k, delta]) => {
    run.stats[k] = Math.max(0, (run.stats[k] || 0) + delta);
  });
  run.items.push(pedestal);
  toast(`${pedestal.icon} ${pedestal.name} — ${pedestal.fxText}`);
  newPedestal();
  renderRun();
}

function rerollItem() {
  if (!run || !pedestal) return;
  if (d6Charges <= 0) {
    toast("The D6 is empty. Clear a room (take an item) to charge it.");
    return;
  }
  d6Charges -= 1;
  const old = pedestal.name;
  newPedestal();
  toast(`🎲 Rerolled ${old} → ${pedestal ? pedestal.name : "nothing"}!`);
}

/* ---------------- devil deal ---------------- */
function updateDeal() {
  let chance = 36.5; // base chance after a boss kill
  if ($("#deal-nodamage").checked) chance += 63.5; // no-damage bonus effectively guarantees the door… almost
  if ($("#deal-bossitem").checked) chance -= 10;
  chance = Math.max(1, Math.min(99, chance));
  $("#deal-chance").textContent = chance.toFixed(1) + "%";
  $("#deal-fill").style.width = chance + "%";
}

/* ---------------- wire up ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  startRun(0); // Isaac, by default. He always goes first. He never had a choice.
  $("#take-item").addEventListener("click", () => { takeItem(); d6Charges = 1; });
  $("#pedestal-item").addEventListener("click", () => { takeItem(); d6Charges = 1; });
  $("#reroll-item").addEventListener("click", rerollItem);
  $("#reset-run").addEventListener("click", () => {
    const idx = CHARACTERS.findIndex(c => c.name === run.character.name);
    startRun(idx);
    toast("You died. Again. Run reset.");
  });
  $("#reroll-all").addEventListener("click", () => {
    startRun(Math.floor(Math.random() * CHARACTERS.length));
    window.location.hash = "#run";
  });
  $("#deal-nodamage").addEventListener("change", updateDeal);
  $("#deal-bossitem").addEventListener("change", updateDeal);
});
