import { motion } from 'framer-motion'
import ScreenShell from './ScreenShell.jsx'
import { config } from '../data/config.js'
import '../styles/datetime.css'

export default function DateTimeScreen({ date, time, onDate, onTime, onNext }) {
  const { title, subtitle, dateLabel, timeLabel, button } = config.whenStep

  // today's date as a min so past dates can't be chosen
  const today = new Date()
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
    2,
    '0'
  )}-${String(today.getDate()).padStart(2, '0')}`

  const ready = Boolean(date && time)

  return (
    <ScreenShell className="when">
      <div className="when__head">
        <span className="eyebrow">дата и время</span>
        <h2 className="display when__title">{title}</h2>
        <p className="muted when__subtitle">{subtitle}</p>
      </div>

      <motion.label
        className="glass when__field"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.4 }}
      >
        <span className="when__field-label">
          <span className="when__field-icon">📅</span> {dateLabel}
        </span>
        <input
          type="date"
          className="when__input"
          value={date}
          min={minDate}
          onChange={(e) => onDate(e.target.value)}
        />
      </motion.label>

      <motion.label
        className="glass when__field"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.13, duration: 0.4 }}
      >
        <span className="when__field-label">
          <span className="when__field-icon">⏰</span> {timeLabel}
        </span>
        <input
          type="time"
          className="when__input"
          value={time}
          onChange={(e) => onTime(e.target.value)}
        />
      </motion.label>

      <motion.button
        className="btn btn--primary btn--block when__next"
        disabled={!ready}
        onClick={onNext}
        whileTap={ready ? { scale: 0.97 } : undefined}
      >
        {button} →
      </motion.button>
    </ScreenShell>
  )
}
