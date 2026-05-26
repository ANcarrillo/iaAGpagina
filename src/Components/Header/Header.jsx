import { NavLink } from 'react-router-dom'
import { useEffect } from 'react'
import { useSite } from '../../Context/SiteContext'
import './Header.css'

const LINKS = [
  { to: '/',          label: 'Inicio',     icon: '🏠' },
  { to: '/datos',     label: 'Datos',      icon: '🗄️' },
  { to: '/optimizar', label: 'Optimizar',  icon: '🧬' },
  { to: '/horario',   label: 'Horario',    icon: '📅' },
  { to: '/acerca-de', label: 'Acerca de',  icon: 'ℹ️' },
]

export default function Header() {
  const { cargarTodo } = useSite()

  useEffect(() => {
    cargarTodo()
  }, [])

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <span className="header-logo">🧬</span>
          <div>
            <p className="header-title">Horario Genético</p>
            <p className="header-subtitle">Universidad de la Amazonia</p>
          </div>
        </div>

        <nav className="header-nav">
          {LINKS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                'header-link' + (isActive ? ' header-link--active' : '')
              }
            >
              <span className="header-link-icon">{icon}</span>
              <span className="header-link-label">{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
