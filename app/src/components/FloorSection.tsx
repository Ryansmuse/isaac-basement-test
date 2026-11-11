import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import GameImg from '@/components/GameImg'
import type { Floor } from '@/data/game'

interface FloorSectionProps {
  floor: Floor
  index: number
}

/**
 * One floor = one full section with a shadcn info card. The room graphic
 * itself is the fixed page backdrop (ScrollBackdrop crossfades it to match
 * the floor Isaac has run down into); this section lays its tint over it.
 */
export default function FloorSection({ floor, index }: FloorSectionProps) {
  const flipped = index % 2 === 1

  return (
    <section
      id={`floor-${floor.id}`}
      className="relative overflow-hidden border-t border-white/5"
      style={{ background: `linear-gradient(160deg, ${floor.tint}b3 0%, rgba(10,8,8,0.38) 55%, rgba(10,8,8,0.72) 100%)` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60" />

      <div className={`relative mx-auto grid max-w-6xl items-center gap-8 px-6 py-24 md:grid-cols-2 md:py-32 ${flipped ? '' : ''}`}>
        <div className={flipped ? 'md:order-2' : ''}>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge className="bg-red-800 text-red-50 hover:bg-red-800">{floor.chapter}</Badge>
            <Badge variant="outline" className="border-white/20 text-stone-300">
              Floor {index + 1} of the descent
            </Badge>
          </div>
          <h3 className="text-4xl font-black tracking-tight text-stone-50 md:text-5xl">{floor.name}</h3>
          <p className="mt-2 text-lg italic text-red-300/90">“{floor.tagline}”</p>
          <p className="mt-4 max-w-lg leading-relaxed text-stone-300">{floor.description}</p>

          {floor.bossImg && (
            <div className="mt-8 flex items-end gap-4">
              <div className="animate-floaty-slow w-28 md:w-36">
                <GameImg srcKey={floor.bossImg} alt={floor.bossName ?? 'Boss'} className="w-full drop-shadow-[0_14px_20px_rgba(0,0,0,0.6)]" />
              </div>
              <p className="pb-2 text-sm uppercase tracking-widest text-stone-400">
                Boss spotlight
                <span className="block text-base font-bold normal-case tracking-normal text-stone-100">{floor.bossName}</span>
              </p>
            </div>
          )}
        </div>

        <Card className={`border-white/10 bg-black/55 shadow-2xl backdrop-blur-sm ${flipped ? 'md:order-1' : ''}`}>
          <CardHeader>
            <CardTitle className="text-stone-50">Field notes</CardTitle>
            <CardDescription className="text-stone-400">Who waits here, and what to watch for.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion defaultValue={['bosses']}>
              <AccordionItem value="bosses">
                <AccordionTrigger className="text-stone-100">Boss pool</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {floor.bosses.map((boss) => (
                      <Badge key={boss} variant="secondary" className="bg-stone-800 text-stone-100 hover:bg-stone-700">
                        {boss}
                      </Badge>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="features">
                <AccordionTrigger className="text-stone-100">What to watch for</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc space-y-2 pt-1 pl-5 text-stone-300">
                    {floor.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
