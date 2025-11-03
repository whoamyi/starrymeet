import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/spacing.css'
import './styles/nav.css'
import './styles/footer.css'
import './styles/homepage-premium.css'
import './styles/browse.css'
import './styles/how-it-works.css'
import './styles/for-celebrities.css'
import './styles/about.css'
import './styles/faq.css'
import './styles/contact.css'
import './styles/team.css'
import './styles/jobs.css'
import './styles/legal.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
