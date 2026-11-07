export const img = (key: string) => `game/${key}.png`

export interface Stat {
  label: string
  display: string
  pct: number
}

export interface Character {
  key: string
  name: string
  title: string
  bio: string
  startsWith: string
  stats: Stat[]
}

const s = (label: string, value: number, max: number, display?: string): Stat => ({
  label,
  display: display ?? value.toFixed(2).replace(/\.?0+$/, ''),
  pct: Math.max(4, Math.min(100, (value / max) * 100)),
})

export const characters: Character[] = [
  {
    key: 'isaac',
    name: 'Isaac',
    title: 'The Original',
    bio: 'The crying child himself. Perfectly average at everything, which makes him the perfect blank canvas for whatever the basement throws at him. Unlock his D6 and he becomes the strongest reroll engine in the game.',
    startsWith: 'The D6 (once unlocked) — rerolls item pedestals',
    stats: [s('Health', 3, 6, '3 hearts'), s('Damage', 3.5, 7), s('Tears', 2.73, 5), s('Speed', 1.0, 2), s('Range', 6.5, 10), s('Luck', 0, 5)],
  },
  {
    key: 'magdalene',
    name: 'Magdalene',
    title: 'The Tank',
    bio: 'Starts with a fourth heart container and a full heal in her pocket. Slow, but she can brute-force early floors and donate health like nobody else.',
    startsWith: 'Yum Heart — restores one red heart',
    stats: [s('Health', 4, 6, '4 hearts'), s('Damage', 3.5, 7), s('Tears', 2.73, 5), s('Speed', 0.85, 2), s('Range', 6.5, 10), s('Luck', 0, 5)],
  },
  {
    key: 'cain',
    name: 'Cain',
    title: 'The Gambler',
    bio: 'Fast feet, a lucky foot, and one eye permanently closed — which costs him range but pays out in pills, chests and arcade luck all run long.',
    startsWith: 'Lucky Foot — better pills and luck-based payouts',
    stats: [s('Health', 2, 6, '2 hearts'), s('Damage', 3.5, 7), s('Tears', 2.73, 5), s('Speed', 1.3, 2), s('Range', 4.5, 10), s('Luck', 1, 5)],
  },
  {
    key: 'judas',
    name: 'Judas',
    title: 'The Glass Cannon',
    bio: 'One heart. That is the whole health bar. In exchange, the Book of Belial all but guarantees devil deals and a damage multiplier that melts bosses.',
    startsWith: 'Book of Belial — +damage for the room, +devil chance',
    stats: [s('Health', 1, 6, '1 heart'), s('Damage', 4.73, 7, '3.50 ×1.35'), s('Tears', 2.73, 5), s('Speed', 1.0, 2), s('Range', 6.5, 10), s('Luck', 0, 5)],
  },
  {
    key: 'samson',
    name: 'Samson',
    title: 'The Berserker',
    bio: 'Gets stronger the more he bleeds. Bloody Lust stacks damage every time he takes a hit, so a bad floor quietly turns into a boss-killing one.',
    startsWith: 'Bloody Lust — taking damage raises damage',
    stats: [s('Health', 3, 6, '3 hearts'), s('Damage', 3.25, 7), s('Tears', 2.5, 5), s('Speed', 1.1, 2), s('Range', 6.5, 10), s('Luck', 0, 5)],
  },
  {
    key: 'eve',
    name: 'Eve',
    title: 'The Risk Taker',
    bio: 'Built to live on the edge. Drop to half a heart and Whore of Babylon takes over — faster, meaner, and the only way Eve ever wants to play.',
    startsWith: 'Dead Bird + Whore of Babylon — power at low health',
    stats: [s('Health', 2, 6, '2 hearts'), s('Damage', 3.5, 7), s('Tears', 2.73, 5), s('Speed', 1.23, 2), s('Range', 6.5, 10), s('Luck', 0, 5)],
  },
]

export interface Item {
  key: string
  name: string
  quote: string
  effect: string
  pool: string
}

