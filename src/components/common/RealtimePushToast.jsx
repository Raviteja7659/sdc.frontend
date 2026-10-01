import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRealtime } from '../../context/RealtimeContext'

const STATUS_COPY = {
  PENDING: 'New booking request',
  CONFIRMED: 'Booking confirmed',
  CANCELLED: 'Booking cancelled',
  COMPLETED: 'Booking completed',
}

export default function RealtimePushToast() {
  const { events, dismiss } = useRealtime()
  const navigate = useNavigate()

  useEffect(() => {
    const timers = events.map((e) => setTimeout(() => dismiss(e.id), 6000))
    return () => timers.forEach(clearTimeout)
  }, [events, dismiss])

  if (events.length === 0) return null

  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 200, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {events.map((e) => (
        <div
          key={e.id}
          className="card"
          style={{ width: 280, cursor: 'pointer', boxShadow: '0 12px 32px rgba(0,0,0,0.18)' }}
          onClick={() => {
            dismiss(e.id)
            navigate(`/bookings/${e.payload.bookingId}`)
          }}
        >
          <div className="row spread">
            <span style={{ fontWeight: 600, fontSize: 13 }}>
              🔴 Live · {STATUS_COPY[e.payload.status] || 'Booking updated'}
            </span>
            <button
              onClick={(ev) => {
                ev.stopPropagation()
                dismiss(e.id)
              }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-soft)' }}
            >
              ✕
            </button>
          </div>
          <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
            Booking #{e.payload.bookingId} · Vehicle #{e.payload.vehicleId}
          </div>
        </div>
      ))}
    </div>
  )
}
