import { motion } from 'framer-motion'
import ScreenShell from './ScreenShell.jsx'
import { config } from '../data/config.js'
import '../styles/welcome.css'

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
}

export default function WelcomeScreen({ onNext }) {
  const { greeting, subtitle, button } = config.welcome

  return (
    <ScreenShell className="welcome">
      <motion.div
        className="welcome__stack"
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.14, delayChildren: 0.15 }}
        variants={{ hidden: {}, show: {} }}
      >
        <motion.div
          className="welcome__orb"
          variants={item}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="welcome__orb-heart">❤️</span>
          <span className="welcome__sparkle welcome__sparkle--1">✦</span>
          <span className="welcome__sparkle welcome__sparkle--2">✦</span>
        </motion.div>

        <motion.span className="eyebrow" variants={item} transition={{ duration: 0.5 }}>
          только для тебя
        </motion.span>

        <motion.h1
          className="display welcome__title"
          variants={item}
          transition={{ duration: 0.55 }}
        >
          {greeting}
        </motion.h1>

        <motion.p
          className="welcome__subtitle muted"
          variants={item}
          transition={{ duration: 0.55 }}
        >
          {subtitle}
        </motion.p>

        <motion.div variants={item} transition={{ duration: 0.55 }} className="welcome__cta">
          <motion.button
            className="btn btn--primary"
            onClick={onNext}
            whileTap={{ scale: 0.96 }}
          >
            {button} →
          </motion.button>
        </motion.div>
      </motion.div>
    </ScreenShell>
  )
}
