import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import './FitnessChart.css'

export default function FitnessChart({ historial }) {
  if (!historial || historial.length === 0) {
    return <div className="chart-empty">Sin datos aún</div>
  }

  const data = historial.map(h => ({
    gen:      h.generacion,
    mejor:    parseFloat(h.mejor_fitness?.toFixed(1)),
    promedio: parseFloat(h.promedio_fitness?.toFixed(1)),
    peor:     parseFloat(h.peor_fitness?.toFixed(1)),
  }))

  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
          <XAxis
            dataKey="gen"
            tick={{ fontSize: 11 }}
            label={{ value: 'Generación', position: 'insideBottom', offset: -2, fontSize: 12 }}
          />
          <YAxis
            domain={[0, 1100]}
            tick={{ fontSize: 11 }}
            label={{ value: 'Fitness', angle: -90, position: 'insideLeft', fontSize: 12 }}
          />
          <Tooltip
            formatter={(val, name) => [val, name.charAt(0).toUpperCase() + name.slice(1)]}
            labelFormatter={label => `Generación ${label}`}
          />
          <Legend verticalAlign="top" height={28} />
          <Line type="monotone" dataKey="mejor"    stroke="#1565C0" strokeWidth={2} dot={false} name="Mejor" />
          <Line type="monotone" dataKey="promedio" stroke="#43A047" strokeWidth={1.5} dot={false} strokeDasharray="5 3" name="Promedio" />
          <Line type="monotone" dataKey="peor"     stroke="#EF5350" strokeWidth={1} dot={false} strokeDasharray="3 3" name="Peor" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
