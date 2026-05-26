import { useSite } from '../../Context/SiteContext'
import ScheduleGrid from '../../Components/ScheduleGrid/ScheduleGrid'
import FitnessChart from '../../Components/FitnessChart/FitnessChart'
import { useNavigate } from 'react-router-dom'
import './Horario.css'

export default function Horario() {
  const {
    optStatus, horarioFinal, mejorFitness,
    conflictos, generaciones, historial,
    conflictosDetalle, razonParada,
  } = useSite()

  const navigate = useNavigate()
  const done = optStatus === 'done'

  const razonTexto = {
    optimo_encontrado: '✅ Solución óptima — sin conflictos.',
    estancamiento:     '⏸️ Parada por estancamiento.',
  }[razonParada] || '✔️ Todas las generaciones ejecutadas.'

  if (!done || horarioFinal.length === 0) {
    return (
      <div className="horario">
        <h2 className="horario-title">📅 Horario Optimizado</h2>
        <div className="horario-empty">
          <span className="horario-empty-icon">🗓️</span>
          <p className="horario-empty-msg">Aún no hay un horario generado.</p>
          <p className="horario-empty-sub">
            Ve a la sección de <strong>Algoritmo Genético</strong> y ejecuta la optimización para ver el resultado aquí.
          </p>
          <button className="horario-btn horario-btn--primary" onClick={() => navigate('/optimizar')}>
            ▶ Ir a optimizar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="horario">
      <div className="horario-header">
        <h2 className="horario-title">📅 Horario Optimizado</h2>
        <button className="horario-btn horario-btn--secondary" onClick={() => navigate('/optimizar')}>
          🔄 Re-optimizar
        </button>
      </div>

      {/* ── Resumen ──────────────────────────────────────────────────── */}
      <div className="horario-summary">
        <div className="horario-stat">
          <span className="horario-stat-val">{generaciones}</span>
          <span className="horario-stat-lbl">Generaciones</span>
        </div>
        <div className="horario-stat">
          <span className="horario-stat-val">{Math.round(mejorFitness)}</span>
          <span className="horario-stat-lbl">Mejor fitness</span>
        </div>
        <div className={`horario-stat ${conflictos === 0 ? 'horario-stat--ok' : 'horario-stat--err'}`}>
          <span className="horario-stat-val">{conflictos}</span>
          <span className="horario-stat-lbl">Conflictos</span>
        </div>
        <div className="horario-stat">
          <span className="horario-stat-val">{horarioFinal.length}</span>
          <span className="horario-stat-lbl">Sesiones</span>
        </div>
      </div>

      <p className="horario-razon">{razonTexto}</p>

      {/* ── Conflictos ───────────────────────────────────────────────── */}
      {conflictosDetalle.length > 0 && (
        <div className="horario-card horario-card--warn">
          <h3 className="horario-card-title">⚠️ {conflictosDetalle.length} conflicto(s)</h3>
          <div className="horario-conflict-list">
            {conflictosDetalle.map((c, i) => (
              <ConflictRow key={i} idx={i + 1} c={c} />
            ))}
          </div>
        </div>
      )}

      {/* ── Tabla de horario ─────────────────────────────────────────── */}
      <div className="horario-card">
        <h3 className="horario-card-title">Distribución semanal</h3>
        <ScheduleGrid horario={horarioFinal} />
      </div>

      {/* ── Listado detallado ────────────────────────────────────────── */}
      <div className="horario-card">
        <h3 className="horario-card-title">Listado completo ({horarioFinal.length} sesiones)</h3>
        <div className="horario-table-wrap">
          <table className="horario-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Materia</th>
                <th>Grupo</th>
                <th>Sem.</th>
                <th>Docente</th>
                <th>Salón</th>
                <th>Día</th>
                <th>Inicio</th>
                <th>Fin</th>
              </tr>
            </thead>
            <tbody>
              {horarioFinal.map((s, i) => (
                <tr key={i}>
                  <td className="horario-td--num">{i + 1}</td>
                  <td>{s.materia}</td>
                  <td><span className="horario-grupo">{s.grupo}</span></td>
                  <td>{s.semestre}</td>
                  <td>{s.profesor}</td>
                  <td>{s.salon}</td>
                  <td>{s.dia}</td>
                  <td>{s.hora_inicio}</td>
                  <td>{s.hora_fin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Convergencia ─────────────────────────────────────────────── */}
      {historial.length > 0 && (
        <div className="horario-card">
          <h3 className="horario-card-title">📈 Convergencia del fitness</h3>
          <FitnessChart historial={historial} />
        </div>
      )}
    </div>
  )
}

const CONFLICTO_COLORES = {
  profesor:          '#C62828',
  grupo:             '#E65100',
  materia_mismo_dia: '#1565C0',
  horario_invalido:  '#6A1B9A',
}

const CONFLICTO_LABELS = {
  profesor:          'Docente duplicado',
  grupo:             'Grupo duplicado',
  materia_mismo_dia: 'Materia mismo día',
  horario_invalido:  'Fuera de jornada',
}

function ConflictRow({ idx, c }) {
  const color = CONFLICTO_COLORES[c.tipo] || '#555'
  const label = CONFLICTO_LABELS[c.tipo] || c.tipo
  return (
    <div className="horario-conflict-item" style={{ borderLeftColor: color }}>
      <span className="horario-conflict-title" style={{ color }}>#{idx} · {label} — {c.dia}</span>
      {(c.tipo === 'profesor' || c.tipo === 'grupo') && c.sesion_a && (
        <span className="horario-conflict-body">
          A: {c.sesion_a.materia} {c.sesion_a.hora_inicio}–{c.sesion_a.hora_fin} &nbsp;|&nbsp;
          B: {c.sesion_b.materia} {c.sesion_b.hora_inicio}–{c.sesion_b.hora_fin}
        </span>
      )}
    </div>
  )
}
