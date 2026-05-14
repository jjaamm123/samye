import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CurrencyProvider } from './context/CurrencyContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CurrencyProvider>
      <App />
    </CurrencyProvider>
  </StrictMode>,
) 