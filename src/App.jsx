import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'

import Background from './components/Background.jsx'
import FloatingHearts from './components/FloatingHearts.jsx'
import ProgressDots from './components/ProgressDots.jsx'

import WelcomeScreen from './components/WelcomeScreen.jsx'
import QuestionsScreen from './components/QuestionsScreen.jsx'
import ProposalScreen from './components/ProposalScreen.jsx'
import PlaceScreen from './components/PlaceScreen.jsx'
import DateTimeScreen from './components/DateTimeScreen.jsx'
import AgreementScreen from './components/AgreementScreen.jsx'
import CertificateScreen from './components/CertificateScreen.jsx'

// Steps that show the little progress indicator at the top (in order).
const STEP_ORDER = ['questions', 'proposal', 'place', 'when', 'agreement']

export default function App() {
  const [screen, setScreen] = useState('welcome')
  const [place, setPlace] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [signature, setSignature] = useState(null)

  const reset = () => {
    setPlace('')
    setDate('')
    setTime('')
    setSignature(null)
    setScreen('welcome')
  }

  const stepIndex = STEP_ORDER.indexOf(screen)
  const showProgress = stepIndex !== -1

  return (
    <div className="app">
      <Background />
      <FloatingHearts count={14} />

      {showProgress && (
        <ProgressDots total={STEP_ORDER.length} current={stepIndex} />
      )}

      <main className="app__content">
        <AnimatePresence mode="wait">
          {screen === 'welcome' && (
            <WelcomeScreen key="welcome" onNext={() => setScreen('questions')} />
          )}

          {screen === 'questions' && (
            <QuestionsScreen key="questions" onNext={() => setScreen('proposal')} />
          )}

          {screen === 'proposal' && (
            <ProposalScreen key="proposal" onYes={() => setScreen('place')} />
          )}

          {screen === 'place' && (
            <PlaceScreen
              key="place"
              value={place}
              onSelect={setPlace}
              onNext={() => setScreen('when')}
            />
          )}

          {screen === 'when' && (
            <DateTimeScreen
              key="when"
              date={date}
              time={time}
              onDate={setDate}
              onTime={setTime}
              onNext={() => setScreen('agreement')}
            />
          )}

          {screen === 'agreement' && (
            <AgreementScreen
              key="agreement"
              place={place}
              date={date}
              time={time}
              onSign={(dataURL) => {
                setSignature(dataURL)
                setScreen('certificate')
              }}
            />
          )}

          {screen === 'certificate' && (
            <CertificateScreen
              key="certificate"
              place={place}
              date={date}
              time={time}
              signature={signature}
              onRestart={reset}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
