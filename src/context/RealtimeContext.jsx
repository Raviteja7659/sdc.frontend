import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { GATEWAY_URL } from '../services/apiClient'

const RealtimeContext = createContext(null)

/**
 * The browser half of the Uber/Rapido-style "live updates without
 * polling" pattern. Opens one Server-Sent Events connection to
 * booking-service for the lifetime of being logged in, and pushes
 * incoming events into a small queue that RealtimePushToast renders.
 *
 * EventSource authenticates via a `token` query param rather than a
 * header (see the comment in api-gateway's JwtPreAuthFilter for why —
 * the native browser API can't set custom headers on it). EventSource
 * also has built-in auto-reconnect on drop, so no manual retry logic
 * is needed here.
 */
export function RealtimeProvider({ children }) {
  const { isAuthenticated, token } = useAuth()
  const [events, setEvents] = useState([])
  const sourceRef = useRef(null)
  const idCounter = useRef(0)

  useEffect(() => {
    if (!isAuthenticated || !token) {
      sourceRef.current?.close()
      sourceRef.current = null
      return
    }

    const url = `${GATEWAY_URL}/api/v1/bookings/stream?token=${encodeURIComponent(token)}`
    const source = new EventSource(url)
    sourceRef.current = source

    source.addEventListener('booking-update', (e) => {
      try {
        const payload = JSON.parse(e.data)
        idCounter.current += 1
        setEvents((prev) => [...prev, { id: idCounter.current, type: 'booking-update', payload }])
      } catch {
        // Malformed event — ignore rather than crash the connection.
      }
    })

    return () => {
      source.close()
      sourceRef.current = null
    }
  }, [isAuthenticated, token])

  const dismiss = useCallback((id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }, [])

  return <RealtimeContext.Provider value={{ events, dismiss }}>{children}</RealtimeContext.Provider>
}

export function useRealtime() {
  const ctx = useContext(RealtimeContext)
  if (!ctx) throw new Error('useRealtime must be used within RealtimeProvider')
  return ctx
}
