import { useEffect, useRef } from 'react'
import { floors } from '@/data/game'

/**
 * The descent layer — everything here lives in ONE fixed backdrop stack
 * behind the page content:
 * - The room graphic crossfades to match the floor in view (the room
 *   backdrops themselves are empty rooms — no Isaac baked in).
 * - Isaac runs down through that backdrop. His descent is locked 1:1 to the
 *   scroller: one full top-to-bottom run per viewport-height of scrolling,
 *   no easing, so he moves at exactly the pace of the page. At the bottom of
 *   each run a trapdoor opens and he drops through into the next run.
 * - The dim overlays sit on top of him too, so he reads as part of the room
 *   behind the content, never over it.
 * One rAF-throttled scroll listener writes styles directly to refs.
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
      const mid = window.scrollY + vh / 2 // the scroller's position in the document

      const tops: number[] = []
      const heights: number[] = []
      for (let i = 0; i < sections.length; i++) {
        tops.push(sections[i].offsetTop)
        heights.push(sections[i].offsetHeight)
      }
      const regionStart = tops[0]
      const regionEnd = tops[tops.length - 1] + heights[heights.length - 1]

      // Which floor is the scroller in, and how far through it (for backdrop
      // crossfade + gentle parallax on the active room)?
      let active = -1
      let q = 0
      for (let i = 0; i < sections.length; i++) {
        if (mid >= tops[i] && mid < tops[i] + heights[i]) {
          active = i
          q = clamp01((mid - tops[i]) / heights[i])
          break
        }
      }
      const ambient = active !== -1 ? active : mid < regionStart ? 0 : sections.length - 1
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

      const inDescent = mid >= regionStart && mid < regionEnd
      if (reduced || !inDescent) {
        isaac.style.opacity = '0'
        door.style.opacity = '0'
        return
      }

      // Pace lock: u = pixels scrolled into the descent; one full run cycle
      // per vh of scrolling. c is the position inside the current run.
      const u = mid - regionStart
      const c = (u % vh) / vh

      // Strictly linear: he enters just above the top and leaves at the
      // bottom at exactly the scroller's speed.
      const y = lerp(-0.13, 1.0, c) * vh
      let opacity = 0.85
      if (c < 0.05) opacity *= c / 0.05 // materializes at the top of the room
      if (c > 0.9) opacity *= 1 - (c - 0.9) / 0.1 // sinks through the trapdoor
      const scale = c > 0.9 ? 1 - ((c - 0.9) / 0.1) * 0.12 : 1
      const sway = Math.sin(u * 0.01) * 10
      isaac.style.opacity = opacity.toFixed(2)
      isaac.style.transform = `translate3d(calc(-50% + ${sway.toFixed(1)}px), ${y.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`

      // Trapdoor: fades in near the end of each run; doors swing open as he
      // reaches them.
      door.style.opacity = clamp01((c - 0.6) / 0.18).toFixed(2)
      const open = clamp01((c - 0.84) / 0.14)
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
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#0a0808]">
      {/* Room backdrops — crossfade to the floor the scroller is in */}
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

      {/* Isaac, running down through the room behind everything */}
      <div
        ref={isaacRef}
        className="absolute left-1/2 top-0 w-14 opacity-0 will-change-transform md:w-[4.25rem]"
      >
        <img
          src="game/isaac.png"
          alt=""
          draggable={false}
          className="animate-run-bob pixelated w-full drop-shadow-[0_10px_16px_rgba(0,0,0,0.65)]"
        />
      </div>

      {/* The trapdoor into the next room */}
      <div ref={doorRef} className="absolute bottom-[2.5vh] left-1/2 -translate-x-1/2 opacity-0">
        <div className="relative h-4 w-36 md:w-44" style={{ perspective: '300px' }}>
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

      {/* Dim overlays — over the room AND Isaac, under the content */}
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70" />
    </div>
  )
}
