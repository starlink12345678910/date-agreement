import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ScreenShell from './ScreenShell.jsx'
import { config } from '../data/config.js'
import { celebrate, heartBurst, vibrate, pop } from '../utils/effects.js'
import '../styles/proposal.css'

export default function ProposalScreen({ onYes }) {
  const { question, heart, yes, no, noMessages, successTitle, successSubtitle } =
    config.proposal

  const [tries, setTries] = useState(0) // how many times NO was poked
  const [evading, setEvading] = useState(false)
  const [pos, setPos] = useState({ left: 0, top: 0 })
  const [accepted, setAccepted] = useState(false)

  const noRef = useRef(null)
  const sizeRef = useRef({ w: 120, h: 50 })
  const lastEvadeRef = useRef(0)

  const randomPos = () => {
    const { w, h } = sizeRef.current
    const padX = 14
    const topSafe = 104 // keep clear of the progress dots
    const botSafe = 28
    const vw = window.innerWidth
    const vh = window.innerHeight
    const maxLeft = Math.max(padX, vw - w - padX)
    const maxTop = Math.max(topSafe + 1, vh - h - botSafe)
    const left = padX + Math.random() * (maxLeft - padX)
    const top = topSafe + Math.random() * (maxTop - topSafe)
    return { left, top }
  }

  const evade = () => {
    // small cooldown so mouse-enter + click don't double-count
    const now = Date.now()
    if (now - lastEvadeRef.current < 220) return
    lastEvadeRef.current = now

    if (!evading) {
      const r = noRef.current?.getBoundingClientRect()
      if (r) sizeRef.current = { w: r.width, h: r.height }
      setEvading(true)
    }
    setPos(randomPos())
    setTries((t) => t + 1)
    vibrate(10)
  }

  const handleNoEnter = (e) => {
    if (e.pointerType === 'mouse') evade()
  }

  const acceptYes = () => {
    setAccepted(true)
    vibrate([24, 40, 24, 40, 90])
    celebrate()
    setTimeout(() => heartBurst(), 220)
  }

  // Progressive shrink/fade for the NO button
  const noScale = tries >= 5 ? 0.42 : tries >= 3 ? 0.72 : 1
  const noOpacity = tries >= 5 ? 0.55 : 1
  const gone = tries >= 6
  const showMsg = tries >= 2 && !gone
  const msg = noMessages[Math.min(tries - 2, noMessages.length - 1)]

  // YES grows a little each time NO runs away — more tempting
  const yesScale = Math.min(1 + tries * 0.06, 1.4)

  if (accepted) {
    return (
      <ScreenShell className="proposal">
        <motion.div
          className="proposal__success"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 18 }}
        >
          <motion.div
            className="proposal__success-heart"
            animate={{ scale: [1, 1.18, 1] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
          >
            💖
          </motion.div>
          <h2 className="display proposal__success-title">{successTitle}</h2>
          <p className="muted proposal__success-sub">{successSubtitle}</p>
          <motion.button
            className="btn btn--primary"
            onClick={() => {
              pop({ x: 0.5, y: 0.5 })
              onYes()
            }}
            whileTap={{ scale: 0.96 }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Выбрать место →
          </motion.button>
        </motion.div>
      </ScreenShell>
    )
  }

  return (
    <ScreenShell className="proposal">
      <div className="proposal__heart-big">{heart}</div>
      <h1 className="display proposal__question">{question}</h1>

      <div className="proposal__buttons">
        <motion.button
          className="btn btn--primary proposal__yes"
          onClick={acceptYes}
          whileTap={{ scale: 0.95 }}
          animate={{ scale: yesScale }}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        >
          {yes} 💕
        </motion.button>

        <AnimatePresence>
          {!gone && (
            <motion.button
              key="no"
              ref={noRef}
              className={`btn btn--ghost proposal__no${evading ? ' proposal__no--loose' : ''}`}
              onClick={evade}
              onPointerEnter={handleNoEnter}
              initial={false}
              animate={{
                scale: noScale,
                opacity: noOpacity,
                ...(evading ? { left: pos.left, top: pos.top } : {}),
              }}
              exit={{ scale: 0, opacity: 0, rotate: 20 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              style={evading ? { position: 'fixed' } : undefined}
            >
              {no}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="proposal__msg-slot">
        <AnimatePresence mode="wait">
          {showMsg && (
            <motion.p
              key={msg}
              className="proposal__msg"
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {msg}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </ScreenShell>
  )
}
