import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import NotificationsPanel from './NotificationsPanel'

// Helper function to return SVG icons based on link labels
function getIconForLabel(label) {
  const cleanLabel = label.toLowerCase().trim()
  
  if (cleanLabel.includes('dashboard')) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" />
        <rect x="14" y="3" width="7" height="5" />
        <rect x="14" y="12" width="7" height="9" />
        <rect x="3" y="16" width="7" height="5" />
      </svg>
    )
  }
  if (cleanLabel.includes('browse') || cleanLabel.includes('vehicles')) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7" cy="17" r="2" />
        <circle cx="17" cy="17" r="2" />
        <path d="M5 17H3V7c0-1.1.9-2 2-2h10l4 4v8h-2" />
        <path d="M15 17H9" />
      </svg>
    )
  }
  if (cleanLabel.includes('booking')) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
      </svg>
    )
  }
  if (cleanLabel.includes('favorite')) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    )
  }
  if (cleanLabel.includes('profile')) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    )
  }
  if (cleanLabel.includes('add') || cleanLabel.includes('new')) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    )
  }
  if (cleanLabel.includes('earning')) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    )
  }
  if (cleanLabel.includes('payment')) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
        <line x1="12" y1="4" x2="12" y2="20" />
        <line x1="2" y1="10" x2="22" y2="10" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    )
  }
  if (cleanLabel.includes('user')) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )
  }

  if (cleanLabel.includes('exit admin')) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l-5-5 5-5M12 12H21"/>
      </svg>
    )
  }

  // Fallback default icon
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  )
}

export default function Sidebar({ links = [], isOpen, toggleSidebar, isCollapsed, toggleCollapse, badge, showNotifications = false }) {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    toggleSidebar(false)
    navigate('/')
  }

  // Extract display name from email
  const displayName = user?.email
    ? user.email.split('@')[0].split('.')[0].replace(/^\w/, (c) => c.toUpperCase())
    : 'Guest User'

  // Format roles into a readable user title
  const userRole = badge 
    ? `${badge} Portal`
    : user?.roles?.includes('ADMIN')
    ? 'System Administrator'
    : user?.roles?.includes('OWNER')
    ? 'Vehicle Owner & Partner'
    : 'Platform Renter'

  const avatarInitial = displayName.charAt(0).toUpperCase()

  const linkClass = ({ isActive }) => `sidebar__link${isActive ? ' active' : ''}`

  // Dynamically find profile path based on links
  const profileLink = links.find(l => l.to.includes('profile'))?.to || '/renter/profile'

  const allLinks = [...links]
  if (user?.roles?.includes('ADMIN')) {
    if (badge !== 'ADMIN') {
      allLinks.push({ to: '/admin/dashboard', label: 'Admin Panel' })
    } else {
      allLinks.push({ to: '/renter/dashboard', label: 'Exit Admin' })
    }
  }

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Sidebar Branding Header */}
      <div className="sidebar__header">
        <Link to="/" className="sidebar__logo" onClick={() => toggleSidebar(false)}>
          <span className="sidebar__logo-mark">SDC</span>
          <span>SelfDriveConnect</span>
        </Link>
        <button className="sidebar__grid-btn" aria-label="Menu Grid" onClick={toggleCollapse}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 4h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 16h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z"/>
          </svg>
        </button>
      </div>

      {/* Profile Card Section */}
      <div className="sidebar__profile">
        <div className="sidebar__avatar">{avatarInitial}</div>
        <div className="sidebar__name">{displayName}</div>
        <div className="sidebar__role">{userRole}</div>
        {isAuthenticated && (
          <Link to={profileLink} className="sidebar__profile-link" onClick={() => toggleSidebar(false)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4 }}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            My Profile
          </Link>
        )}
      </div>

      {/* Navigation List */}
      <div className="sidebar__links">
        {allLinks.map((link) => (
          <NavLink key={link.to} to={link.to} className={linkClass} onClick={() => toggleSidebar(false)} end={link.end}>
            {getIconForLabel(link.label)}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Notifications Panel if enabled */}
      {showNotifications && isAuthenticated && (
        <div style={{ padding: '8px 24px', display: 'flex', justifyContent: 'center' }}>
          <NotificationsPanel />
        </div>
      )}

      {/* Logout Footer Section */}
      {isAuthenticated && (
        <div className="sidebar__footer">
          <button className="btn btn-ghost btn-sm btn-block" onClick={handleLogout}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            <span>Log Out</span>
          </button>
        </div>
      )}
    </aside>
  )
}
