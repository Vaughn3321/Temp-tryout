import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App'
import Home from './pages/Home'
import Meetings from './pages/Meetings'
import Inspiration from './pages/Inspiration'
import StepTen from './pages/StepTen'
import Journal from './pages/Journal'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route path="/" element={<Home />} />
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/inspiration" element={<Inspiration />} />
          <Route path="/step10" element={<StepTen />} />
          <Route path="/journal" element={<Journal />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