export const items: Item[] = [
  {
    key: 'brimstone',
    name: 'Brimstone',
    quote: 'Blood laser barrage',
    effect: 'Replaces tears with a charged blood laser that pierces everything in a line. One of the most run-defining pickups in the game.',
    pool: 'Devil Room',
  },
  {
    key: 'magic-mushroom',
    name: 'Magic Mushroom',
    quote: 'All stats up!',
    effect: 'The classic: damage, tears, speed, range, shot speed and a full heart container — plus a 1.5× damage multiplier on top.',
    pool: 'Item Room',
  },
  {
    key: 'moms-knife',
    name: "Mom's Knife",
    quote: 'Stab stab stab',
    effect: 'A throwable knife that returns like a boomerang, dealing massive contact damage. Melee range, boss-melting damage.',
    pool: 'Item Room / Devil Room',
  },
  {
    key: 'crickets-head',
    name: "Cricket's Head",
    quote: 'DMG up',
    effect: 'A flat damage up plus a 1.5× damage multiplier. Small sprite, enormous numbers.',
    pool: 'Item Room',
  },
  {
    key: 'the-sad-onion',
    name: 'The Sad Onion',
    quote: 'Tears up',
    effect: 'A humble tears up. Nothing flashy — just the item that quietly starts half of all winning runs.',
    pool: 'Item Room',
  },
  {
    key: 'the-d6',
    name: 'The D6',
    quote: 'Reroll your destiny',
    effect: "Isaac's signature active item. Rerolls every pedestal item in the room into another from the same pool. Destiny is negotiable.",
    pool: 'Starting Item',
  },
]

export interface Floor {
  id: string
  name: string
  chapter: string
  tagline: string
  description: string
  bosses: string[]
  features: string[]
  tint: string
  bossImg?: string
  bossName?: string
}

