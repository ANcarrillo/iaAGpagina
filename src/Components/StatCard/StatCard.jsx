import './StatCard.css'

export default function StatCard({ icon, label, value, color = 'azul' }) {
  return (
    <div className={`stat-card stat-card--${color}`}>
      <span className="stat-card-icon">{icon}</span>
      <p className="stat-card-value">{value}</p>
      <p className="stat-card-label">{label}</p>
    </div>
  )
}
