export default function StatCard({ label, value, variant }) {
  const cls = `stat-card ${variant ? `stat-card--${variant}` : ''}`
  return (
    <div className={cls}>
      <div className="stat-card__value">{value}</div>
      <div className="stat-card__label">{label}</div>
    </div>
  )
}
