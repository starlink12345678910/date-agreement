import { toCanvas } from 'html-to-image'

function dataUrlToFile(dataUrl, filename) {
  const [head, b64] = dataUrl.split(',')
  const mime = (head.match(/:(.*?);/) || [])[1] || 'image/png'
  const bin = atob(b64)
  const u8 = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i += 1) u8[i] = bin.charCodeAt(i)
  return new File([u8], filename, { type: mime })
}

function downloadDataUrl(dataUrl, filename) {
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
}

export function canShareFiles() {
  try {
    if (typeof navigator === 'undefined' || !navigator.canShare) return false
    const f = new File(['x'], 'probe.png', { type: 'image/png' })
    return navigator.canShare({ files: [f] })
  } catch {
    return false
  }
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

export async function shareNodeAsImage(
  node,
  { filename = 'date-certificate.png', title, text, signatureDataUrl = null } = {}
) {
  if (!node) return { ok: false }

  try {
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      await document.fonts.ready
    }
  } catch {}

  await new Promise(r => setTimeout(r, 80))

  let canvas
  const PIXEL_RATIO = 2

  try {
    canvas = await toCanvas(node, {
      pixelRatio: PIXEL_RATIO,
      cacheBust: true,
      backgroundColor: '#fff8ee',
    })
  } catch (error) {
    return { ok: false, error }
  }

  if (signatureDataUrl) {
    try {
      const signBox = node.querySelector('.cert__sign-box')
      if (signBox) {
        const cardRect = node.getBoundingClientRect()
        const boxRect = signBox.getBoundingClientRect()
        const scaleX = canvas.width / cardRect.width
        const scaleY = canvas.height / cardRect.height
        const dx = (boxRect.left - cardRect.left) * scaleX
        const dy = (boxRect.top - cardRect.top) * scaleY
        const dw = boxRect.width * scaleX
        const dh = boxRect.height * scaleY
        const padding = 8 * PIXEL_RATIO
        const sigImg = await loadImage(signatureDataUrl)
        const ctx = canvas.getContext('2d')
        ctx.drawImage(sigImg, dx + padding, dy + padding, dw - padding * 2, dh - padding * 2)
      }
    } catch {}
  }

  const dataUrl = canvas.toDataURL('image/png')

  try {
    const file = dataUrlToFile(dataUrl, filename)
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title, text })
        return { ok: true, method: 'share' }
      } catch (error) {
        if (error && error.name === 'AbortError') return { ok: false, cancelled: true }
      }
    }
  } catch {}

  try {
    downloadDataUrl(dataUrl, filename)
    return { ok: true, method: 'download' }
  } catch (error) {
    return { ok: false, error }
  }
}
