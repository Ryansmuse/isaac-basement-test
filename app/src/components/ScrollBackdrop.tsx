import { useEffect, useRef } from 'react'
import { floors } from '@/data/game'

/**
 * The descent layer:
 * - A fixed full-screen backdrop that crossfades to the room graphic of the
 *   floor currently in view, so the page background always matches the floor.
 * - A fixed Isaac who runs down the screen as you scroll each floor, drops
 *   through a trapdoor at the bottom, and lands in the next floor.
 * - A trapdoor at the bottom of the screen whose doors swing open as Isaac
 *   reaches it.
 * Everything is driven by one rAF-throttled scroll listener writing styles
 * directly to refs — no React state churn per frame.
 */
export default function ScrollBackdrop() {
  const layersRef = useRef<(HTMLDivElement | null)[]>([])
  const isaacRef = useRef<HTMLDivElement>(null)
  const doorRef = useRef<HTMLDivElement>(null)
  const doorLRef = useRef<HTMLDivElement>(null)
  const doorRRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const sections = floors
      .map((f) => document.getElementById(`floor-${f.id}`))
      .filter((el): el is HTMLElement => !!el)
    if (!sections.length) return

    const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    let raf = 0
    let lastAmbient = -1

    const update = () => {
      raf = 0
      const vh = window.innerHeight
      const mid = window.scrollY + vh / 2

      // Which floor section is under the middle of the viewport, and how far
      // through it are we (q: 0 at its top, 1 at its bottom)?
      let active = -1
      let q = 0
      let firstTop = Infinity
      for (let i = 0; i < sections.length; i++) {
        const t = sections[i].offsetTop
        const h = sections[i].offsetHeight
        if (i === 0) firstTop = t
        if (active === -1 && mid >= t && mid < t + h) {
          active = i
          q = clamp01((mid - t) / h)
        }
      }

      // Backdrop: before the descent starts, idle on the Basement; past the
      // end, stay on the last floor.
      const ambient = active !== -1 ? active : mid < firstTop ? 0 : sections.length - 1
      if (ambient !== lastAmbient) {
        lastAmbient = ambient
        layersRef.current.forEach((layer, i) => {
          if (layer) layer.style.opacity = i === ambient ? '1' : '0'
        })
      }
      const activeLayer = layersRef.current[ambient]
      if (activeLayer && active !== -1) {
        activeLayer.style.transform = `translate3d(0, ${((q - 0.5) * -36).toFixed(1)}px, 0) scale(1.07)`
      }

      const isaac = isaacRef.current
      const door = doorRef.current
      if (!isaac || !door) return

      if (reduced || active === -1) {
        isaac.style.opacity = '0'
        door.style.opacity = '0'
        return
      }

      // Isaac's run down the room, in three phases per floor.
      let y: number
      let opacity = 0.95
      let scale = 1
      if (q < 0.1) {
        // Drops in from the room above, lands with the ease-out.
        const t = q / 0.1
        y = lerp(-0.12, 0.16, 1 - Math.pow(1 - t, 2)) * vh
        opacity = 0.95 * clamp01(t * 2.5)
      } else if (q <= 0.85) {
        // Running down the room.
        y = lerp(0.16, 0.66, (q - 0.1) / 0.75) * vh
      } else {
        // Falls through the trapdoor into the next floor.
        const d = (q - 0.85) / 0.15
        y = lerp(0.66, 0.97, d * d) * vh
        opacity = 0.95 * (1 - clamp01((d - 0.55) / 0.45))
        scale = 1 - d * 0.1
      }
      const sway = Math.sin(window.scrollY * 0.004) * 14
      isaac.style.opacity = opacity.toFixed(2)
      isaac.style.transform = `translate3d(calc(-50% + ${sway.toFixed(1)}px), ${y.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`

      // Trapdoor fades in as Isaac nears the bottom; doors swing open in the
      // drop phase.
      door.style.opacity = clamp01((q - 0.55) / 0.2).toFixed(2)
      const open = q > 0.85 ? (q - 0.85) / 0.15 : 0
      if (doorLRef.current) doorLRef.current.style.transform = `rotateY(${(-72 * open).toFixed(1)}deg)`
      if (doorRRef.current) doorRRef.current.style.transform = `rotateY(${(72 * open).toFixed(1)}deg)`
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      {/* Fixed room backdrop — crossfades to the floor Isaac is on */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#0a0808]">
        {floors.map((floor, i) => (
          <div
            key={floor.id}
            ref={(el) => {
              layersRef.current[i] = el
            }}
            className="absolute inset-0 transition-opacity duration-700 will-change-transform"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            <img
              src={`game/floor-${floor.id}.webp`}
              alt=""
              draggable={false}
              decoding="async"
              loading={i < 2 ? 'eager' : 'lazy'}
              className="h-full w-full scale-[1.07] object-cover"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70" />
      </div>

      {/* Isaac, running down through the floors as you scroll */}
      <div
        ref={isaacRef}
        aria-hidden
        className="pointer-events-none fixed left-1/2 top-0 z-[6] w-20 opacity-0 will-change-transform md:w-24"
      >
        <img
          src="game/isaac.png"
          alt=""
          draggable={false}
          className="animate-run-bob pixelated w-full drop-shadow-[0_10px_16px_rgba(0,0,0,0.65)]"
        />
      </div>

      {/* The trapdoor into the next floor */}
      <div
        ref={doorRef}
        aria-hidden
        className="pointer-events-none fixed bottom-[2.5vh] left-1/2 z-[5] -translate-x-1/2 opacity-0"
      >
        <div className="relative h-5 w-40 md:w-52" style={{ perspective: '300px' }}>
          <div className="absolute inset-0 rounded-sm bg-black shadow-[inset_0_0_18px_rgba(0,0,0,1)]" />
          <div
            ref={doorLRef}
            className="absolute inset-y-0 left-0 w-1/2 origin-left rounded-l-sm border border-[#4a3220] bg-[repeating-linear-gradient(90deg,#3a2716_0_10px,#2e1e10_10px_20px)] will-change-transform"
          />
          <div
            ref={doorRRef}
            className="absolute inset-y-0 right-0 w-1/2 origin-right rounded-r-sm border border-[#4a3220] bg-[repeating-linear-gradient(90deg,#3a2716_0_10px,#2e1e10_10px_20px)] will-change-transform"
          />
        </div>
        <p className="mt-2 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-stone-300">
          next floor
        </p>
      </div>
    </>
  )
}
