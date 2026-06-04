import { toPng } from 'html-to-image'

/** Convert a data URL into a File so it can be shared via the Web Share API. */
function dataUrlToFile(dataUrl, filename) {
  const [head, b64] = dataUrl.split(',')
  const mime = (head.match(/:(.*?);/) || [])[1] || 'image/png'
  const bin = atob(b64)
  const u8 = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i += 1) u8[i] = bin.charCodeAt(i)
  return new File([u8], filename, { type: mime })
}

/** Trigger a normal file download from a data URL. */
function downloadDataUrl(dataUrl, filename) {
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
}

/** True if the device can share image files via the native share sheet. */
export function canShareFiles() {
  try {
    if (typeof navigator === 'undefined' || !navigator.canShare) return false
    const f = new File(['x'], 'probe.png', { type: 'image/png' })
    return navigator.canShare({ files: [f] })
  } catch {
    return false
  }
}

/**
 * Render `node` to a PNG, then share it via the native sheet (mobile) or
 * download it (desktop / unsupported). Returns a result describing what happened
 * so the UI can show the right confirmation.
 */
export async function shareNodeAsImage(
  node,
  { filename = 'date-certificate.png', title, text } = {}
) {
  if (!node) return { ok: false }

  // Make sure custom fonts are ready so the image isn't rendered with fallbacks.
  try {
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      await document.fonts.ready
    }
  } catch {
    /* ignore */
  }

  let dataUrl
  try {
    dataUrl = await toPng(node, {
      pixelRatio: 2, // crisp on retina screens
      cacheBust: true,
      backgroundColor: '#fff8ee', // matches the card so rounded corners blend in
    })
  } catch (error) {
    return { ok: false, error }
  }

  // Try the native share sheet with the image file (best on phones).
  try {
    const file = dataUrlToFile(dataUrl, filename)
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title, text })
        return { ok: true, method: 'share' }
      } catch (error) {
        // User dismissed the sheet — not an error, just stop quietly.
        if (error && error.name === 'AbortError') return { ok: false, cancelled: true }
        // Otherwise fall through to download.
      }
    }
  } catch {
    /* fall through to download */
  }

  // Fallback: save the image to the device.
  try {
    downloadDataUrl(dataUrl, filename)
    return { ok: true, method: 'download' }
  } catch (error) {
    return { ok: false, error }
  }
}
