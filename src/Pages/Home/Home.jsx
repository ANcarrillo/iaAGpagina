import { useNavigate } from 'react-router-dom'
import { useSite } from '../../Context/SiteContext'
import StatCard from '../../Components/StatCard/StatCard'
import './Home.css'

export default function Home() {
  const navigate = useNavigate()
  const { materias, profesores, salones, franjas, sesiones, resumen, loadingData, errorData } = useSite()

  if (loadingData) return <div className="home-loading">Cargando datos...</div>
  if (errorData)   return <div className="home-error">Error: {errorData}</div>

  const listo = resumen.listo_para_optimizar

  return (
    <div className="home">
      <div className="home-hero">
        <h1 className="home-hero-title">🧬 Optimización de Horarios</h1>
        <p className="home-hero-sub">
          Algoritmos Genéticos · Universidad de la Amazonia · Ingeniería de Sistemas
        </p>
        <div className={`home-badge ${listo ? 'home-badge--ok' : 'home-badge--warn'}`}>
          {listo ? '✅ Listo para optimizar' : '⚠️ Faltan datos para optimizar'}
        </div>
      </div>

      <div className="home-stats">
        <StatCard icon="📚" label="Materias"    value={materias.length}   color="azul" />
        <StatCard icon="👨‍🏫" label="Profesores"  value={profesores.length} color="verde" />
        <StatCard icon="🏫" label="Salones"     value={salones.length}    color="naranja" />
        <StatCard icon="🕐" label="Franjas"     value={franjas.length}    color="azul" />
        <StatCard icon="📋" label="Sesiones"    value={sesiones.length}   color="verde" />
        <StatCard icon="🔲" label="Ranuras"     value={resumen.total_ranuras || 0} color="naranja" />
      </div>

      {resumen.semestres_disponibles?.length > 0 && (
        <div className="home-semestres">
          <h3 className="home-section-title">Semestres cargados</h3>
          <div className="home-chips">
            {resumen.semestres_disponibles.map(s => (
              <span key={s} className="home-chip">Semestre {s}</span>
            ))}
          </div>
        </div>
      )}

      <div className="home-actions">
        <button className="home-btn home-btn--primary" onClick={() => navigate('/datos')}>
          🗄️ Gestionar datos
        </button>
        <button
          className="home-btn home-btn--success"
          onClick={() => navigate('/optimizar')}
          disabled={!listo}
        >
          🧬 Iniciar optimización
        </button>
      </div>

      <div className="home-info-grid">
        <div className="home-info-card">
          <h3>¿Qué hace el sistema?</h3>
          <p>
            Genera automáticamente un horario universitario óptimo usando algoritmos genéticos.
            Asigna cada clase a un salón y franja horaria evitando conflictos de profesores y grupos.
          </p>
        </div>
        <div className="home-info-card">
          <h3>¿Cómo funciona?</h3>
          <p>
            Evoluciona una población de 100 horarios durante 200 generaciones, combinando
            cruzamiento OX, mutación swap y elitismo para converger hacia soluciones sin conflictos.
          </p>
        </div>
        <div className="home-info-card">
          <h3>¿Qué controlas?</h3>
          <p>
            Materias, profesores, salones y franjas horarias. También los parámetros del AG:
            tamaño de población, generaciones, probabilidades de cruce y mutación.
          </p>
        </div>
      </div>
    </div>
  )
}
