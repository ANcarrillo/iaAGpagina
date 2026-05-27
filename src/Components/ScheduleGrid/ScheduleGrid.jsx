import './ScheduleGrid.css'

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']

const COLORES_GRUPO = {
  A: '#1565C0', B: '#2E7D32', C: '#E65100', D: '#6A1B9A', E: '#00838F',
}

const TIPO_ICON = { laboratorio: '🔬', auditorio: '🎭' }

function colorGrupo(grupo) {
  return COLORES_GRUPO[grupo] || '#455A64'
}

export default function ScheduleGrid({ horario }) {
  if (!horario || horario.length === 0) {
    return <p className="sgrid-empty">No hay horario para mostrar.</p>
  }

  // Agrupar por día
  const porDia = {}
  DIAS.forEach(d => { porDia[d] = [] })
  horario.forEach(a => {
    if (porDia[a.dia]) porDia[a.dia].push(a)
    else porDia[a.dia] = [a]
  })

  // Ordenar por hora_inicio
  DIAS.forEach(d => {
    porDia[d].sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio))
  })

  return (
    <div className="sgrid-scroll">
      <table className="sgrid-table">
        <thead>
          <tr>
            {DIAS.map(d => (
              <th key={d} className="sgrid-th">{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {DIAS.map(d => (
              <td key={d} className="sgrid-td">
                {porDia[d].length === 0
                  ? <span className="sgrid-empty-cell">—</span>
                  : porDia[d].map((a, i) => (
                    <div
                      key={i}
                      className="sgrid-card"
                      style={{ borderLeftColor: colorGrupo(a.grupo) }}
                    >
                      <p className="sgrid-materia">{a.materia}</p>
                      <p className="sgrid-detalle">{a.hora_inicio} – {a.hora_fin}</p>
                      <p className="sgrid-detalle">{a.salon}</p>
                      <p className="sgrid-detalle">{a.profesor}</p>
                      <div className="sgrid-row-footer">
                        <span
                          className="sgrid-grupo"
                          style={{ background: colorGrupo(a.grupo) }}
                        >
                          Gr.{a.grupo} · Sem.{a.semestre}
                        </span>
                        {TIPO_ICON[a.salon_tipo] && (
                          <span className="sgrid-tipo" title={a.salon_tipo}>
                            {TIPO_ICON[a.salon_tipo]}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                }
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
