import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/common/Sidebar'
import Footer from '../components/common/Footer'

const links = [
  { to: '/renter/dashboard', label: 'Dashboard' },
  { to: '/vehicles', label: 'Browse Vehicles' },
  { to: '/renter/bookings', label: 'My Bookings' },
  { to: '/renter/favorites', label: 'Favorites' },
  { to: '/renter/profile', label: 'Profile' },
]

export default function RenterLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)

  return (
    <div className="app-layout">
      <Sidebar
        links={links}
        showNotifications
        isOpen={sidebarOpen}
        toggleSidebar={setSidebarOpen}
        isCollapsed={sidebarCollapsed}
        toggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="main-content">
        <div className="sidebar-toggle-bar">
          <span style={{ fontWeight: 700, letterSpacing: '0.02em', fontFamily: 'var(--font-display)' }}>
            SelfDriveConnect
          </span>
          <button className="btn btn-primary btn-sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? 'Close Menu ✕' : 'Menu ☰'}
          </button>
        </div>
        <div className="page-content">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  )
}
