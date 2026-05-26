import { Routes, Route } from 'react-router-dom'
import { SiteProvider } from './Context/SiteContext'
import Header from './Components/Header/Header'
import Footer from './Components/Footer/Footer'
import NotFound from './Components/NotFound/NotFound'
import Home from './Pages/Home/Home'
import Datos from './Pages/Datos/Datos'
import Optimizar from './Pages/Optimizar/Optimizar'
import Horario from './Pages/Horario/Horario'
import AcercaDe from './Pages/AcercaDe/AcercaDe'
import './App.css'

export default function App() {
  return (
    <SiteProvider>
      <div className="app-wrapper">
        <Header />
        <main className="app-main">
          <Routes>
            <Route path="/"           element={<Home />} />
            <Route path="/datos"      element={<Datos />} />
            <Route path="/optimizar"  element={<Optimizar />} />
            <Route path="/horario"    element={<Horario />} />
            <Route path="/acerca-de"  element={<AcercaDe />} />
            <Route path="*"           element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </SiteProvider>
  )
}
