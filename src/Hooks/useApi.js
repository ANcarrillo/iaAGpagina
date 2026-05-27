const BASE_URL = 'https://giecom.com.co/HorarioGenetico'
// Desarrollo local → cambiar a:
// const BASE_URL = 'http://localhost:8000'

async function request(path, options = {}, timeout = 30000) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    signal: controller.signal,
    ...options,
  })
  clearTimeout(id)

  if (!res.ok) {
    let detail = `Error ${res.status}`
    try {
      const body = await res.json()
      detail = body.detail || detail
    } catch (_) {}
    throw new Error(detail)
  }

  const text = await res.text()
  return text ? JSON.parse(text) : null
}

export default function useApi() {
  return {
    // ── General ──────────────────────────────────────────────────────
    getDatos:    () => request('/api/datos'),
    getAcercaDe: () => request('/api/acerca-de'),
    resetDatos:  () => request('/api/datos/reset', { method: 'POST', body: '{}' }),

    // ── Materias ──────────────────────────────────────────────────────
    getMaterias:    ()        => request('/api/materias'),
    createMateria:  (body)    => request('/api/materias',     { method: 'POST',   body: JSON.stringify(body) }),
    updateMateria:  (id, body)=> request(`/api/materias/${id}`,{ method: 'PUT',    body: JSON.stringify(body) }),
    deleteMateria:  (id)      => request(`/api/materias/${id}`,{ method: 'DELETE' }),

    // ── Profesores ────────────────────────────────────────────────────
    getProfesores:   ()        => request('/api/profesores'),
    createProfesor:  (body)    => request('/api/profesores',     { method: 'POST',   body: JSON.stringify(body) }),
    updateProfesor:  (id, body)=> request(`/api/profesores/${id}`,{ method: 'PUT',    body: JSON.stringify(body) }),
    deleteProfesor:  (id)      => request(`/api/profesores/${id}`,{ method: 'DELETE' }),

    // ── Salones ───────────────────────────────────────────────────────
    getSalones:   ()        => request('/api/salones'),
    createSalon:  (body)    => request('/api/salones',     { method: 'POST',   body: JSON.stringify(body) }),
    updateSalon:  (id, body)=> request(`/api/salones/${id}`,{ method: 'PUT',    body: JSON.stringify(body) }),
    deleteSalon:  (id)      => request(`/api/salones/${id}`,{ method: 'DELETE' }),

    // ── Franjas ───────────────────────────────────────────────────────
    getFranjas:   ()        => request('/api/franjas'),
    createFranja: (body)    => request('/api/franjas',     { method: 'POST',   body: JSON.stringify(body) }),
    updateFranja: (id, body)=> request(`/api/franjas/${id}`,{ method: 'PUT',    body: JSON.stringify(body) }),
    deleteFranja: (id)      => request(`/api/franjas/${id}`,{ method: 'DELETE' }),

    // ── Sesiones ──────────────────────────────────────────────────────
    getSesiones: () => request('/api/sesiones'),

    // ── Importar ──────────────────────────────────────────────────────
    importarDatos: (body) => request('/api/importar', { method: 'POST', body: JSON.stringify(body) }),

    // ── Optimizar ─────────────────────────────────────────────────────
    optimizar: (body) => request('/api/optimizar', { method: 'POST', body: JSON.stringify(body) }, 600000),

    // ── Último horario y estadísticas ─────────────────────────────────
    getUltimoHorario: () => request('/api/ultimo-horario'),
    getEstadisticas:  () => request('/api/estadisticas'),
  }
}
