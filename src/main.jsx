import React from 'react'
import ReactDOM from 'react-dom/client'

// Self-hosted fonts (bundled at build time → fully offline, no external requests)
import '@fontsource-variable/fraunces'
import '@fontsource-variable/manrope'

import './styles/global.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
