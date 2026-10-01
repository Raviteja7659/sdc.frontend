import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import NotificationsPanel from './NotificationsPanel'

/**
 * Generic, layout-driven navbar. Each Layout (PublicLayout,
 * RenterLayout, OwnerLayout, AdminLayout) passes its own `links` array
 * so the nav items shown match the "section" the user is in — this is
 * how the spec's separate Renter Navbar / Owner Navbar / Admin Navbar
 * requirement is satisfied without three near-duplicate components.
 * A user with both RENTER and OWNER roles can freely move between
 * layouts; the navbar just reflects whichever one they're currently on.
 */
export default function Navbar({ links = [], showNotifications = false, badge }) {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  function handleLogout() {
    logout()
    setOpen(false)
    navigate('/')
  }

  function closeMenu() {
    setOpen(false)
  }

  const linkClass = ({ isActive }) => `nav__link${isActive ? ' active' : ''}`

  return (
    <nav className="nav">
      <div className="nav__inner">
        <Link to="/" className="nav__logo" onClick={closeMenu}>
          <span className="plate">SDC</span>
          SelfDriveConnect
          {badge && (
            <span className="plate" style={{ background: 'var(--rust)', color: '#fff', borderColor: '#fff' }}>
              {badge}
            </span>
          )}
        </Link>

        <button className="nav__toggle" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? '✕' : '☰'}
        </button>

        <div className={`nav__menu ${open ? 'open' : ''}`}>
          <div className="nav__links">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass} onClick={closeMenu} end={link.end}>
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="nav__user">
            {isAuthenticated ? (
              <>
                {showNotifications && <NotificationsPanel />}
                <span className="nav__email">{user?.email}</span>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={handleLogout}
                  style={{ color: '#fff', borderColor: '#3a4048' }}
                >
                  Log out
                </button>
              </>
            ) : (
              <Link to="/login" onClick={closeMenu}>
                <button className="btn btn-primary btn-sm">Log in</button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
