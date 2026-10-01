import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminService } from '../../services/adminService'
import Loader from '../../components/common/Loader'
import StatCard from '../../components/common/StatCard'

export default function AdminDashboard() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminService
      .getAllVehicles()
      .then(({ data }) => setVehicles(data))
      .finally(() => setLoading(false))
  }, [])

  const stats = useMemo(
    () => ({
      total: vehicles.length,
      pending: vehicles.filter((v) => v.status === 'PENDING_VERIFICATION').length,
      active: vehicles.filter((v) => v.status === 'ACTIVE').length,
    }),
    [vehicles]
  )

  if (loading) return <Loader label="Loading admin dashboard…" />

  return (
    <div className="container page">
      <div className="page-header">
        <h2>Admin dashboard</h2>
        <p>Platform-wide overview.</p>
      </div>

      <h3 className="section-title">Vehicles (real data)</h3>
      <div className="stat-cards">
        <StatCard label="Total listings" value={stats.total} />
        <StatCard label="Pending review" value={stats.pending} variant="accent" />
        <StatCard label="Active" value={stats.active} variant="route" />
      </div>
      {stats.pending > 0 && (
        <p style={{ marginBottom: 28 }}>
          <Link to="/admin/vehicles" className="link-accent">
            {stats.pending} listing{stats.pending === 1 ? '' : 's'} waiting on review →
          </Link>
        </p>
      )}

      <h3 className="section-title">Users, bookings & revenue</h3>
      <div className="demo-banner">
        ⚠ user-service, booking-service, and payment-service have no "list everything" admin endpoint yet, so
        platform-wide totals here aren't fetchable for real. See <Link to="/admin/users" className="link-accent">Users</Link>,{' '}
        <Link to="/admin/bookings" className="link-accent">Bookings</Link>, and{' '}
        <Link to="/admin/payments" className="link-accent">Payments</Link> for demo-data previews of what these
        screens would show once those endpoints exist.
      </div>
    </div>
  )
}
