import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Wraps a route that requires a specific role (RENTER, OWNER, or
 * ADMIN). Unauthenticated users go to /login (and get bounced back
 * here after logging in, via location state). Authenticated users
 * missing the required role get a proper 403 page instead of a
 * silent redirect or a broken screen — this satisfies the spec's
 * "Unauthorized route access → show a proper 403/Not Authorized page"
 * requirement directly.
 *
 * Note: roles are a Set on the backend, so a person can hold RENTER,
 * OWNER, and ADMIN all at once. This guard checks "does the user have
 * AT LEAST this role", not "is this their only role" — matching how
 * the rest of the app treats roles as additive, not exclusive.
 */
export default function RoleRoute({ role, children }) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (role && !user?.roles?.includes(role)) {
    return <Navigate to="/not-authorized" replace />
  }

  return children
}
