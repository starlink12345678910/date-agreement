import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import ScreenShell from './ScreenShell.jsx'
import { config } from '../data/config.js'
import { formatDate } from '../utils/format.js'
import { celebrate, heartBurst, vibrate } from '../utils/effects.js'
import { shareNodeAsImage, canShareFiles } from '../utils/share.js'
import '../styles/certificate.css'

// Today's date (device clock, local time) — recomputed every time this screen mounts.
function todayISO() {
  const t = new Date()
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(
    t.getDate()
  ).padStart(2, '0')}`
}

export default function CertificateScreen({ place, date, time, signature, onRestart }) {
  const c = config.certificate
  const cardRef = useRef(null)
  const [phase, setPhase] = useState('idle') // idle | busy | shared | saved
  const [supportsShare] = useState(() => canShareFiles())

  // Big finale on mount: confetti + hearts + a happy buzz.
  useEffect(() => {
    vibrate([20, 40, 20, 40, 60])
    celebrate()
    const t = setTimeout(heartBurst, 350)
    return () => clearTimeout(t)
  }, [])

  const issued = formatDate(todayISO(), config.locale)

  const rows = [
    { label: c.nameLabel, value: config.her },
    { label: c.partnerLabel, value: config.him },
    { label: c.placeLabel, value: place },
    { label: c.dateLabel, value: formatDate(date, config.locale) },
    { label: c.timeLabel, value: time },
  ]

  const handleShare = async () => {
    if (phase === 'busy') return
    setPhase('busy')
    vibrate(12)
    const res = await shareNodeAsImage(cardRef.current, {
      filename: c.shareFile,
      title: c.title,
      text: `${config.her} \u2764\ufe0f ${config.him}`,
    })
    if (res.ok && res.method === 'share') setPhase('shared')
    else if (res.ok && res.method === 'download') setPhase('saved')
    else setPhase('idle') // cancelled or failed -> let them try again
  }

  const shareLabel =
    phase === 'busy' ? c.sharing : supportsShare ? c.share : c.save

  return (
    <ScreenShell className="cert">
      <motion.article
        ref={cardRef}
        className="cert__card"
        initial={{ opacity: 0, scale: 0.9, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 140, damping: 16 }}
      >
        {/* decorative gold corners */}
        <span className="cert__corner cert__corner--tl" />
        <span className="cert__corner cert__corner--tr" />
        <span className="cert__corner cert__corner--bl" />
        <span className="cert__corner cert__corner--br" />

        <div className="cert__seal">{'\u2764'}</div>
        <span className="eyebrow cert__eyebrow">{c.subtitle}</span>
        <h2 className="display cert__title">{c.title}</h2>

        <div className="cert__divider">
          <span className="cert__divider-dot">{'\u2726'}</span>
        </div>

        <dl className="cert__rows">
          {rows.map((r) => (
            <div className="cert__row" key={r.label}>
              <dt className="cert__row-label">{r.label}</dt>
              <dd className="cert__row-value">{r.value}</dd>
            </div>
          ))}
          <div className="cert__row cert__row--status">
            <dt className="cert__row-label">{c.statusLabel}</dt>
            <dd className="cert__row-value cert__status">{c.status}</dd>
          </div>
        </dl>

        <div className="cert__sign">
          <span className="cert__row-label">{c.signatureLabel}</span>
          <div className="cert__sign-box">
            {signature ? (
              <img className="cert__sign-img" src={signature} alt={c.signatureLabel} />
            ) : null}
          </div>
        </div>

        <p className="cert__issued">
          {c.issuedLabel}: {issued}
        </p>
        <p className="cert__footer">{c.footer} {'\ud83c\udf39'}</p>
      </motion.article>

      <div className="cert__actions">
        <button
          className="btn btn--primary btn--block cert__share"
          onClick={handleShare}
          disabled={phase === 'busy'}
        >
          {shareLabel}
        </button>

        {(phase === 'shared' || phase === 'saved') && (
          <motion.p
            className="cert__hint"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {phase === 'shared' ? c.sharedHint : c.savedHint}
          </motion.p>
        )}

        <button className="btn btn--ghost cert__restart" onClick={onRestart}>
          {'\u21ba'} {c.restart}
        </button>
      </div>
    </ScreenShell>
  )
}
