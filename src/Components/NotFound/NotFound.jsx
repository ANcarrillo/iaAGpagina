import { Link } from 'react-router-dom'
import './NotFound.css'

export default function NotFound() {
  return (
    <div className="notfound">
      <span className="notfound-icon">🔍</span>
      <h1 className="notfound-title">404</h1>
      <p className="notfound-msg">Página no encontrada</p>
      <Link to="/" className="notfound-btn">Ir al inicio</Link>
    </div>
  )
}