export const floors: Floor[] = [
  {
    id: 'basement',
    name: 'Basement',
    chapter: 'Chapter 1',
    tagline: 'Where every run begins',
    description:
      'The first floor of every run: brown brick rooms, basic flies and spiders, and your first item room. Gentle by basement standards — which is to say, only mildly trying to kill you.',
    bosses: ['Monstro', 'Larry Jr.', 'The Duke of Flies', 'The Gurglings', 'Widow', 'Pin', 'Famine'],
    features: ['An item room and a shop set the tone for the whole run', 'Secret rooms hide behind bombable walls', 'Clearing it without red-heart damage sets up a 36.5% devil deal'],
    tint: '#3b2a1e',
    bossImg: 'monstro',
    bossName: 'Monstro',
  },
  {
    id: 'cellar',
    name: 'Cellar',
    chapter: 'Chapter 1 · Variant',
    tagline: 'The basement, but spiders',
    description:
      'The spider-infested alternate to Basement. Cobwebs slow you down, nests keep spawning replacements, and everything has about four more legs than it should.',
    bosses: ['The Haunt', 'Larry Jr.', 'Widow', 'Pin', 'The Gurglings', 'Famine'],
    features: ['Cobwebs slow Isaac but not the spiders', 'Spider nests spawn enemies until destroyed', 'The Haunt phases through walls — keep moving'],
    tint: '#26221f',
  },
  {
    id: 'burning-basement',
    name: 'Burning Basement',
    chapter: 'Chapter 1 · Variant',
    tagline: 'The basement, but on fire',
    description:
      'An Afterbirth variant where the whole floor is smoldering. Burning enemies split into flames when killed, and fire hazards turn safe rooms into obstacle courses.',
    bosses: ['Monstro', 'Larry Jr.', 'The Duke of Flies', 'Widow', 'Pin', 'Famine'],
    features: ['Killed enemies can leave live flames behind', 'Fireplaces and burning obstacles fill many rooms', 'Same chapter-1 boss pool, hotter room layouts'],
    tint: '#40200f',
  },
  {
    id: 'caves',
    name: 'Caves',
    chapter: 'Chapter 2',
    tagline: 'The rocks shoot back',
    description:
      'Chapter 2 trades brick for stone. Knights that can only be hurt from behind, spitting mouths, and the first real bullet patterns teach you to stop standing still.',
    bosses: ['Mega Maw', 'Chub', 'Gurdy', 'Mega Fatty', 'Peep', 'Pestilence'],
    features: ['Knights are immune from the front — flank them', 'Mushrooms and rocks can hide crawlspaces', 'Spikes start appearing in room layouts'],
    tint: '#2e3138',
  },
  {
    id: 'catacombs',
    name: 'Catacombs',
    chapter: 'Chapter 2 · Variant',
    tagline: 'Older, darker, deader',
    description:
      'The Caves variant dressed in bone and candlelight. Tougher enemy mixes and The Fallen — a boss that splits into two — guard the way down.',
    bosses: ['The Fallen', 'Gurdy', 'Mega Maw', 'Mega Fatty', 'Peep', 'Pestilence'],
    features: ['The Fallen splits into two heads mid-fight', 'Heavier rooms with chained and armored enemies', 'Bone and spike hazards in tight layouts'],
    tint: '#33291f',
  },
  {
    id: 'flooded-caves',
    name: 'Flooded Caves',
    chapter: 'Chapter 2 · Variant',
    tagline: 'Hope you can swim',
    description:
      'An Afterbirth water level. Rooms are half-submerged, drowned variants of familiar enemies rise out of the water, and everything is just slightly more slippery than you want.',
    bosses: ['Mega Maw', 'Chub', 'Gurdy', 'Mega Fatty', 'Peep', 'Pestilence'],
    features: ['Water pools conceal drowned enemies', 'Drowned chargers and spitters replace cave staples', 'Same chapter-2 boss pool beneath the flood'],
    tint: '#16303a',
  },
  {
    id: 'depths',
    name: 'Depths',
    chapter: 'Chapter 3',
    tagline: "Mom's footsteps get louder",
    description:
      'The floor where runs used to end. Mom waits at the bottom of Chapter 3 — a giant foot, grasping hands and eyes in the doors — and beating her was the original credits roll.',
    bosses: ['Monstro II', 'Loki', 'War', 'Mom'],
    features: ['Mom is the chapter boss: dodge the stomp, watch the doors', 'Curse rooms and sacrifice spikes ask for health as payment', 'Beating Mom opens the way to the Womb'],
    tint: '#3a2d33',
    bossImg: 'mom',
    bossName: 'Mom',
  },
  {
    id: 'necropolis',
    name: 'Necropolis',
    chapter: 'Chapter 3 · Variant',
    tagline: 'The dead hold grudges',
    description:
      'The Depths variant and one of the meanest floors in the game. Mask of Infamy — a boss you can only hurt from behind, at speed — is the local celebrity.',
    bosses: ['Monstro II', 'Loki', 'War', 'Mask of Infamy', 'Mom'],
    features: ['Mask of Infamy demands back-hits while it charges', 'Darker rooms with heavier champion enemies', 'Still ends, one way or another, with Mom'],
    tint: '#2c2436',
  },
  {
    id: 'dank-depths',
    name: 'Dank Depths',
    chapter: 'Chapter 3 · Variant',
    tagline: 'Something is leaking',
    description:
      'An Afterbirth variant slick with tar. Black creep slows your steps, tar-faced enemies slide around, and Brownie — a boss made of exactly what you think — bounces through the arena.',
    bosses: ['Monstro II', 'Loki', 'War', 'Brownie', 'Mom'],
    features: ['Tar creep slows movement across whole rooms', 'Brownie splits into smaller, faster chunks', 'Coal-black variants of chapter-3 enemies'],
    tint: '#1f1f26',
  },
  {
    id: 'womb',
    name: 'Womb',
    chapter: 'Chapter 4',
    tagline: 'It lives',
    description:
      'Past Mom, the game stops pretending. The Womb is flesh, every hit costs a full heart, and It Lives — Mom\'s heart, upgraded — is the gatekeeper to the endgame.',
    bosses: ['It Lives', 'Teratoma', 'Blastocyst'],
    features: ['ALL damage costs a full heart from here down', 'No shops — the run you have is the run you finish with', 'Beating It Lives opens Sheol and the Cathedral'],
    tint: '#4a1f24',
    bossImg: 'it-lives',
    bossName: 'It Lives',
  },
  {
    id: 'utero',
    name: 'Utero',
    chapter: 'Chapter 4 · Variant',
    tagline: 'The womb, rearranged',
    description:
      'The alternate Chapter 4: same full-heart stakes, different fleshy architecture, and Polycephalus rising out of the floor to say hello.',
    bosses: ['It Lives', 'Teratoma', 'Blastocyst', 'Polycephalus'],
    features: ['Full-heart damage, like all of Chapter 4', 'Polycephalus tunnels and surfaces around the arena', 'Ends at It Lives, same as the Womb'],
    tint: '#3d1f33',
  },
  {
    id: 'scarred-womb',
    name: 'Scarred Womb',
    chapter: 'Chapter 4 · Variant',
    tagline: 'Old wounds, new teeth',
    description:
      'An Afterbirth variant of the Womb, cross-hatched with scar tissue. Scarred variants of enemies hit harder and the floor itself feels like it is healing wrong.',
    bosses: ['It Lives', 'Teratoma', 'Blastocyst'],
    features: ['Scarred enemy variants with nastier patterns', 'Full-heart damage throughout', 'The last stop before the light/dark split'],
    tint: '#472228',
  },
  {
    id: 'blue-womb',
    name: 'Blue Womb',
    chapter: 'Special Floor',
    tagline: 'Thirty minutes or nothing',
    description:
      'A hidden floor that only opens if you beat It Lives within 30 minutes. Four chests, two item rooms, a shop — and Hush, one of the biggest bullet-hell fights in the game.',
    bosses: ['Hush'],
    features: ['Timed door: reach It Lives in under 30:00', 'Hush has armor and scales to your damage', 'Winning can open a portal to The Void'],
    tint: '#1d2f4a',
    bossImg: 'hush',
    bossName: 'Hush',
  },
  {
    id: 'sheol',
    name: 'Sheol',
    chapter: 'Chapter 5 · Dark Path',
    tagline: 'Down, past everything',
    description:
      'Take the trapdoor after It Lives and you end up here: a lightless floor of demons and devil-room architecture, with Satan himself waiting at the bottom.',
    bosses: ['Satan'],
    features: ['Chosen by taking the trapdoor (or a devil deal) after It Lives', 'Satan fights in three phases, ending with The Fallen and leeches', 'Beating Satan unlocks the Dark Room path'],
    tint: '#241a2e',
    bossImg: 'satan',
    bossName: 'Satan',
  },
  {
    id: 'cathedral',
    name: 'Cathedral',
    chapter: 'Chapter 5 · Light Path',
    tagline: 'Up, into the light',
    description:
      'Take the beam of light instead and the basement turns holy: stained glass, angel statues, and a boss fight against Isaac himself — the game\'s favorite mirror.',
    bosses: ['Isaac'],
    features: ['Chosen by taking the light beam after It Lives', 'The boss Isaac teleports, spawns angels and fires beams of light', 'Beating him unlocks the path to the Chest'],
    tint: '#3d3620',
    bossImg: 'isaac-boss',
    bossName: 'Isaac (Boss)',
  },
  {
    id: 'chest',
    name: 'Chest',
    chapter: 'Chapter 6 · Light Finale',
    tagline: 'Everything is a chest',
    description:
      'The toy-box finale of the light path. The starting room hands you four free items, every room drops chests, and behind the giant golden door, Mega Satan stirs. At the end of it all: ???.',
    bosses: ['???', 'Mega Satan (optional)'],
    features: ['Four golden chests in the first room — four free items', 'Every cleared room spawns more chests', 'The final boss, ???, is Isaac\'s other mirror'],
    tint: '#38301c',
  },
  {
    id: 'dark-room',
    name: 'Dark Room',
    chapter: 'Chapter 6 · Dark Finale',
    tagline: 'Everything is a red chest',
    description:
      'The mirror of the Chest: pitch black, red chests that bite as often as they bless, and The Lamb — the true final boss of the dark path — waiting in the dark.',
    bosses: ['The Lamb', 'Mega Satan (optional)'],
    features: ['Starts with four red chests — items, enemies, or both', 'The Lamb splits into body and head mid-fight', 'One of the hardest floors in the game, by design'],
    tint: '#171221',
  },
  {
    id: 'void',
    name: 'The Void',
    chapter: 'Final Floor',
    tagline: 'The basement, remembering itself wrong',
    description:
      'The floor after everything. The Void stitches rooms and bosses from every chapter into one glitching sprawl, and at its center Delirium — every boss at once, shapeshifting — ends the run.',
    bosses: ['Delirium'],
    features: ['Boss rooms from every chapter, back to back', 'Delirium shapeshifts into bosses you have already beaten', 'Reached through portals after Hush, Mega Satan and other finales'],
    tint: '#101828',
  },
]
