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
import MyAA from './pages/MyAA'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<App />}>
          <Route path="/" element={<Home />} />
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/inspiration" element={<Inspiration />} />
          <Route path="/step10" element={<StepTen />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/my-aa" element={<MyAA />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
