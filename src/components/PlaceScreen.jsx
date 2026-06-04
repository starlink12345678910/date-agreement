import { motion } from 'framer-motion'
import ScreenShell from './ScreenShell.jsx'
import { config } from '../data/config.js'
import { vibrate } from '../utils/effects.js'
import '../styles/place.css'

export default function PlaceScreen({ value, onSelect, onNext }) {
  const { title, subtitle, button } = config.placeStep

  return (
    <ScreenShell className="place">
      <div className="place__head">
        <span className="eyebrow">место</span>
        <h2 className="display place__title">{title}</h2>
        <p className="muted place__subtitle">{subtitle}</p>
      </div>

      <div className="place__grid">
        {config.places.map((p, i) => {
          const active = value === p.label
          return (
            <motion.button
              key={p.label}
              className={`glass place__card${active ? ' place__card--active' : ''}`}
              onClick={() => {
                vibrate(8)
                onSelect(p.label)
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.06, duration: 0.4 }}
            >
              <span className="place__icon">{p.icon}</span>
              <span className="place__label">{p.label}</span>
              {active && <span className="place__check">✓</span>}
            </motion.button>
          )
        })}
      </div>

      <motion.button
        className="btn btn--primary btn--block place__next"
        disabled={!value}
        onClick={onNext}
        whileTap={value ? { scale: 0.97 } : undefined}
      >
        {button} →
      </motion.button>
    </ScreenShell>
  )
}
