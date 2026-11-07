import { useState } from 'react'
import { cn } from '@/lib/utils'

interface GameImgProps {
  srcKey: string
  alt: string
  className?: string
  lazy?: boolean
  ext?: 'png' | 'webp'
}

/** A real game image (from public/game/<key>.<ext>). Hides itself if the file is missing. */
export default function GameImg({ srcKey, alt, className, lazy, ext = 'png' }: GameImgProps) {
  const [ok, setOk] = useState(true)
  if (!ok) return null
  return (
    <img
      src={`game/${srcKey}.${ext}`}
      alt={alt}
      draggable={false}
      loading={lazy ? 'lazy' : undefined}
      decoding="async"
      onError={() => setOk(false)}
      className={cn('pixelated select-none', className)}
    />
  )
}
