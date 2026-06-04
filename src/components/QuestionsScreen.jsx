import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ScreenShell from './ScreenShell.jsx'
import { config } from '../data/config.js'
import { vibrate } from '../utils/effects.js'
import '../styles/questions.css'

export default function QuestionsScreen({ onNext }) {
  const questions = config.questions
  const [index, setIndex] = useState(0)
  const current = questions[index]

  const answer = () => {
    vibrate(8)
    if (index < questions.length - 1) {
      setIndex((i) => i + 1)
    } else {
      onNext()
    }
  }

  return (
    <ScreenShell className="questions">
      <div className="questions__counter muted">
        {index + 1} / {questions.length}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="questions__block"
          initial={{ opacity: 0, x: 36 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -36 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="display questions__q">{current.text}</h2>

          <div className="questions__options">
            {current.options.map((opt, i) => (
              <motion.button
                key={opt}
                className="glass questions__opt"
                onClick={answer}
                whileTap={{ scale: 0.96 }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + i * 0.08, duration: 0.4 }}
              >
                {opt}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </ScreenShell>
  )
}
