import { useEffect, useMemo, useState } from 'react'
import { bookingService } from '../../services/bookingService'
import { extractErrorMessage } from '../../services/apiClient'
import { useAuth } from '../../context/AuthContext'
import Loader from '../../components/common/Loader'
import ErrorState from '../../components/common/ErrorState'
import EmptyState from '../../components/common/EmptyState'
import StatCard from '../../components/common/StatCard'

function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}
function monthLabel(key) {
  const [y, m] = key.split('-')
  return new Date(Number(y), Number(m) - 1).toLocaleDateString(undefined, { month: 'short' })
}

export default function OwnerEarnings() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user?.userId) return
    setLoading(true)
    bookingService
      .getByOwner(user.userId)
      .then(({ data }) => setBookings(data))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [user])

  const completed = useMemo(
    () => bookings.filter((b) => b.status === 'COMPLETED').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [bookings]
  )

  const totals = useMemo(() => {
    const total = completed.reduce((s, b) => s + b.totalAmount, 0)
    const thisMonthKey = monthKey(new Date())
    const thisMonth = completed
      .filter((b) => monthKey(new Date(b.createdAt)) === thisMonthKey)
      .reduce((s, b) => s + b.totalAmount, 0)
    return { total, thisMonth, count: completed.length }
  }, [completed])

  const monthlyChart = useMemo(() => {
    const map = {}
    completed.forEach((b) => {
      const key = monthKey(new Date(b.createdAt))
      map[key] = (map[key] || 0) + b.totalAmount
    })
    const keys = Object.keys(map).sort().slice(-6)
    const max = Math.max(1, ...keys.map((k) => map[k]))
    return keys.map((k) => ({ key, label: monthLabel(k), value: map[k], pct: (map[k] / max) * 100 }))
  }, [completed])

  if (loading) return <Loader label="Loading earnings…" />

  return (
    <div className="container page">
      <div className="page-header">
        <h2>Earnings</h2>
        <p>Revenue from completed bookings across all your vehicles.</p>
      </div>

      {error && <ErrorState message={error} />}

      <div className="stat-cards">
        <StatCard label="Total earnings" value={`₹${totals.total.toFixed(0)}`} variant="route" />
        <StatCard label="This month" value={`₹${totals.thisMonth.toFixed(0)}`} variant="accent" />
        <StatCard label="Completed rentals" value={totals.count} />
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 12 }}>Last 6 months</h3>
        {monthlyChart.length === 0 ? (
          <p className="muted">No completed bookings yet.</p>
        ) : (
          <div className="bar-chart">
            {monthlyChart.map((m) => (
              <div key={m.key} className="bar-chart__col">
                <span className="muted" style={{ fontSize: 11 }}>
                  ₹{m.value.toFixed(0)}
                </span>
                <div className="bar-chart__bar" style={{ height: `${m.pct}%` }} />
                <span className="bar-chart__label">{m.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 12 }}>Recent transactions</h3>
        {completed.length === 0 ? (
          <EmptyState icon="₹" title="Nothing yet">
            Completed bookings will show up here.
          </EmptyState>
        ) : (
          <div className="stack">
            {completed.slice(0, 10).map((b) => (
              <div key={b.id} className="row spread">
                <span className="muted">
                  Vehicle #{b.vehicleId} · {new Date(b.createdAt).toLocaleDateString()}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>₹{b.totalAmount}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
