import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { bookingService } from '../../services/bookingService'

/**
 * There's no notification-service in the backend, so this doesn't
 * pretend to be a real-time push notification system. Instead it
 * derives a short, genuinely useful list from data that already
 * exists: upcoming trips (renter) and booking requests waiting on
 * confirmation (owner). Fetched lazily the first time the bell is
 * opened, not on every render.
 */
export default function NotificationsPanel() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState(null)
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const notifications = []

      if (user?.roles?.includes('RENTER')) {
        const { data } = await bookingService.getByRenter(user.userId)
        const now = new Date()
        data
          .filter((b) => ['PENDING', 'CONFIRMED'].includes(b.status) && new Date(b.startDateTime) > now)
          .sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime))
          .slice(0, 3)
          .forEach((b) =>
            notifications.push({
              id: `trip-${b.id}`,
              text: `Upcoming trip on vehicle #${b.vehicleId}`,
              time: new Date(b.startDateTime).toLocaleString(),
              to: `/bookings/${b.id}`,
            })
          )
      }

      if (user?.roles?.includes('OWNER')) {
        const { data } = await bookingService.getByOwner(user.userId)
        data
          .filter((b) => b.status === 'PENDING')
          .slice(0, 3)
          .forEach((b) =>
            notifications.push({
              id: `req-${b.id}`,
              text: `New booking request on vehicle #${b.vehicleId}`,
              time: new Date(b.createdAt).toLocaleString(),
              to: `/bookings/${b.id}`,
            })
          )
      }

      setItems(notifications)
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [user])

  function toggle() {
    const next = !open
    setOpen(next)
    if (next && items === null) load()
  }

  return (
    <div className="notif-wrap">
      <button className="notif-bell" onClick={toggle} aria-label="Notifications">
        🔔
        {items && items.length > 0 && <span className="notif-dot" />}
      </button>

      {open && (
        <div className="notif-panel">
          {loading ? (
            <div className="notif-item muted">Loading…</div>
          ) : items && items.length > 0 ? (
            items.map((n) => (
              <div
                key={n.id}
                className="notif-item"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setOpen(false)
                  navigate(n.to)
                }}
              >
                <div>{n.text}</div>
                <div className="notif-item__time">{n.time}</div>
              </div>
            ))
          ) : (
            <div className="notif-item muted">Nothing new right now.</div>
          )}
        </div>
      )}
    </div>
  )
}
