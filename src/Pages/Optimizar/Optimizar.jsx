import { useSite } from '../../Context/SiteContext'
import FitnessChart from '../../Components/FitnessChart/FitnessChart'
import ScheduleGrid from '../../Components/ScheduleGrid/ScheduleGrid'
import './Optimizar.css'

const PRESETS = [
  { label: '⚡ 1 Semestre',      sub: 'Pob:60  Gen:150',  vals: { tam_poblacion:60,  num_generaciones:150, prob_cruzamiento:0.85, prob_mutacion:0.10, num_elite:3, paciencia:20 } },
  { label: '⚖️ 2–4 Semestres',   sub: 'Pob:100  Gen:250', vals: { tam_poblacion:100, num_generaciones:250, prob_cruzamiento:0.85, prob_mutacion:0.12, num_elite:4, paciencia:30 } },
  { label: '🔬 Pensum Completo', sub: 'Pob:200  Gen:500', vals: { tam_poblacion:200, num_generaciones:500, prob_cruzamiento:0.90, prob_mutacion:0.15, num_elite:5, paciencia:50 } },
]

export default function Optimizar() {
  const {
    params, actualizarParams, toggleSemestre,
    optStatus, historial, horarioFinal, mejorFitness,
    conflictos, conflictosDetalle, razonParada, generaciones, errorOpt,
    iniciarOptimizacion, reiniciarOptimizacion,
    materias, franjas, salones, semestresDisponibles,
  } = useSite()

  const aplicarPreset = (vals) => {
    Object.entries(vals).forEach(([k, v]) => actualizarParams(k, v))
  }

  const running = optStatus === 'running'
  const done    = optStatus === 'done'
  const error   = optStatus === 'error'

  const razonTexto = {
    optimo_encontrado: '✅ ¡Solución óptima encontrada! El horario no tiene conflictos.',
    estancamiento:     '⏸️ Parada por estancamiento: el fitness no mejoró en las últimas generaciones.',
  }[razonParada] || '✔️ Optimización completada. Se ejecutaron todas las generaciones.'

  return (
    <div className="opt">
      <h2 className="opt-title">🧬 Algoritmo Genético</h2>

      {/* ── Parámetros ──────────────────────────────────────────────── */}
      <div className="opt-card">
        <h3 className="opt-card-title">Parámetros</h3>

        {semestresDisponibles.length > 1 && (
          <div className="opt-semestres">
            <p className="opt-label">Semestres a optimizar:</p>
            <div className="opt-chips">
              {semestresDisponibles.map(s => (
                <button
                  key={s}
                  className={`opt-chip ${params.semestres_filtro.includes(s) ? 'opt-chip--active' : ''}`}
                  onClick={() => !running && toggleSemestre(s)}
                  disabled={running}
                >
                  Sem {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <p className="opt-label" style={{marginTop: 12}}>Presets rápidos:</p>
        <div className="opt-presets">
          {PRESETS.map(p => (
            <button key={p.label} className="opt-preset" onClick={() => !running && aplicarPreset(p.vals)} disabled={running}>
              <span className="opt-preset-label">{p.label}</span>
              <span className="opt-preset-sub">{p.sub}</span>
            </button>
          ))}
        </div>

        <div className="opt-sliders">
          <SliderRow label="Población"        value={params.tam_poblacion}    min={20}  max={300} step={10}   disabled={running} onChange={v => actualizarParams('tam_poblacion', v)} />
          <SliderRow label="Generaciones"     value={params.num_generaciones} min={50}  max={500} step={10}   disabled={running} onChange={v => actualizarParams('num_generaciones', v)} />
          <SliderRow label="P. Cruzamiento"   value={params.prob_cruzamiento} min={0.3} max={1.0} step={0.05} disabled={running} onChange={v => actualizarParams('prob_cruzamiento', v)} fmt="pct" />
          <SliderRow label="P. Mutación"      value={params.prob_mutacion}    min={0.01}max={0.5} step={0.01} disabled={running} onChange={v => actualizarParams('prob_mutacion', v)} fmt="pct" />
          <SliderRow label="Élite"            value={params.num_elite}        min={0}   max={10}  step={1}    disabled={running} onChange={v => actualizarParams('num_elite', v)} />
          <SliderRow label="Paciencia"        value={params.paciencia}        min={5}   max={100} step={5}    disabled={running} onChange={v => actualizarParams('paciencia', v)} />
        </div>

        <div className="opt-form-actions">
          {!running && (
            <button className="opt-btn opt-btn--start" onClick={iniciarOptimizacion}>
              ▶ Iniciar algoritmo
            </button>
          )}
          {running && (
            <button className="opt-btn opt-btn--stop" onClick={reiniciarOptimizacion}>
              ⏹ Detener
            </button>
          )}
          {(done || error) && (
            <button className="opt-btn opt-btn--reset" onClick={reiniciarOptimizacion}>
              🔄 Reiniciar
            </button>
          )}
        </div>
      </div>

      {/* ── Progreso ─────────────────────────────────────────────────── */}
      {running && (
        <div className="opt-card opt-card--running">
          <div className="opt-spinner-row">
            <span className="opt-spinner" />
            <span>Optimizando… por favor espera.</span>
          </div>
          <div className="opt-progress-bar"><div className="opt-progress-bar-inner opt-progress-bar--indeterminate" /></div>
        </div>
      )}

      {done && (
        <div className="opt-card opt-card--done">
          <div className="opt-result-stats">
            <div className="opt-stat"><p className="opt-stat-val">{generaciones}</p><p className="opt-stat-lbl">Generaciones</p></div>
            <div className="opt-stat"><p className="opt-stat-val">{Math.round(mejorFitness)}</p><p className="opt-stat-lbl">Mejor fitness</p></div>
            <div className={`opt-stat ${conflictos === 0 ? 'opt-stat--ok' : 'opt-stat--err'}`}>
              <p className="opt-stat-val">{conflictos}</p><p className="opt-stat-lbl">Conflictos</p>
            </div>
          </div>
          <p className="opt-razon">{razonTexto}</p>
          <div className="opt-progress-bar"><div className="opt-progress-bar-inner" style={{width:'100%'}} /></div>
        </div>
      )}

      {error && (
        <div className="opt-card opt-card--error">
          <p>❌ {errorOpt}</p>
        </div>
      )}

      {/* ── Conflictos ───────────────────────────────────────────────── */}
      {done && conflictosDetalle.length > 0 && (
        <div className="opt-card opt-card--conflicts">
          <h3 className="opt-card-title">⚠️ {conflictosDetalle.length} conflicto(s) detectado(s)</h3>
          <div className="conflict-list">
            {conflictosDetalle.map((c, i) => (
              <ConflictoItem key={i} idx={i+1} c={c} />
            ))}
          </div>
        </div>
      )}

      {/* ── Gráfica ──────────────────────────────────────────────────── */}
      {(done || historial.length > 0) && (
        <div className="opt-card">
          <h3 className="opt-card-title">📈 Convergencia del fitness</h3>
          <FitnessChart historial={historial} />
        </div>
      )}

      {/* ── Horario final ─────────────────────────────────────────────── */}
      {done && horarioFinal.length > 0 && (
        <div className="opt-card">
          <h3 className="opt-card-title">📅 Mejor horario — Gen. {generaciones}</h3>
          <p className="opt-subtitle">Fitness: {Math.round(mejorFitness)}  ·  Conflictos: {conflictos}</p>
          <ScheduleGrid horario={horarioFinal} />
        </div>
      )}
    </div>
  )
}

function SliderRow({ label, value, min, max, step, disabled, onChange, fmt }) {
  const display = fmt === 'pct' ? `${Math.round(value * 100)}%` : value
  return (
    <div className="slider-row">
      <span className="slider-label">{label}</span>
      <input
        type="range" min={min} max={max} step={step}
        value={value} disabled={disabled}
        onChange={e => onChange(Number(e.target.value))}
        className="slider-input"
      />
      <span className="slider-val">{display}</span>
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
  profesor:          'Docente',
  grupo:             'Grupo',
  materia_mismo_dia: 'Misma materia',
  horario_invalido:  'Fuera de jornada',
}

function ConflictoItem({ idx, c }) {
  const color = CONFLICTO_COLORES[c.tipo] || '#333'
  const label = CONFLICTO_LABELS[c.tipo]  || c.tipo

  return (
    <div className="conflict-item" style={{ borderLeftColor: color }}>
      <p className="conflict-title" style={{ color }}>#{idx} · {label} — {c.dia}</p>
      {(c.tipo === 'profesor' || c.tipo === 'grupo') && c.sesion_a && (
        <div className="conflict-body">
          <p><strong>A:</strong> {c.sesion_a.materia} {c.sesion_a.hora_inicio}–{c.sesion_a.hora_fin} · {c.sesion_a.salon}</p>
          <p><strong>B:</strong> {c.sesion_b.materia} {c.sesion_b.hora_inicio}–{c.sesion_b.hora_fin} · {c.sesion_b.salon}</p>
          {c.hora_solapamiento && <p>Solapamiento: {c.hora_solapamiento}</p>}
        </div>
      )}
    </div>
  )
}
