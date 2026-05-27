import { useState } from 'react'
import { useSite } from '../../Context/SiteContext'
import './Datos.css'

const TABS = ['Materias', 'Profesores', 'Salones', 'Franjas']

export default function Datos() {
  const [tab, setTab] = useState(0)
  const ctx = useSite()

  return (
    <div className="datos">
      <div className="datos-header">
        <h2 className="datos-title">🗄️ Gestión de Datos</h2>
        <div className="datos-acciones">
          <button className="datos-btn datos-btn--warn" onClick={ctx.resetearDatos}>
            🔄 Restaurar muestra
          </button>
        </div>
      </div>

      <div className="datos-tabs">
        {TABS.map((t, i) => (
          <button
            key={t}
            className={`datos-tab ${tab === i ? 'datos-tab--active' : ''}`}
            onClick={() => setTab(i)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="datos-content">
        {tab === 0 && <TabMaterias ctx={ctx} />}
        {tab === 1 && <TabProfesores ctx={ctx} />}
        {tab === 2 && <TabSalones ctx={ctx} />}
        {tab === 3 && <TabFranjas ctx={ctx} />}
      </div>
    </div>
  )
}

// ── MATERIAS ─────────────────────────────────────────────────────────────────

function TabMaterias({ ctx }) {
  const { materias, agregarMateria, editarMateria, eliminarMateria } = ctx
  const BLANK = { nombre: '', semestre: 1, grupo: 'A', creditos: 3, bloques: '2,2', num_alumnos: 30, requiere_laboratorio: false }
  const [form, setForm] = useState(BLANK)
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const body = {
      nombre:               form.nombre.trim(),
      semestre:             Number(form.semestre),
      grupo:                form.grupo.toUpperCase(),
      creditos:             Number(form.creditos),
      bloques:              form.bloques.split(',').map(b => Number(b.trim())).filter(Boolean),
      num_alumnos:          Number(form.num_alumnos),
      requiere_laboratorio: Boolean(form.requiere_laboratorio),
    }
    try {
      if (editId) { await editarMateria(editId, body); setEditId(null) }
      else          await agregarMateria(body)
      setForm(BLANK)
    } catch (e) { setError(e.message) }
  }

  const handleEdit = (m) => {
    setEditId(m.id)
    setForm({ nombre: m.nombre, semestre: m.semestre, grupo: m.grupo, creditos: m.creditos,
              bloques: m.bloques.join(','), num_alumnos: m.num_alumnos ?? 30,
              requiere_laboratorio: m.requiere_laboratorio ?? false })
  }

  return (
    <div className="tab-section">
      <form className="datos-form" onSubmit={handleSubmit}>
        <h3 className="form-title">{editId ? 'Editar materia' : 'Nueva materia'}</h3>
        {error && <p className="form-error">{error}</p>}
        <div className="form-grid">
          <div className="form-field form-field--wide">
            <label>Nombre</label>
            <input value={form.nombre} onChange={e => setForm(p => ({...p, nombre: e.target.value}))} required />
          </div>
          <div className="form-field">
            <label>Semestre</label>
            <input type="number" min={1} max={10} value={form.semestre}
              onChange={e => setForm(p => ({...p, semestre: e.target.value}))} />
          </div>
          <div className="form-field">
            <label>Grupo</label>
            <input maxLength={2} value={form.grupo}
              onChange={e => setForm(p => ({...p, grupo: e.target.value}))} />
          </div>
          <div className="form-field">
            <label>Créditos</label>
            <input type="number" min={1} max={10} value={form.creditos}
              onChange={e => setForm(p => ({...p, creditos: e.target.value}))} />
          </div>
          <div className="form-field">
            <label>Bloques (ej: 3,2)</label>
            <input value={form.bloques} onChange={e => setForm(p => ({...p, bloques: e.target.value}))} placeholder="2,2" />
          </div>
          <div className="form-field">
            <label>Nº alumnos</label>
            <input type="number" min={1} max={500} value={form.num_alumnos}
              onChange={e => setForm(p => ({...p, num_alumnos: e.target.value}))} />
          </div>
          <div className="form-field form-field--check">
            <label className="check-inline">
              <input type="checkbox" checked={form.requiere_laboratorio}
                onChange={e => setForm(p => ({...p, requiere_laboratorio: e.target.checked}))} />
              Requiere laboratorio
            </label>
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="datos-btn datos-btn--primary">
            {editId ? '💾 Guardar' : '➕ Agregar'}
          </button>
          {editId && (
            <button type="button" className="datos-btn datos-btn--secondary"
              onClick={() => { setEditId(null); setForm(BLANK) }}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="datos-list">
        <p className="datos-count">{materias.length} materia(s)</p>
        <div className="datos-table-wrap">
          <table className="datos-table">
            <thead>
              <tr><th>Nombre</th><th>Sem.</th><th>Gr.</th><th>Cred.</th><th>Bloques</th><th>Alumnos</th><th>Lab.</th><th></th></tr>
            </thead>
            <tbody>
              {materias.map(m => (
                <tr key={m.id}>
                  <td>{m.nombre}</td>
                  <td>{m.semestre}</td>
                  <td>{m.grupo}</td>
                  <td>{m.creditos}</td>
                  <td>{m.bloques?.join(', ')}</td>
                  <td>{m.num_alumnos ?? 30}</td>
                  <td>{m.requiere_laboratorio ? '🔬' : '—'}</td>
                  <td>
                    <button className="tbl-btn" onClick={() => handleEdit(m)}>✏️</button>
                    <button className="tbl-btn" onClick={() => eliminarMateria(m.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── PROFESORES ────────────────────────────────────────────────────────────────

function TabProfesores({ ctx }) {
  const { profesores, materias, franjas, agregarProfesor, editarProfesor, eliminarProfesor } = ctx
  const BLANK = { nombre: '', materias_ids: [], franjas_preferidas: [], franjas_bloqueadas: [] }
  const [form, setForm]     = useState(BLANK)
  const [editId, setEditId] = useState(null)
  const [error, setError]   = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const body = {
        nombre:             form.nombre.trim(),
        materias_ids:       form.materias_ids,
        franjas_preferidas: form.franjas_preferidas,
        franjas_bloqueadas: form.franjas_bloqueadas,
      }
      if (editId) { await editarProfesor(editId, body); setEditId(null) }
      else          await agregarProfesor(body)
      setForm(BLANK)
    } catch (e) { setError(e.message) }
  }

  const toggleId = (key, id) => {
    setForm(p => ({
      ...p,
      [key]: p[key].includes(id) ? p[key].filter(x => x !== id) : [...p[key], id],
    }))
  }

  const handleEdit = (p) => {
    setEditId(p.id)
    setForm({ nombre: p.nombre, materias_ids: p.materias_ids || [],
              franjas_preferidas: p.franjas_preferidas || [],
              franjas_bloqueadas: p.franjas_bloqueadas || [] })
  }

  return (
    <div className="tab-section">
      <form className="datos-form" onSubmit={handleSubmit}>
        <h3 className="form-title">{editId ? 'Editar profesor' : 'Nuevo profesor'}</h3>
        {error && <p className="form-error">{error}</p>}
        <div className="form-grid">
          <div className="form-field form-field--wide">
            <label>Nombre</label>
            <input value={form.nombre} onChange={e => setForm(p => ({...p, nombre: e.target.value}))} required />
          </div>
        </div>

        <div className="form-field">
          <label>Materias que dicta</label>
          <div className="multi-check">
            {materias.map(m => (
              <label key={m.id} className="check-item">
                <input type="checkbox"
                  checked={form.materias_ids.includes(m.id)}
                  onChange={() => toggleId('materias_ids', m.id)}
                />
                {m.nombre} ({m.grupo})
              </label>
            ))}
          </div>
        </div>

        {franjas.length > 0 && (
          <div className="form-two-col">
            <div className="form-field">
              <label>Franjas preferidas <span className="form-label-hint">+bonus fitness</span></label>
              <div className="multi-check multi-check--sm">
                {franjas.map(f => (
                  <label key={f.id} className="check-item">
                    <input type="checkbox"
                      checked={form.franjas_preferidas.includes(f.id)}
                      onChange={() => toggleId('franjas_preferidas', f.id)}
                    />
                    {f.dia} {f.hora_inicio}
                  </label>
                ))}
              </div>
            </div>
            <div className="form-field">
              <label>Franjas bloqueadas <span className="form-label-hint form-label-hint--red">restricción dura</span></label>
              <div className="multi-check multi-check--sm">
                {franjas.map(f => (
                  <label key={f.id} className="check-item check-item--blocked">
                    <input type="checkbox"
                      checked={form.franjas_bloqueadas.includes(f.id)}
                      onChange={() => toggleId('franjas_bloqueadas', f.id)}
                    />
                    {f.dia} {f.hora_inicio}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="datos-btn datos-btn--primary">
            {editId ? '💾 Guardar' : '➕ Agregar'}
          </button>
          {editId && (
            <button type="button" className="datos-btn datos-btn--secondary"
              onClick={() => { setEditId(null); setForm(BLANK) }}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="datos-list">
        <p className="datos-count">{profesores.length} profesor(es)</p>
        <div className="datos-table-wrap">
          <table className="datos-table">
            <thead>
              <tr><th>Nombre</th><th>Materias asignadas</th><th>Pref.</th><th>Bloq.</th><th></th></tr>
            </thead>
            <tbody>
              {profesores.map(p => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td className="td-list">{p.materias_ids?.map(id => materias.find(m => m.id === id)?.nombre).filter(Boolean).join(', ') || '—'}</td>
                  <td>{p.franjas_preferidas?.length || 0}</td>
                  <td>{p.franjas_bloqueadas?.length || 0}</td>
                  <td>
                    <button className="tbl-btn" onClick={() => handleEdit(p)}>✏️</button>
                    <button className="tbl-btn" onClick={() => eliminarProfesor(p.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── SALONES ───────────────────────────────────────────────────────────────────

const TIPO_OPTS  = ['aula', 'laboratorio', 'auditorio']
const TIPO_ICONS = { aula: '🏫', laboratorio: '🔬', auditorio: '🎭' }

function TabSalones({ ctx }) {
  const { salones, agregarSalon, editarSalon, eliminarSalon } = ctx
  const BLANK = { nombre: '', capacidad: 30, tipo: 'aula' }
  const [form, setForm]     = useState(BLANK)
  const [editId, setEditId] = useState(null)
  const [error, setError]   = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const body = { nombre: form.nombre.trim(), capacidad: Number(form.capacidad), tipo: form.tipo }
      if (editId) { await editarSalon(editId, body); setEditId(null) }
      else          await agregarSalon(body)
      setForm(BLANK)
    } catch (e) { setError(e.message) }
  }

  const handleEdit = (s) => { setEditId(s.id); setForm({ nombre: s.nombre, capacidad: s.capacidad, tipo: s.tipo || 'aula' }) }

  return (
    <div className="tab-section">
      <form className="datos-form" onSubmit={handleSubmit}>
        <h3 className="form-title">{editId ? 'Editar salón' : 'Nuevo salón'}</h3>
        {error && <p className="form-error">{error}</p>}
        <div className="form-grid">
          <div className="form-field form-field--wide">
            <label>Nombre</label>
            <input value={form.nombre} onChange={e => setForm(p => ({...p, nombre: e.target.value}))} required />
          </div>
          <div className="form-field">
            <label>Capacidad</label>
            <input type="number" min={1} value={form.capacidad}
              onChange={e => setForm(p => ({...p, capacidad: e.target.value}))} />
          </div>
          <div className="form-field">
            <label>Tipo</label>
            <select value={form.tipo} onChange={e => setForm(p => ({...p, tipo: e.target.value}))}>
              {TIPO_OPTS.map(t => (
                <option key={t} value={t}>{TIPO_ICONS[t]} {t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="datos-btn datos-btn--primary">{editId ? '💾 Guardar' : '➕ Agregar'}</button>
          {editId && <button type="button" className="datos-btn datos-btn--secondary"
            onClick={() => { setEditId(null); setForm(BLANK) }}>Cancelar</button>}
        </div>
      </form>

      <div className="datos-list">
        <p className="datos-count">{salones.length} salón(es)</p>
        <div className="datos-table-wrap">
          <table className="datos-table">
            <thead><tr><th>Nombre</th><th>Capacidad</th><th>Tipo</th><th></th></tr></thead>
            <tbody>
              {salones.map(s => (
                <tr key={s.id}>
                  <td>{s.nombre}</td>
                  <td>{s.capacidad}</td>
                  <td>
                    <span className={`tipo-badge tipo-badge--${s.tipo || 'aula'}`}>
                      {TIPO_ICONS[s.tipo || 'aula']} {s.tipo || 'aula'}
                    </span>
                  </td>
                  <td>
                    <button className="tbl-btn" onClick={() => handleEdit(s)}>✏️</button>
                    <button className="tbl-btn" onClick={() => eliminarSalon(s.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── FRANJAS ───────────────────────────────────────────────────────────────────

const DIAS_OPT = ['Lunes','Martes','Miércoles','Jueves','Viernes']

function TabFranjas({ ctx }) {
  const { franjas, agregarFranja, editarFranja, eliminarFranja } = ctx
  const BLANK = { dia: 'Lunes', hora_inicio: '08:00', hora_fin: '10:00' }
  const [form, setForm]     = useState(BLANK)
  const [editId, setEditId] = useState(null)
  const [error, setError]   = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editId) { await editarFranja(editId, form); setEditId(null) }
      else          await agregarFranja(form)
      setForm(BLANK)
    } catch (e) { setError(e.message) }
  }

  const handleEdit = (f) => { setEditId(f.id); setForm({ dia: f.dia, hora_inicio: f.hora_inicio, hora_fin: f.hora_fin }) }

  return (
    <div className="tab-section">
      <form className="datos-form" onSubmit={handleSubmit}>
        <h3 className="form-title">{editId ? 'Editar franja' : 'Nueva franja'}</h3>
        {error && <p className="form-error">{error}</p>}
        <div className="form-grid">
          <div className="form-field">
            <label>Día</label>
            <select value={form.dia} onChange={e => setForm(p => ({...p, dia: e.target.value}))}>
              {DIAS_OPT.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="form-field">
            <label>Hora inicio</label>
            <input type="time" value={form.hora_inicio} onChange={e => setForm(p => ({...p, hora_inicio: e.target.value}))} />
          </div>
          <div className="form-field">
            <label>Hora fin</label>
            <input type="time" value={form.hora_fin} onChange={e => setForm(p => ({...p, hora_fin: e.target.value}))} />
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="datos-btn datos-btn--primary">{editId ? '💾 Guardar' : '➕ Agregar'}</button>
          {editId && <button type="button" className="datos-btn datos-btn--secondary"
            onClick={() => { setEditId(null); setForm(BLANK) }}>Cancelar</button>}
        </div>
      </form>

      <div className="datos-list">
        <p className="datos-count">{franjas.length} franja(s)</p>
        <div className="datos-table-wrap">
          <table className="datos-table">
            <thead><tr><th>Día</th><th>Hora inicio</th><th>Hora fin</th><th></th></tr></thead>
            <tbody>
              {franjas.map(f => (
                <tr key={f.id}>
                  <td>{f.dia}</td><td>{f.hora_inicio}</td><td>{f.hora_fin}</td>
                  <td>
                    <button className="tbl-btn" onClick={() => handleEdit(f)}>✏️</button>
                    <button className="tbl-btn" onClick={() => eliminarFranja(f.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
