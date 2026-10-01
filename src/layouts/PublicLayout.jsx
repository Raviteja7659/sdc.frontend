import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import Sidebar from '../components/common/Sidebar'
import Footer from '../components/common/Footer'
import { useAuth } from '../context/AuthContext'

const renterLinks = [
  { to: '/renter/dashboard', label: 'Dashboard' },
  { to: '/vehicles', label: 'Browse Vehicles' },
  { to: '/renter/bookings', label: 'My Bookings' },
  { to: '/renter/favorites', label: 'Favorites' },
  { to: '/renter/profile', label: 'Profile' },
]

const ownerLinks = [
  { to: '/owner/dashboard', label: 'Dashboard' },
  { to: '/owner/vehicles', label: 'My Vehicles' },
  { to: '/owner/bookings', label: 'Bookings' },
  { to: '/owner/earnings', label: 'Earnings' },
  { to: '/owner/profile', label: 'Profile' },
]

export default function PublicLayout() {
  const { isAuthenticated, user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)

  const isOwner = user?.roles?.includes('OWNER')
  const activeLinks = isOwner ? ownerLinks : renterLinks

  const listVehicleTarget = isOwner ? '/owner/vehicles/new' : '/register'
  const publicLinks = [
    { to: '/vehicles', label: 'Browse Vehicles' },
    { to: listVehicleTarget, label: 'List Your Vehicle' },
  ]

  if (!isAuthenticated) {
    return (
      <>
        <Navbar links={publicLinks} />
        <div className="page-content">
          <Outlet />
        </div>
        <Footer />
      </>
    )
  }

  return (
    <div className="app-layout">
      <Sidebar
        links={activeLinks}
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
