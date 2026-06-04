import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useCallback,
} from 'react'

/**
 * A touch-friendly signature canvas.
 *
 * Exposed via ref:
 *   - clear()        wipe the canvas
 *   - isEmpty()      true if nothing has been drawn
 *   - getDataURL()   PNG data URL of the signature (transparent background)
 *
 * `onChange(hasContent)` fires when content appears/disappears so the parent
 * can enable/disable the "sign" button.
 */
const SignaturePad = forwardRef(function SignaturePad({ onChange }, ref) {
  const canvasRef = useRef(null)
  const ctxRef = useRef(null)
  const drawingRef = useRef(false)
  const lastRef = useRef({ x: 0, y: 0 })
  const hasContentRef = useRef(false)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  // (Re)configure canvas for the current size & device pixel ratio,
  // preserving any existing drawing.
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return
    const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 3))

    // Preserve current pixels
    let prev = null
    if (canvas.width > 0 && canvas.height > 0) {
      prev = document.createElement('canvas')
      prev.width = canvas.width
      prev.height = canvas.height
      prev.getContext('2d').drawImage(canvas, 0, 0)
    }

    canvas.width = Math.round(rect.width * dpr)
    canvas.height = Math.round(rect.height * dpr)

    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = 2.6
    ctx.strokeStyle = '#3a2b33'
    ctxRef.current = ctx

    if (prev) {
      ctx.save()
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.drawImage(prev, 0, 0)
      ctx.restore()
    }
  }, [])

  useEffect(() => {
    setupCanvas()
    const onResize = () => setupCanvas()
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
    }
  }, [setupCanvas])

  const pointFromEvent = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const startDraw = (e) => {
    e.preventDefault()
    const canvas = canvasRef.current
    drawingRef.current = true
    lastRef.current = pointFromEvent(e)
    try {
      canvas.setPointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }
    // a dot, so a single tap leaves a mark
    const ctx = ctxRef.current
    ctx.beginPath()
    ctx.arc(lastRef.current.x, lastRef.current.y, ctx.lineWidth / 2, 0, Math.PI * 2)
    ctx.fillStyle = ctx.strokeStyle
    ctx.fill()
    if (!hasContentRef.current) {
      hasContentRef.current = true
      onChangeRef.current?.(true)
    }
  }

  const moveDraw = (e) => {
    if (!drawingRef.current) return
    e.preventDefault()
    const ctx = ctxRef.current
    const p = pointFromEvent(e)
    const last = lastRef.current
    const mid = { x: (last.x + p.x) / 2, y: (last.y + p.y) / 2 }
    ctx.beginPath()
    ctx.moveTo(last.x, last.y)
    // quadratic smoothing for a natural pen feel
    ctx.quadraticCurveTo(last.x, last.y, mid.x, mid.y)
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
    lastRef.current = p
  }

  const endDraw = (e) => {
    if (!drawingRef.current) return
    drawingRef.current = false
    try {
      canvasRef.current.releasePointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }
  }

  useImperativeHandle(ref, () => ({
    clear() {
      const canvas = canvasRef.current
      const ctx = ctxRef.current
      if (!canvas || !ctx) return
      ctx.save()
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.restore()
      hasContentRef.current = false
      onChangeRef.current?.(false)
    },
    isEmpty() {
      return !hasContentRef.current
    },
    getDataURL() {
      return canvasRef.current ? canvasRef.current.toDataURL('image/png') : null
    },
  }))

  return (
    <canvas
      ref={canvasRef}
      className="sigpad__canvas"
      onPointerDown={startDraw}
      onPointerMove={moveDraw}
      onPointerUp={endDraw}
      onPointerCancel={endDraw}
      onPointerLeave={endDraw}
    />
  )
})

export default SignaturePad
