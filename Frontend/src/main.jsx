import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { CompanyProvider } from './Components/Companycontext.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>

    <CompanyProvider>

    <App />
    </CompanyProvider>
  </StrictMode>,
)
