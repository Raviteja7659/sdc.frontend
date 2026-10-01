import { useEffect, useState } from 'react'
import { adminService } from '../../services/adminService'
import Loader from '../../components/common/Loader'
import StatusBadge from '../../components/common/StatusBadge'

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminService.getAllBookings().then(({ data }) => setBookings(data)).finally(() => setLoading(false))
  }, [])

  return (
    <div className="container page">
      <div className="page-header">
        <h2>Bookings</h2>
        <p>All bookings across the platform.</p>
      </div>

      <div className="demo-banner">
        ⚠ Demo data — booking-service only supports per-renter/per-owner/per-vehicle lookups today, no admin-only
        "list all bookings" endpoint. Same swap-in pattern as Users once that exists.
      </div>

      {loading ? (
        <Loader label="Loading…" />
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Vehicle</th>
              <th>Renter</th>
              <th>Owner</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>#{b.vehicleId}</td>
                <td>#{b.renterId}</td>
                <td>#{b.ownerId}</td>
                <td>₹{b.totalAmount}</td>
                <td>
                  <StatusBadge status={b.status} />
                </td>
                <td>{new Date(b.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
