export default function VehicleCardSkeleton() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-card__media" />
      <div className="skeleton-card__body">
        <div className="skeleton skeleton-line--title" />
        <div className="skeleton skeleton-line skeleton-line--sm" />
        <div className="skeleton skeleton-line" style={{ width: '60%', marginTop: 14 }} />
      </div>
    </div>
  )
}
