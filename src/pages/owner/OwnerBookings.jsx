import { useEffect, useMemo, useState } from 'react'
import { bookingService } from '../../services/bookingService'
import { extractErrorMessage } from '../../services/apiClient'
import { useAuth } from '../../context/AuthContext'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import ErrorState from '../../components/common/ErrorState'
import BookingCard from '../../components/booking/BookingCard'

const TABS = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']

export default function OwnerBookings() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('ALL')

  useEffect(() => {
    if (!user?.userId) return
    setLoading(true)
    bookingService
      .getByOwner(user.userId)
      .then(({ data }) => setBookings(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [user])

  const filtered = useMemo(
    () => (tab === 'ALL' ? bookings : bookings.filter((b) => b.status === tab)),
    [bookings, tab]
  )

  return (
    <div className="container page">
      <div className="page-header">
        <h2>Bookings on my vehicles</h2>
        <p>Requests and rentals across everything you own.</p>
      </div>

      {error && <ErrorState message={error} />}

      {!loading && bookings.length > 0 && (
        <div className="filter-bar" style={{ marginTop: 0 }}>
          {TABS.map((t) => (
            <button key={t} className={`filter-chip ${tab === t ? 'filter-chip--active' : ''}`} onClick={() => setTab(t)}>
              {t === 'ALL' ? 'All' : t}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <Loader label="Loading bookings…" />
      ) : bookings.length === 0 ? (
        <EmptyState icon="📅" title="No bookings yet">
          Once someone books one of your cars, it'll show up here.
        </EmptyState>
      ) : filtered.length === 0 ? (
        <EmptyState icon="📭" title={`No ${tab.toLowerCase()} bookings`}>
          Try a different tab above.
        </EmptyState>
      ) : (
        <div className="stack" style={{ marginTop: 20 }}>
          {filtered.map((b) => (
            <BookingCard key={b.id} booking={b} />
          ))}
        </div>
      )}
    </div>
  )
}
