import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ScreenShell from './ScreenShell.jsx'
import SignaturePad from './SignaturePad.jsx'
import { config } from '../data/config.js'
import { formatDate, fill } from '../utils/format.js'
import { pop, vibrate } from '../utils/effects.js'
import '../styles/agreement.css'

export default function AgreementScreen({ place, date, time, onSign }) {
  const a = config.agreement
  const padRef = useRef(null)
  const [hasSig, setHasSig] = useState(false)
  const [signed, setSigned] = useState(false)

  const body = fill(a.body, { her: config.her, him: config.him })
  const prettyDate = formatDate(date, config.locale)

  const handleSign = () => {
    if (!padRef.current || padRef.current.isEmpty()) return
    const dataURL = padRef.current.getDataURL()
    setSigned(true)
    vibrate([18, 30, 18])
    pop({ x: 0.5, y: 0.45 })
    // let the stamp land, then move on to the certificate
    setTimeout(() => onSign(dataURL), 1500)
  }

  return (
    <ScreenShell className="agreement">
      <motion.article
        className="doc"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="doc__ribbon">❤</div>
        <span className="eyebrow doc__eyebrow">соглашение</span>
        <h2 className="display doc__title">{a.title}</h2>

        <p className="doc__body">{body}</p>

        <div className="doc__fields">
          <div className="doc__field">
            <span className="doc__field-label">{a.placeLabel}</span>
            <span className="doc__field-value">{place}</span>
          </div>
          <div className="doc__field">
            <span className="doc__field-label">{a.dateLabel}</span>
            <span className="doc__field-value">{prettyDate}</span>
          </div>
          <div className="doc__field">
            <span className="doc__field-label">{a.timeLabel}</span>
            <span className="doc__field-value">{time}</span>
          </div>
        </div>

        <div className="doc__clauses">
          <p className="doc__clauses-title">{a.clausesTitle}</p>
          <ul className="doc__clauses-list">
            {a.clauses.map((c, i) => (
              <li key={i} className="doc__clause">
                <span className="doc__clause-dot">♥</span>
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div className="doc__sign">
          <div className="doc__sign-head">
            <span className="doc__field-label">{a.signatureLabel}</span>
            {hasSig && (
              <button className="doc__clear" onClick={() => padRef.current?.clear()}>
                {a.clearButton}
              </button>
            )}
          </div>
          <div className="sigpad">
            <SignaturePad ref={padRef} onChange={setHasSig} />
            {!hasSig && <span className="sigpad__hint">{a.signatureHint}</span>}
            <span className="sigpad__line" />
          </div>
        </div>

        <button
          className="btn btn--primary btn--block doc__sign-btn"
          disabled={!hasSig || signed}
          onClick={handleSign}
        >
          {a.signButton}
        </button>

        {/* Approval stamp */}
        <AnimatePresence>
          {signed && (
            <motion.div
              className="stamp"
              initial={{ scale: 2.6, opacity: 0, rotate: -34 }}
              animate={{ scale: 1, opacity: 1, rotate: -13 }}
              transition={{ type: 'spring', stiffness: 260, damping: 12 }}
            >
              <div className="stamp__inner">
                <span className="stamp__text">{a.stamp}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.article>
    </ScreenShell>
  )
}
