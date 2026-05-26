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
  const [form, setForm] = useState({ nombre: '', semestre: 1, grupo: 'A', creditos: 3, bloques: '2,2' })
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const body = {
      nombre:   form.nombre.trim(),
      semestre: Number(form.semestre),
      grupo:    form.grupo.toUpperCase(),
      creditos: Number(form.creditos),
      bloques:  form.bloques.split(',').map(b => Number(b.trim())).filter(Boolean),
    }
    try {
      if (editId) {
        await editarMateria(editId, body)
        setEditId(null)
      } else {
        await agregarMateria(body)
      }
      setForm({ nombre: '', semestre: 1, grupo: 'A', creditos: 3, bloques: '2,2' })
    } catch (e) { setError(e.message) }
  }

  const handleEdit = (m) => {
    setEditId(m.id)
    setForm({ nombre: m.nombre, semestre: m.semestre, grupo: m.grupo, creditos: m.creditos, bloques: m.bloques.join(',') })
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
            <input type="number" min={1} max={10} value={form.semestre} onChange={e => setForm(p => ({...p, semestre: e.target.value}))} />
          </div>
          <div className="form-field">
            <label>Grupo</label>
            <input maxLength={2} value={form.grupo} onChange={e => setForm(p => ({...p, grupo: e.target.value}))} />
          </div>
          <div className="form-field">
            <label>Créditos</label>
            <input type="number" min={1} max={10} value={form.creditos} onChange={e => setForm(p => ({...p, creditos: e.target.value}))} />
          </div>
          <div className="form-field">
            <label>Bloques (ej: 3,2)</label>
            <input value={form.bloques} onChange={e => setForm(p => ({...p, bloques: e.target.value}))} placeholder="2,2" />
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="datos-btn datos-btn--primary">
            {editId ? '💾 Guardar' : '➕ Agregar'}
          </button>
          {editId && (
            <button type="button" className="datos-btn datos-btn--secondary"
              onClick={() => { setEditId(null); setForm({ nombre: '', semestre: 1, grupo: 'A', creditos: 3, bloques: '2,2' }) }}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="datos-list">
        <p className="datos-count">{materias.length} materia(s)</p>
        <table className="datos-table">
          <thead><tr><th>Nombre</th><th>Sem.</th><th>Grupo</th><th>Créditos</th><th>Bloques</th><th></th></tr></thead>
          <tbody>
            {materias.map(m => (
              <tr key={m.id}>
                <td>{m.nombre}</td>
                <td>{m.semestre}</td>
                <td>{m.grupo}</td>
                <td>{m.creditos}</td>
                <td>{m.bloques?.join(', ')}</td>
                <td>
                  <button className="tbl-btn tbl-btn--edit" onClick={() => handleEdit(m)}>✏️</button>
                  <button className="tbl-btn tbl-btn--del"  onClick={() => eliminarMateria(m.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── PROFESORES ────────────────────────────────────────────────────────────────

function TabProfesores({ ctx }) {
  const { profesores, materias, agregarProfesor, editarProfesor, eliminarProfesor } = ctx
  const [form, setForm]   = useState({ nombre: '', materias_ids: [] })
  const [editId, setEditId] = useState(null)
  const [error, setError]   = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const body = { nombre: form.nombre.trim(), materias_ids: form.materias_ids, franjas_preferidas: [] }
      if (editId) { await editarProfesor(editId, body); setEditId(null) }
      else          await agregarProfesor(body)
      setForm({ nombre: '', materias_ids: [] })
    } catch (e) { setError(e.message) }
  }

  const toggleMateria = (id) => {
    setForm(p => ({
      ...p,
      materias_ids: p.materias_ids.includes(id)
        ? p.materias_ids.filter(x => x !== id)
        : [...p.materias_ids, id]
    }))
  }

  const handleEdit = (p) => {
    setEditId(p.id)
    setForm({ nombre: p.nombre, materias_ids: p.materias_ids || [] })
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
                  onChange={() => toggleMateria(m.id)}
                />
                {m.nombre} ({m.grupo})
              </label>
            ))}
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="datos-btn datos-btn--primary">
            {editId ? '💾 Guardar' : '➕ Agregar'}
          </button>
          {editId && (
            <button type="button" className="datos-btn datos-btn--secondary"
              onClick={() => { setEditId(null); setForm({ nombre: '', materias_ids: [] }) }}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="datos-list">
        <p className="datos-count">{profesores.length} profesor(es)</p>
        <table className="datos-table">
          <thead><tr><th>Nombre</th><th>Materias asignadas</th><th></th></tr></thead>
          <tbody>
            {profesores.map(p => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>{p.materias_ids?.map(id => materias.find(m => m.id === id)?.nombre).filter(Boolean).join(', ') || '—'}</td>
                <td>
                  <button className="tbl-btn tbl-btn--edit" onClick={() => handleEdit(p)}>✏️</button>
                  <button className="tbl-btn tbl-btn--del"  onClick={() => eliminarProfesor(p.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── SALONES ───────────────────────────────────────────────────────────────────

function TabSalones({ ctx }) {
  const { salones, agregarSalon, editarSalon, eliminarSalon } = ctx
  const [form, setForm]     = useState({ nombre: '', capacidad: 30 })
  const [editId, setEditId] = useState(null)
  const [error, setError]   = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const body = { nombre: form.nombre.trim(), capacidad: Number(form.capacidad) }
      if (editId) { await editarSalon(editId, body); setEditId(null) }
      else          await agregarSalon(body)
      setForm({ nombre: '', capacidad: 30 })
    } catch (e) { setError(e.message) }
  }

  const handleEdit = (s) => { setEditId(s.id); setForm({ nombre: s.nombre, capacidad: s.capacidad }) }

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
            <input type="number" min={1} value={form.capacidad} onChange={e => setForm(p => ({...p, capacidad: e.target.value}))} />
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="datos-btn datos-btn--primary">{editId ? '💾 Guardar' : '➕ Agregar'}</button>
          {editId && <button type="button" className="datos-btn datos-btn--secondary" onClick={() => { setEditId(null); setForm({ nombre: '', capacidad: 30 }) }}>Cancelar</button>}
        </div>
      </form>

      <div className="datos-list">
        <p className="datos-count">{salones.length} salón(es)</p>
        <table className="datos-table">
          <thead><tr><th>Nombre</th><th>Capacidad</th><th></th></tr></thead>
          <tbody>
            {salones.map(s => (
              <tr key={s.id}>
                <td>{s.nombre}</td><td>{s.capacidad}</td>
                <td>
                  <button className="tbl-btn tbl-btn--edit" onClick={() => handleEdit(s)}>✏️</button>
                  <button className="tbl-btn tbl-btn--del"  onClick={() => eliminarSalon(s.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── FRANJAS ───────────────────────────────────────────────────────────────────

const DIAS_OPT = ['Lunes','Martes','Miércoles','Jueves','Viernes']

function TabFranjas({ ctx }) {
  const { franjas, agregarFranja, editarFranja, eliminarFranja } = ctx
  const [form, setForm]     = useState({ dia: 'Lunes', hora_inicio: '08:00', hora_fin: '10:00' })
  const [editId, setEditId] = useState(null)
  const [error, setError]   = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editId) { await editarFranja(editId, form); setEditId(null) }
      else          await agregarFranja(form)
      setForm({ dia: 'Lunes', hora_inicio: '08:00', hora_fin: '10:00' })
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
          {editId && <button type="button" className="datos-btn datos-btn--secondary" onClick={() => { setEditId(null); setForm({ dia: 'Lunes', hora_inicio: '08:00', hora_fin: '10:00' }) }}>Cancelar</button>}
        </div>
      </form>

      <div className="datos-list">
        <p className="datos-count">{franjas.length} franja(s)</p>
        <table className="datos-table">
          <thead><tr><th>Día</th><th>Hora inicio</th><th>Hora fin</th><th></th></tr></thead>
          <tbody>
            {franjas.map(f => (
              <tr key={f.id}>
                <td>{f.dia}</td><td>{f.hora_inicio}</td><td>{f.hora_fin}</td>
                <td>
                  <button className="tbl-btn tbl-btn--edit" onClick={() => handleEdit(f)}>✏️</button>
                  <button className="tbl-btn tbl-btn--del"  onClick={() => eliminarFranja(f.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
