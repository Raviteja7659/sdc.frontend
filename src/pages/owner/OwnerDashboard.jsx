import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { vehicleService } from '../../services/vehicleService'
import { bookingService } from '../../services/bookingService'
import { useAuth } from '../../context/AuthContext'
import Loader from '../../components/common/Loader'
import StatCard from '../../components/common/StatCard'
import BookingCard from '../../components/booking/BookingCard'
import Button from '../../components/common/Button'
import EmptyState from '../../components/common/EmptyState'

export default function OwnerDashboard() {
  const { user } = useAuth()
  const [vehicles, setVehicles] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [vRes, bRes] = await Promise.all([
          vehicleService.getByOwner(user.userId),
          bookingService.getByOwner(user.userId),
        ])
        setVehicles(vRes.data)
        setBookings(bRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
      } finally {
        setLoading(false)
      }
    }
    if (user?.userId) load()
  }, [user])

  const stats = useMemo(() => {
    const active = vehicles.filter((v) => v.status === 'ACTIVE').length
    const earnings = bookings.filter((b) => b.status === 'COMPLETED').reduce((s, b) => s + b.totalAmount, 0)
    return { active, earnings }
  }, [vehicles, bookings])

  const upcoming = bookings
    .filter((b) => ['PENDING', 'CONFIRMED'].includes(b.status))
    .sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime))
    .slice(0, 5)

  if (loading) return <Loader label="Loading your dashboard…" />

  return (
    <div className="container page">
      <div className="page-header spread">
        <div>
          <h2>Owner dashboard</h2>
          <p>An overview of your listings and bookings.</p>
        </div>
        <Link to="/owner/vehicles/new">
          <Button>+ List a car</Button>
        </Link>
      </div>

      <div className="stat-cards">
        <StatCard label="Total vehicles" value={vehicles.length} />
        <StatCard label="Active vehicles" value={stats.active} variant="route" />
        <StatCard label="Total bookings" value={bookings.length} />
        <StatCard label="Earnings (completed)" value={`₹${stats.earnings.toFixed(0)}`} variant="accent" />
      </div>

      <div className="card">
        <div className="spread" style={{ marginBottom: 12 }}>
          <h3>Upcoming bookings</h3>
          <Link to="/owner/bookings" className="link-accent" style={{ fontSize: 13 }}>
            View all →
          </Link>
        </div>
        {upcoming.length === 0 ? (
          <EmptyState icon="📅" title="Nothing upcoming">
            New bookings on your vehicles will show up here.
          </EmptyState>
        ) : (
          <div className="stack">
            {upcoming.map((b) => (
              <BookingCard key={b.id} booking={b} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
