import { Link } from 'react-router-dom'
import StatusBadge from '../common/StatusBadge'

export default function BookingCard({ booking, vehicleLabel, extraLabel }) {
  return (
    <Link to={`/bookings/${booking.id}`} className="card" style={{ display: 'block' }}>
      <div className="spread">
        <div>
          <div style={{ fontWeight: 600, fontFamily: 'var(--font-display)' }}>
            {vehicleLabel || `Vehicle #${booking.vehicleId}`}
          </div>
          <div className="muted" style={{ marginTop: 4 }}>
            {new Date(booking.startDateTime).toLocaleDateString()} →{' '}
            {new Date(booking.endDateTime).toLocaleDateString()}
            {' · ₹'}
            {booking.totalAmount}
            {extraLabel ? ` · ${extraLabel}` : ''}
          </div>
        </div>
        <StatusBadge status={booking.status} />
      </div>
    </Link>
  )
}
