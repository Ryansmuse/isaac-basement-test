import { useEffect, useRef } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import GameImg from '@/components/GameImg'

interface Layer {
  key: string
  alt: string
  depth: number
  className: string
  imgClassName: string
  float?: boolean
}

const layers: Layer[] = [
  { key: 'magdalene', alt: 'Magdalene', depth: 0.35, className: 'left-[4%] top-[16%] w-28 md:w-40 opacity-90', imgClassName: 'w-full', float: true },
  { key: 'cain', alt: 'Cain', depth: 0.5, className: 'right-[5%] top-[14%] w-28 md:w-40 opacity-90', imgClassName: 'w-full', float: true },
  { key: 'judas', alt: 'Judas', depth: 0.8, className: 'left-[13%] bottom-[13%] w-24 md:w-36', imgClassName: 'w-full', float: true },
  { key: 'samson', alt: 'Samson', depth: 0.8, className: 'right-[13%] bottom-[15%] w-24 md:w-36', imgClassName: 'w-full', float: true },
  { key: 'eve', alt: 'Eve', depth: 1.1, className: 'left-[26%] top-[8%] w-16 md:w-24 opacity-80', imgClassName: 'w-full', float: true },
  { key: 'brimstone', alt: 'Brimstone', depth: 1.3, className: 'right-[27%] top-[10%] w-14 md:w-20 opacity-90', imgClassName: 'w-full', float: true },
  { key: 'magic-mushroom', alt: 'Magic Mushroom', depth: 1.5, className: 'left-[38%] bottom-[9%] w-12 md:w-16 opacity-90', imgClassName: 'w-full', float: true },
  { key: 'monstro', alt: 'Monstro', depth: 0.25, className: 'right-[2%] bottom-[3%] w-36 md:w-56 opacity-70', imgClassName: 'w-full' },
  { key: 'isaac', alt: 'Isaac', depth: 0.6, className: 'left-1/2 top-[46%] w-44 md:w-64', imgClassName: 'w-full drop-shadow-[0_18px_28px_rgba(0,0,0,0.65)]' },
]

export default function ParallaxHero() {
  const rootRef = useRef<HTMLElement>(null)
  const layerRefs = useRef<(HTMLDivElement | null)[]>([])
  const mouse = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      mouse.current.x = e.clientX / window.innerWidth - 0.5
      mouse.current.y = e.clientY / window.innerHeight - 0.5
    }
    window.addEventListener('mousemove', onMouse)
    let raf = 0
    const loop = () => {
      current.current.x += (mouse.current.x - current.current.x) * 0.06
      current.current.y += (mouse.current.y - current.current.y) * 0.06
      const { x, y } = current.current
      const scroll = window.scrollY
      layerRefs.current.forEach((el, i) => {
        if (!el) return
        const depth = layers[i].depth
        const center = layers[i].key === 'isaac' ? 'translate(-50%, -50%) ' : ''
        el.style.transform = `${center}translate3d(${(-x * depth * 56).toFixed(1)}px, ${(-y * depth * 56 - scroll * depth * 0.22).toFixed(1)}px, 0)`
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', onMouse)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <header ref={rootRef} className="vignette relative flex min-h-svh flex-col overflow-hidden bg-[#0b0908]">
      {/* backdrop gradient + glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,#3a2417_0%,#17100b_55%,#070505_100%)]" />
      <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-red-900/25 blur-3xl" />

      {/* parallax sprite layers */}
      <div className="preserve-3d pointer-events-none absolute inset-0">
        {layers.map((layer, i) => (
          <div
            key={layer.key}
            ref={(el) => {
              layerRefs.current[i] = el
            }}
            className={`absolute will-change-transform ${layer.className}`}
          >
            <div className={layer.float ? 'animate-floaty' : undefined} style={{ animationDelay: `${i * 0.7}s` }}>
              <GameImg srcKey={layer.key} alt={layer.alt} className={layer.imgClassName} />
            </div>
          </div>
        ))}
      </div>

      {/* headline */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center">
        <Badge variant="outline" className="mb-5 border-red-900/60 bg-black/40 text-red-200">
          A fan-made field guide to The Binding of Isaac
        </Badge>
        <h1 className="text-glow-red text-6xl font-black tracking-tight text-red-50 md:text-8xl">
          THE BASEMENT
        </h1>
        <p className="mt-5 max-w-xl text-balance text-base text-stone-300 md:text-lg">
          Every character, every iconic item, and every floor between the trapdoor and
          Delirium — move your mouse, the basement moves with you.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" className="bg-red-800 text-red-50 hover:bg-red-700" onClick={() => document.getElementById('floors')?.scrollIntoView({ behavior: 'smooth' })}>
            Descend to the floors
          </Button>
          <Button size="lg" variant="outline" className="border-stone-600 bg-black/30 text-stone-100 hover:bg-stone-800" onClick={() => document.getElementById('characters')?.scrollIntoView({ behavior: 'smooth' })}>
            Meet the characters
          </Button>
        </div>
      </div>

      <div className="relative z-10 pb-6 text-center text-xs uppercase tracking-[0.3em] text-stone-500">
        Scroll to descend
      </div>
    </header>
  )
}
