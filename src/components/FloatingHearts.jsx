import { useMemo } from 'react'

const GLYPHS = ['❤️', '💕', '💖', '🌸', '✨']

/**
 * A decorative layer of hearts that drift upward continuously.
 * `count` controls density. Positions/timings are randomised once on mount.
 */
export default function FloatingHearts({ count = 14 }) {
  const items = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const size = 14 + Math.random() * 26
      return {
        id: i,
        left: Math.random() * 100,
        size,
        glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
        duration: 9 + Math.random() * 10,
        delay: -Math.random() * 18,
        drift: (Math.random() * 2 - 1) * 60,
        opacity: 0.3 + Math.random() * 0.4,
      }
    })
  }, [count])

  return (
    <div className="hearts" aria-hidden="true">
      {items.map((h) => (
        <span
          key={h.id}
          className="hearts__item"
          style={{
            left: `${h.left}%`,
            fontSize: `${h.size}px`,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
            '--h-drift': `${h.drift}px`,
            '--h-opacity': h.opacity,
          }}
        >
          {h.glyph}
        </span>
      ))}
    </div>
  )
}
