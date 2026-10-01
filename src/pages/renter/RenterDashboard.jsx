import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { authService } from '../../services/authService'
import { bookingService } from '../../services/bookingService'
import { vehicleService } from '../../services/vehicleService'
import { useAuth } from '../../context/AuthContext'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import BookingCard from '../../components/booking/BookingCard'
import Button from '../../components/common/Button'

export default function RenterDashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [bookings, setBookings] = useState([])
  const [vehicles, setVehicles] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [profileRes, bookingsRes] = await Promise.all([
          authService.getCurrentUser(),
          bookingService.getByRenter(user.userId),
        ])
        setProfile(profileRes.data)
        const sorted = bookingsRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setBookings(sorted)

        const vehicleIds = [...new Set(sorted.map((b) => b.vehicleId))]
        const vResults = await Promise.all(
          vehicleIds.map((id) => vehicleService.getById(id).then((r) => r.data).catch(() => null))
        )
        const map = {}
        vResults.forEach((v) => v && (map[v.id] = v))
        setVehicles(map)
      } finally {
        setLoading(false)
      }
    }
    if (user?.userId) load()
  }, [user])

  if (loading) return <Loader label="Loading your dashboard…" />

  const now = new Date()
  const upcoming = bookings
    .filter((b) => ['PENDING', 'CONFIRMED'].includes(b.status) && new Date(b.startDateTime) > now)
    .sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime))[0]

  const recent = bookings.slice(0, 5)

  return (
    <div className="container page">
      <div className="page-header">
        <h2>Hi{profile?.fullName ? `, ${profile.fullName.split(' ')[0]}` : ''} 👋</h2>
        <p>Here's what's happening with your trips.</p>
      </div>

      <div className="detail-grid">
        <div className="stack">
          <div className="card">
            <h3 style={{ marginBottom: 12 }}>Upcoming trip</h3>
            {upcoming ? (
              <BookingCard
                booking={upcoming}
                vehicleLabel={
                  vehicles[upcoming.vehicleId]
                    ? `${vehicles[upcoming.vehicleId].brand} ${vehicles[upcoming.vehicleId].model}`
                    : undefined
                }
              />
            ) : (
              <EmptyState icon="🗓" title="Nothing booked yet">
                <Link to="/vehicles">
                  <Button size="sm">Find a car</Button>
                </Link>
              </EmptyState>
            )}
          </div>

          <div className="card">
            <h3 style={{ marginBottom: 12 }}>Recent bookings</h3>
            {recent.length === 0 ? (
              <p className="muted">No bookings yet.</p>
            ) : (
              <div className="stack">
                {recent.map((b) => (
                  <BookingCard
                    key={b.id}
                    booking={b}
                    vehicleLabel={vehicles[b.vehicleId] ? `${vehicles[b.vehicleId].brand} ${vehicles[b.vehicleId].model}` : undefined}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 12 }}>Quick actions</h3>
          <div className="stack">
            <Link to="/vehicles">
              <Button block variant="dark">
                Find a car
              </Button>
            </Link>
            <Link to="/renter/bookings">
              <Button block variant="ghost">
                My bookings
              </Button>
            </Link>
            <Link to="/renter/favorites">
              <Button block variant="ghost">
                Favorites
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
