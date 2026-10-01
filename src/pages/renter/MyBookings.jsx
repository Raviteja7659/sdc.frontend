import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { bookingService } from '../../services/bookingService'
import { vehicleService } from '../../services/vehicleService'
import { extractErrorMessage } from '../../services/apiClient'
import { useAuth } from '../../context/AuthContext'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import ErrorState from '../../components/common/ErrorState'
import StatCard from '../../components/common/StatCard'
import BookingCard from '../../components/booking/BookingCard'

// Backend statuses are PENDING/CONFIRMED/COMPLETED/CANCELLED. The
// spec's tab names (Upcoming/Active/Completed/Cancelled) are a
// date-aware view on top of those, computed client-side rather than
// requiring a new backend status.
function deriveTab(booking, now) {
  if (booking.status === 'CANCELLED') return 'CANCELLED'
  if (booking.status === 'COMPLETED') return 'COMPLETED'
  const start = new Date(booking.startDateTime)
  const end = new Date(booking.endDateTime)
  if (booking.status === 'CONFIRMED' && start <= now && now <= end) return 'ACTIVE'
  return 'UPCOMING'
}

const TABS = ['ALL', 'UPCOMING', 'ACTIVE', 'COMPLETED', 'CANCELLED']

export default function MyBookings() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [vehicles, setVehicles] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('ALL')

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError('')
      try {
        const { data } = await bookingService.getByRenter(user.userId)
        setBookings(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))

        const vehicleIds = [...new Set(data.map((b) => b.vehicleId))]
        const vehicleResults = await Promise.all(
          vehicleIds.map((vid) => vehicleService.getById(vid).then((r) => r.data).catch(() => null))
        )
        const map = {}
        vehicleResults.forEach((v) => v && (map[v.id] = v))
        setVehicles(map)
      } catch (err) {
        setError(extractErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
    if (user?.userId) load()
  }, [user])

  const now = new Date()
  const withTabs = useMemo(() => bookings.map((b) => ({ ...b, _tab: deriveTab(b, now) })), [bookings])

  const counts = useMemo(() => {
    const c = { UPCOMING: 0, ACTIVE: 0, COMPLETED: 0, spend: 0 }
    withTabs.forEach((b) => {
      if (b._tab === 'UPCOMING') c.UPCOMING++
      if (b._tab === 'ACTIVE') c.ACTIVE++
      if (b._tab === 'COMPLETED') {
        c.COMPLETED++
        c.spend += b.totalAmount
      }
    })
    return c
  }, [withTabs])

  const filtered = tab === 'ALL' ? withTabs : withTabs.filter((b) => b._tab === tab)

  return (
    <div className="container page">
      <div className="page-header">
        <h2>My bookings</h2>
        <p>Everything you've booked as a renter.</p>
      </div>

      {!loading && bookings.length > 0 && (
        <div className="stat-cards">
          <StatCard label="Upcoming" value={counts.UPCOMING} variant="accent" />
          <StatCard label="Active now" value={counts.ACTIVE} variant="route" />
          <StatCard label="Completed" value={counts.COMPLETED} />
          <StatCard label="Spent (completed)" value={`₹${counts.spend.toFixed(0)}`} />
        </div>
      )}

      {error && <ErrorState message={error} />}

      {!loading && bookings.length > 0 && (
        <div className="filter-bar" style={{ marginTop: 0 }}>
          {TABS.map((t) => (
            <button key={t} className={`filter-chip ${tab === t ? 'filter-chip--active' : ''}`} onClick={() => setTab(t)}>
              {t === 'ALL' ? 'All' : t.charAt(0) + t.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <Loader label="Loading bookings…" />
      ) : bookings.length === 0 ? (
        <EmptyState
          icon="📅"
          title="No bookings yet"
          action={
            <Link to="/vehicles">
              <button className="btn btn-primary btn-sm">Browse cars</button>
            </Link>
          }
        >
          Find a car nearby and book your first ride.
        </EmptyState>
      ) : filtered.length === 0 ? (
        <EmptyState icon="📭" title={`No ${tab.toLowerCase()} bookings`}>
          Try a different tab above.
        </EmptyState>
      ) : (
        <div className="stack" style={{ marginTop: 20 }}>
          {filtered.map((b) => {
            const v = vehicles[b.vehicleId]
            return <BookingCard key={b.id} booking={b} vehicleLabel={v ? `${v.brand} ${v.model}` : undefined} />
          })}
        </div>
      )}
    </div>
  )
}
