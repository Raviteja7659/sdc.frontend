import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { vehicleService } from '../../services/vehicleService'
import { bookingService } from '../../services/bookingService'
import { extractErrorMessage } from '../../services/apiClient'
import Loader from '../../components/common/Loader'
import ErrorState from '../../components/common/ErrorState'
import EmptyState from '../../components/common/EmptyState'
import StatusBadge from '../../components/common/StatusBadge'

export default function VehicleAvailability() {
  const { id } = useParams()
  const [vehicle, setVehicle] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([vehicleService.getById(id), bookingService.getByVehicle(id)])
      .then(([vRes, bRes]) => {
        setVehicle(vRes.data)
        setBookings(
          bRes.data
            .filter((b) => ['PENDING', 'CONFIRMED'].includes(b.status))
            .sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime))
        )
      })
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Loader label="Loading availability…" />

  return (
    <div className="container page">
      <div className="page-header">
        <Link to="/owner/vehicles" className="muted">
          ← Back to my vehicles
        </Link>
        <h2 style={{ marginTop: 8 }}>Availability{vehicle ? ` — ${vehicle.brand} ${vehicle.model}` : ''}</h2>
        <p>Dates already booked or requested. Renters can't double-book any of these.</p>
      </div>

      {error && <ErrorState message={error} />}

      <div className="alert" style={{ background: 'var(--paper)', border: '1px dashed var(--line)', fontSize: 13 }}>
        This is a read-only view of existing bookings. Manually blocking specific dates (e.g. for maintenance)
        isn't supported yet — that would need a new "blocked dates" capability in booking-service or vehicle-service.
      </div>

      {bookings.length === 0 ? (
        <EmptyState icon="🗓" title="Fully open">
          No pending or confirmed bookings are blocking any dates right now.
        </EmptyState>
      ) : (
        <div className="stack">
          {bookings.map((b) => (
            <div key={b.id} className="card spread">
              <div>
                <div style={{ fontWeight: 600 }}>
                  {new Date(b.startDateTime).toLocaleString()} → {new Date(b.endDateTime).toLocaleString()}
                </div>
                <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>
                  ₹{b.totalAmount} · {b.pricingType}
                </div>
              </div>
              <StatusBadge status={b.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
