import { createContext, useContext, useState, useCallback } from 'react'
import useApi from '../Hooks/useApi'

const SiteContext = createContext(null)

export function SiteProvider({ children }) {
  const api = useApi()

  // ── Datos ──────────────────────────────────────────────────────────
  const [materias,   setMaterias]   = useState([])
  const [profesores, setProfesores] = useState([])
  const [salones,    setSalones]    = useState([])
  const [franjas,    setFranjas]    = useState([])
  const [sesiones,   setSesiones]   = useState([])
  const [resumen,    setResumen]    = useState({})
  const [loadingData, setLoadingData] = useState(false)
  const [errorData,   setErrorData]   = useState(null)

  // ── Optimización ───────────────────────────────────────────────────
  const [optStatus,    setOptStatus]    = useState('idle')   // idle | running | done | error
  const [historial,    setHistorial]    = useState([])
  const [horarioFinal, setHorarioFinal] = useState([])
  const [mejorFitness, setMejorFitness] = useState(0)
  const [conflictos,   setConflictos]   = useState(0)
  const [conflictosDetalle, setConflictosDetalle] = useState([])
  const [razonParada,  setRazonParada]  = useState('')
  const [generaciones, setGeneraciones] = useState(0)
  const [errorOpt,     setErrorOpt]     = useState(null)

  // Parámetros del AG
  const [params, setParams] = useState({
    tam_poblacion:    100,
    num_generaciones: 200,
    prob_cruzamiento: 0.85,
    prob_mutacion:    0.10,
    num_elite:        2,
    tam_torneo:       5,
    paciencia:        30,
    semestres_filtro: [],
  })

  // ── Cargar todos los datos ─────────────────────────────────────────
  const cargarTodo = useCallback(async () => {
    setLoadingData(true)
    setErrorData(null)
    try {
      const data = await api.getDatos()
      setMaterias(data.materias   || [])
      setProfesores(data.profesores || [])
      setSalones(data.salones     || [])
      setFranjas(data.franjas     || [])
      setSesiones(data.sesiones   || [])
      setResumen(data.resumen     || {})
    } catch (e) {
      setErrorData(e.message)
    } finally {
      setLoadingData(false)
    }
  }, [api])

  // ── CRUD Materias ──────────────────────────────────────────────────
  const agregarMateria = async (body) => {
    const m = await api.createMateria(body)
    setMaterias(prev => [...prev, m])
    await _refreshSesiones()
  }
  const editarMateria = async (id, body) => {
    const m = await api.updateMateria(id, body)
    setMaterias(prev => prev.map(x => x.id === id ? m : x))
    await _refreshSesiones()
  }
  const eliminarMateria = async (id) => {
    await api.deleteMateria(id)
    setMaterias(prev => prev.filter(x => x.id !== id))
    await _refreshSesiones()
  }

  // ── CRUD Profesores ────────────────────────────────────────────────
  const agregarProfesor = async (body) => {
    const p = await api.createProfesor(body)
    setProfesores(prev => [...prev, p])
    await _refreshSesiones()
  }
  const editarProfesor = async (id, body) => {
    const p = await api.updateProfesor(id, body)
    setProfesores(prev => prev.map(x => x.id === id ? p : x))
    await _refreshSesiones()
  }
  const eliminarProfesor = async (id) => {
    await api.deleteProfesor(id)
    setProfesores(prev => prev.filter(x => x.id !== id))
    await _refreshSesiones()
  }

  // ── CRUD Salones ───────────────────────────────────────────────────
  const agregarSalon = async (body) => {
    const s = await api.createSalon(body)
    setSalones(prev => [...prev, s])
  }
  const editarSalon = async (id, body) => {
    const s = await api.updateSalon(id, body)
    setSalones(prev => prev.map(x => x.id === id ? s : x))
  }
  const eliminarSalon = async (id) => {
    await api.deleteSalon(id)
    setSalones(prev => prev.filter(x => x.id !== id))
  }

  // ── CRUD Franjas ───────────────────────────────────────────────────
  const agregarFranja = async (body) => {
    const f = await api.createFranja(body)
    setFranjas(prev => [...prev, f])
  }
  const editarFranja = async (id, body) => {
    const f = await api.updateFranja(id, body)
    setFranjas(prev => prev.map(x => x.id === id ? f : x))
  }
  const eliminarFranja = async (id) => {
    await api.deleteFranja(id)
    setFranjas(prev => prev.filter(x => x.id !== id))
  }

  // ── Reset ──────────────────────────────────────────────────────────
  const resetearDatos = async () => {
    await api.resetDatos()
    await cargarTodo()
  }

  // ── Importar ───────────────────────────────────────────────────────
  const importarDatos = async (body) => {
    const resultado = await api.importarDatos(body)
    await cargarTodo()
    return resultado
  }

  // ── Optimizar ──────────────────────────────────────────────────────
  const iniciarOptimizacion = async () => {
    setOptStatus('running')
    setHistorial([])
    setHorarioFinal([])
    setMejorFitness(0)
    setConflictos(0)
    setConflictosDetalle([])
    setRazonParada('')
    setGeneraciones(0)
    setErrorOpt(null)

    try {
      const body = { ...params }
      if (!body.semestres_filtro || body.semestres_filtro.length === 0) {
        delete body.semestres_filtro
      }
      const result = await api.optimizar(body)
      setHistorial(result.historial || [])
      setHorarioFinal(result.mejor_horario || [])
      setMejorFitness(result.mejor_fitness || 0)
      setConflictos(result.conflictos_finales || 0)
      setConflictosDetalle(result.conflictos_detalle || [])
      setRazonParada(result.razon_parada || '')
      setGeneraciones(result.generaciones_ejecutadas || 0)
      setOptStatus('done')
    } catch (e) {
      setErrorOpt(e.message)
      setOptStatus('error')
    }
  }

  const reiniciarOptimizacion = () => {
    setOptStatus('idle')
    setHistorial([])
    setHorarioFinal([])
    setMejorFitness(0)
    setConflictos(0)
    setConflictosDetalle([])
    setRazonParada('')
    setGeneraciones(0)
    setErrorOpt(null)
  }

  const actualizarParams = (key, value) => {
    setParams(prev => ({ ...prev, [key]: value }))
  }

  const toggleSemestre = (s) => {
    setParams(prev => {
      const lista = prev.semestres_filtro.includes(s)
        ? prev.semestres_filtro.filter(x => x !== s)
        : [...prev.semestres_filtro, s].sort()
      return { ...prev, semestres_filtro: lista }
    })
  }

  // ── Interno ────────────────────────────────────────────────────────
  const _refreshSesiones = async () => {
    const data = await api.getDatos()
    setSesiones(data.sesiones || [])
    setResumen(data.resumen   || {})
  }

  const semestresDisponibles = resumen.semestres_disponibles || []

  return (
    <SiteContext.Provider value={{
      // datos
      materias, profesores, salones, franjas, sesiones, resumen,
      loadingData, errorData, cargarTodo,
      agregarMateria, editarMateria, eliminarMateria,
      agregarProfesor, editarProfesor, eliminarProfesor,
      agregarSalon, editarSalon, eliminarSalon,
      agregarFranja, editarFranja, eliminarFranja,
      resetearDatos, importarDatos,
      semestresDisponibles,
      // optimización
      optStatus, historial, horarioFinal, mejorFitness,
      conflictos, conflictosDetalle, razonParada, generaciones, errorOpt,
      params, actualizarParams, toggleSemestre,
      iniciarOptimizacion, reiniciarOptimizacion,
    }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() {
  return useContext(SiteContext)
}
