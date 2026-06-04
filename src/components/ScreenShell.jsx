import { motion } from 'framer-motion'

const variants = {
  initial: { opacity: 0, y: 26, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -22, scale: 0.99 },
}

/** Wraps a screen with a smooth enter/exit transition + the layout shell. */
export default function ScreenShell({ children, className = '' }) {
  return (
    <motion.section
      className="screen"
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={`screen__inner ${className}`}>{children}</div>
    </motion.section>
  )
}
