import './AcercaDe.css'

const EQUIPO = [
  { nombre: 'Oscar Ivan Torres',  rol: 'Desarrollo Backend · Algoritmo Genético', avatar: '🧑‍💻' },
  { nombre: 'Andres Carrillo',    rol: 'Desarrollo Frontend · Integración API',   avatar: '👨‍🎨' },
  { nombre: 'Mercy Florez',       rol: 'Análisis de Datos · Documentación',       avatar: '👩‍🔬' },
]

const TECNOLOGIAS = [
  { icono: '🐍', nombre: 'Python 3.11',    desc: 'Lenguaje principal del backend' },
  { icono: '⚡', nombre: 'FastAPI',         desc: 'Framework REST + WebSocket' },
  { icono: '🧬', nombre: 'Algoritmo GA',   desc: 'Cruce OX, torneo, elitismo' },
  { icono: '⚛️', nombre: 'React + Vite',   desc: 'Interfaz web SPA' },
  { icono: '🗺️', nombre: 'React Router',   desc: 'Navegación entre vistas' },
  { icono: '📊', nombre: 'Recharts',        desc: 'Gráfica de convergencia' },
]

const PASOS = [
  { num: '1', titulo: 'Cargar datos',        desc: 'Define materias, profesores, salones y franjas horarias desde la sección Gestión de Datos.' },
  { num: '2', titulo: 'Configurar el AG',    desc: 'Selecciona un preset o ajusta manualmente: población, generaciones, cruzamiento, mutación, élite y paciencia.' },
  { num: '3', titulo: 'Ejecutar',            desc: 'Inicia el algoritmo. Observa el progreso en tiempo real y la gráfica de convergencia.' },
  { num: '4', titulo: 'Revisar resultados',  desc: 'Consulta el horario optimizado, el fitness alcanzado y los conflictos restantes (si los hay).' },
]

export default function AcercaDe() {
  return (
    <div className="acerca">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <div className="acerca-hero">
        <p className="acerca-hero-badge">Inteligencia Artificial · Universidad</p>
        <h1 className="acerca-hero-title">🧬 Optimizador de Horarios</h1>
        <p className="acerca-hero-sub">
          Generación automática de horarios académicos mediante algoritmos genéticos.
          El sistema evoluciona soluciones minimizando conflictos de docentes, salones y grupos.
        </p>
      </div>

      {/* ── Cómo funciona ─────────────────────────────────────── */}
      <div className="acerca-card">
        <h2 className="acerca-card-title">¿Cómo funciona?</h2>
        <div className="acerca-steps">
          {PASOS.map(p => (
            <div key={p.num} className="acerca-step">
              <div className="acerca-step-num">{p.num}</div>
              <div>
                <p className="acerca-step-titulo">{p.titulo}</p>
                <p className="acerca-step-desc">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Algoritmo ─────────────────────────────────────────── */}
      <div className="acerca-card">
        <h2 className="acerca-card-title">Detalles del Algoritmo Genético</h2>
        <div className="acerca-ag-grid">
          <AgItem titulo="Cromosoma" icono="🧬"
            desc="Lista de enteros únicos. Cada gen representa una ranura = franja_idx × n_salones + salon_idx. Un cromosoma de 28 genes define el horario completo." />
          <AgItem titulo="Población" icono="👥"
            desc="Conjunto de individuos (horarios candidatos). Se inicializa aleatoriamente y evoluciona generación a generación hacia soluciones de mayor calidad." />
          <AgItem titulo="Fitness" icono="🎯"
            desc="Evalúa la calidad de cada horario. Base 1 000; penaliza −200 a −400 por conflicto; premia +15/+20 por franjas preferidas del docente." />
          <AgItem titulo="Selección" icono="🏆"
            desc="Torneo determinístico k=5: se escogen 5 individuos al azar y el de mayor fitness pasa como padre. Proceso eficiente y con presión selectiva ajustable." />
          <AgItem titulo="Cruce OX" icono="🔀"
            desc="Order Crossover: copia un segmento del padre 1 al hijo, luego rellena los genes faltantes en el orden del padre 2. Preserva la permutación." />
          <AgItem titulo="Mutación" icono="🔬"
            desc="Swap mutation: intercambia dos genes aleatorios del cromosoma. Mantiene la permutación válida e introduce diversidad genética controlada." />
          <AgItem titulo="Elitismo" icono="👑"
            desc="Los N mejores individuos pasan intactos a la siguiente generación, garantizando que la solución nunca empeore entre generaciones." />
          <AgItem titulo="Paciencia" icono="⏱️"
            desc="Criterio de parada temprana: si el mejor fitness no mejora en P generaciones consecutivas, se detiene la ejecución para ahorrar tiempo." />
        </div>
      </div>

      {/* ── Tecnologías ───────────────────────────────────────── */}
      <div className="acerca-card">
        <h2 className="acerca-card-title">Tecnologías utilizadas</h2>
        <div className="acerca-tech-grid">
          {TECNOLOGIAS.map(t => (
            <div key={t.nombre} className="acerca-tech-item">
              <span className="acerca-tech-icono">{t.icono}</span>
              <div>
                <p className="acerca-tech-nombre">{t.nombre}</p>
                <p className="acerca-tech-desc">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Equipo ────────────────────────────────────────────── */}
      <div className="acerca-card">
        <h2 className="acerca-card-title">Equipo de desarrollo</h2>
        <div className="acerca-team">
          {EQUIPO.map(m => (
            <div key={m.nombre} className="acerca-member">
              <span className="acerca-member-avatar">{m.avatar}</span>
              <p className="acerca-member-nombre">{m.nombre}</p>
              <p className="acerca-member-rol">{m.rol}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer info ───────────────────────────────────────── */}
      <div className="acerca-footer-note">
        <p>Proyecto académico · Inteligencia Artificial · 2026</p>
      </div>
    </div>
  )
}

function AgItem({ titulo, icono, desc }) {
  return (
    <div className="acerca-ag-item">
      <p className="acerca-ag-item-titulo"><span>{icono}</span> {titulo}</p>
      <p className="acerca-ag-item-desc">{desc}</p>
    </div>
  )
}
