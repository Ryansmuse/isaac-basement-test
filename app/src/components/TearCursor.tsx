import { useEffect } from 'react'

/**
 * Click = Isaac fires a tear. Spawns a tear at the pointer that falls with
 * gravity and splashes out. The cursor itself is the tear (see index.css).
 */
export default function TearCursor() {
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return
      const tear = document.createElement('span')
      tear.className = 'tear-shot'
      tear.style.left = `${e.clientX}px`
      tear.style.top = `${e.clientY}px`
      document.body.appendChild(tear)
      const anim = tear.animate(
        [
          { transform: 'translate(-50%, -10%) scale(0.7)', opacity: 0.95 },
          { transform: 'translate(-50%, 118px) scale(1)', opacity: 0.95, offset: 0.8 },
          { transform: 'translate(-50%, 130px) scale(1.6, 0.3)', opacity: 0 },
        ],
        { duration: 480, easing: 'cubic-bezier(.5,.05,.8,.6)' },
      )
      anim.onfinish = () => tear.remove()
    }
    window.addEventListener('pointerdown', onDown)
    return () => window.removeEventListener('pointerdown', onDown)
  }, [])
  return null
}
