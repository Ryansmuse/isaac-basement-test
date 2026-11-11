import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import FloorSection from '@/components/FloorSection'
import GameImg from '@/components/GameImg'
import ParallaxHero from '@/components/ParallaxHero'
import ScrollBackdrop from '@/components/ScrollBackdrop'
import TearCursor from '@/components/TearCursor'
import TiltCard from '@/components/TiltCard'
import { characters, floors, items } from '@/data/game'

function Nav() {
  const link = 'text-sm text-stone-300 transition-colors hover:text-stone-50'
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <a href="#" className="flex items-center gap-2 font-black tracking-tight text-stone-50">
          <GameImg srcKey="isaac" alt="Isaac" className="h-7 w-7 object-contain" />
          THE BASEMENT
        </a>
        <div className="flex items-center gap-5">
          <a className={link} href="#characters">Characters</a>
          <a className={link} href="#items">Items</a>
          <a className={link} href="#floors">Floors</a>
        </div>
      </div>
    </nav>
  )
}

function Characters() {
  return (
    <section id="characters" className="relative bg-[#0d0a09] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Badge variant="outline" className="border-red-900/60 text-red-200">Who goes down?</Badge>
        <h2 className="mt-4 text-4xl font-black tracking-tight text-stone-50 md:text-5xl">The Characters</h2>
        <p className="mt-3 max-w-2xl text-stone-400">
          Six kids, six starting stat lines, six very different runs. Pick one — the basement
          does the rest.
        </p>

        <Tabs defaultValue="isaac" className="mt-10">
          <TabsList className="flex h-auto flex-wrap gap-1 bg-stone-900/80 p-1.5">
            {characters.map((c) => (
              <TabsTrigger key={c.key} value={c.key} className="gap-2 px-3 py-2 text-stone-300 data-active:bg-red-800 data-active:text-red-50">
                <GameImg srcKey={c.key} alt={c.name} className="h-5 w-5 object-contain" />
                {c.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {characters.map((c) => (
            <TabsContent key={c.key} value={c.key}>
              <Card className="mt-4 border-white/10 bg-stone-950/80">
                <div className="grid items-center gap-8 p-6 md:grid-cols-[240px_1fr] md:p-10">
                  <div className="perspective-1200 mx-auto">
                    <div className="animate-floaty">
                      <GameImg srcKey={c.key} alt={c.name} className="w-44 drop-shadow-[0_16px_24px_rgba(0,0,0,0.6)] md:w-56" />
                    </div>
                  </div>
                  <div>
                    <CardHeader className="p-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <CardTitle className="text-3xl text-stone-50">{c.name}</CardTitle>
                        <Badge className="bg-red-800 text-red-50 hover:bg-red-800">{c.title}</Badge>
                      </div>
                      <CardDescription className="pt-2 text-base leading-relaxed text-stone-400">
                        {c.bio}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 pt-6">
                      <div className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
                        {c.stats.map((stat) => (
                          <div key={stat.label}>
                            <div className="mb-1.5 flex items-baseline justify-between text-sm">
                              <span className="uppercase tracking-wider text-stone-400">{stat.label}</span>
                              <span className="font-bold text-stone-100">{stat.display}</span>
                            </div>
                            <Progress value={stat.pct} className="h-2 bg-stone-800 [&_[data-slot=progress-indicator]]:bg-red-600" />
                          </div>
                        ))}
                      </div>
                      <Separator className="my-6 bg-white/10" />
                      <p className="text-sm text-stone-300">
                        <span className="font-semibold text-stone-100">Starts with: </span>
                        {c.startsWith}
                      </p>
                    </CardContent>
                  </div>
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}

function Items() {
  return (
    <section id="items" className="relative border-t border-white/5 bg-[#0a0808] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Badge variant="outline" className="border-red-900/60 text-red-200">The item room</Badge>
        <h2 className="mt-4 text-4xl font-black tracking-tight text-stone-50 md:text-5xl">Iconic Items</h2>
        <p className="mt-3 max-w-2xl text-stone-400">
          Hundreds of items stack in this game, but a handful define runs on sight. Hover one —
          they tilt in 3D, like a pedestal you are about to ruin your build with.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <TiltCard key={item.key}>
              <Card className="h-full border-white/10 bg-stone-950/80 transition-colors hover:border-red-900/60">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-[radial-gradient(circle,#2b1c10_0%,#120c08_75%)]">
                      <GameImg srcKey={item.key} alt={item.name} className="max-h-16 max-w-16 object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.6)]" />
                    </div>
                    <Badge variant="secondary" className="bg-stone-800 text-stone-200 hover:bg-stone-800">{item.pool}</Badge>
                  </div>
                  <CardTitle className="pt-3 text-xl text-stone-50">{item.name}</CardTitle>
                  <CardDescription className="italic text-red-300/80">“{item.quote}”</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-stone-400">{item.effect}</p>
                </CardContent>
              </Card>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  )
}

function Floors() {
  return (
    <div id="floors">
      <section className="border-t border-white/5 bg-black/40 py-24 text-center">
        <Badge variant="outline" className="border-red-900/60 text-red-200">How deep does it go?</Badge>
        <h2 className="mt-4 text-4xl font-black tracking-tight text-stone-50 md:text-5xl">Every Floor, Top to Bottom</h2>
        <p className="mx-auto mt-3 max-w-2xl text-stone-300">
          Eighteen stops on the way down: three chapters of variants, the Womb, the light and
          dark paths, and the place after the end. Keep scrolling — Isaac runs down through the
          trapdoor into each next floor, and the room changes around him as he lands.
        </p>
      </section>
      {floors.map((floor, i) => (
        <FloorSection key={floor.id} floor={floor} index={i} />
      ))}
    </div>
  )
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black py-12">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <GameImg srcKey="isaac" alt="Isaac" className="mx-auto h-12 w-12 object-contain opacity-80" />
        <p className="mt-4 text-sm font-semibold text-stone-200">THE BASEMENT — a fan-made tribute</p>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-stone-500">
          Not affiliated with Edmund McMillen or Nicalis. The Binding of Isaac and all game
          sprites are trademarks and artwork of their respective owners; sprites here are shown
          for tribute purposes via the community wiki at bindingofisaacrebirth.wiki.gg.
        </p>
        <p className="mt-4 text-xs text-stone-600">
          Built end-to-end by Ryan Edward's Muse (GitHub: Ryansmuse) — React, Tailwind and
          shadcn/ui, deployed to GitHub Pages. Ryan's own GitHub: RedWARd42.
        </p>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <div className="dark relative min-h-screen bg-[#0a0808] font-sans text-stone-100 antialiased">
      <ScrollBackdrop />
      <TearCursor />
      <Nav />
      <ParallaxHero />
      <Characters />
      <Items />
      <Floors />
      <Footer />
    </div>
  )
}
