import confetti from 'canvas-confetti'

/** Safely vibrate the device if the browser/hardware supports it. */
export function vibrate(pattern) {
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(pattern)
    }
  } catch {
    /* ignore — unsupported */
  }
}

const ROSE = ['#ff5d8f', '#f43f79', '#ffd1dc', '#ffb3c8', '#c9a24a', '#ffffff']

/** Celebratory confetti: two side cannons + a gentle continuous rain. */
export function celebrate() {
  const end = Date.now() + 900

  // Side cannons
  confetti({
    particleCount: 90,
    spread: 70,
    angle: 60,
    origin: { x: 0, y: 0.7 },
    colors: ROSE,
    scalar: 0.9,
    disableForReducedMotion: true,
  })
  confetti({
    particleCount: 90,
    spread: 70,
    angle: 120,
    origin: { x: 1, y: 0.7 },
    colors: ROSE,
    scalar: 0.9,
    disableForReducedMotion: true,
  })

  // Soft falling rain for a moment
  ;(function frame() {
    confetti({
      particleCount: 4,
      angle: 90,
      spread: 55,
      startVelocity: 35,
      origin: { x: Math.random(), y: -0.1 },
      colors: ROSE,
      gravity: 0.9,
      scalar: 0.85,
      disableForReducedMotion: true,
    })
    if (Date.now() < end) requestAnimationFrame(frame)
  })()
}

/** A burst of heart-shaped confetti from the center. */
export function heartBurst() {
  const heart = confetti.shapeFromText
    ? confetti.shapeFromText({ text: '❤️', scalar: 2 })
    : undefined
  confetti({
    particleCount: 40,
    spread: 100,
    startVelocity: 45,
    origin: { x: 0.5, y: 0.55 },
    shapes: heart ? [heart] : undefined,
    scalar: heart ? 2 : 1,
    colors: heart ? undefined : ROSE,
    gravity: 1,
    disableForReducedMotion: true,
  })
}

/** A small confetti pop used for lighter moments (e.g. the approval stamp). */
export function pop(origin = { x: 0.5, y: 0.5 }) {
  confetti({
    particleCount: 50,
    spread: 60,
    startVelocity: 30,
    origin,
    colors: ROSE,
    scalar: 0.85,
    disableForReducedMotion: true,
  })
}
