import { Routes, Route } from 'react-router-dom'

import PublicLayout from '../layouts/PublicLayout'
import SharedLayout from '../layouts/SharedLayout'
import RenterLayout from '../layouts/RenterLayout'
import OwnerLayout from '../layouts/OwnerLayout'
import AdminLayout from '../layouts/AdminLayout'

import ProtectedRoute from './ProtectedRoute'
import RoleRoute from './RoleRoute'

import Home from '../pages/public/Home'
import Login from '../pages/public/Login'
import Register from '../pages/public/Register'
import ForgotPassword from '../pages/public/ForgotPassword'
import NotAuthorized from '../pages/public/NotAuthorized'
import NotFound from '../pages/public/NotFound'

import RenterDashboard from '../pages/renter/RenterDashboard'
import VehicleBrowse from '../pages/renter/VehicleBrowse'
import VehicleDetail from '../pages/renter/VehicleDetail'
import BookingDetail from '../pages/renter/BookingDetail'
import MyBookings from '../pages/renter/MyBookings'
import Favorites from '../pages/renter/Favorites'
import RenterProfile from '../pages/renter/Profile'

import OwnerDashboard from '../pages/owner/OwnerDashboard'
import MyVehicles from '../pages/owner/MyVehicles'
import AddVehicle from '../pages/owner/AddVehicle'
import EditVehicle from '../pages/owner/EditVehicle'
import VehicleAvailability from '../pages/owner/VehicleAvailability'
import OwnerBookings from '../pages/owner/OwnerBookings'
import OwnerEarnings from '../pages/owner/OwnerEarnings'
import OwnerProfile from '../pages/owner/Profile'

import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminVehicles from '../pages/admin/AdminVehicles'
import AdminUsers from '../pages/admin/AdminUsers'
import AdminBookings from '../pages/admin/AdminBookings'
import AdminPayments from '../pages/admin/AdminPayments'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public — no auth required */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/vehicles" element={<VehicleBrowse />} />
        <Route path="/vehicles/:id" element={<VehicleDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Shared — any authenticated user, viewed by whichever party (renter/owner) it belongs to */}
      <Route element={<SharedLayout />}>
        <Route
          path="/bookings/:id"
          element={
            <ProtectedRoute>
              <BookingDetail />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Renter section */}
      <Route element={<RenterLayout />}>
        <Route
          path="/renter/dashboard"
          element={
            <RoleRoute role="RENTER">
              <RenterDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/renter/bookings"
          element={
            <RoleRoute role="RENTER">
              <MyBookings />
            </RoleRoute>
          }
        />
        <Route
          path="/renter/favorites"
          element={
            <RoleRoute role="RENTER">
              <Favorites />
            </RoleRoute>
          }
        />
        <Route
          path="/renter/profile"
          element={
            <ProtectedRoute>
              <RenterProfile />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Owner section */}
      <Route element={<OwnerLayout />}>
        <Route
          path="/owner/dashboard"
          element={
            <RoleRoute role="OWNER">
              <OwnerDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/owner/vehicles"
          element={
            <RoleRoute role="OWNER">
              <MyVehicles />
            </RoleRoute>
          }
        />
        <Route
          path="/owner/vehicles/new"
          element={
            <RoleRoute role="OWNER">
              <AddVehicle />
            </RoleRoute>
          }
        />
        <Route
          path="/owner/vehicles/:id/edit"
          element={
            <RoleRoute role="OWNER">
              <EditVehicle />
            </RoleRoute>
          }
        />
        <Route
          path="/owner/vehicles/:id/availability"
          element={
            <RoleRoute role="OWNER">
              <VehicleAvailability />
            </RoleRoute>
          }
        />
        <Route
          path="/owner/bookings"
          element={
            <RoleRoute role="OWNER">
              <OwnerBookings />
            </RoleRoute>
          }
        />
        <Route
          path="/owner/earnings"
          element={
            <RoleRoute role="OWNER">
              <OwnerEarnings />
            </RoleRoute>
          }
        />
        <Route
          path="/owner/profile"
          element={
            <ProtectedRoute>
              <OwnerProfile />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Admin section — separate layout entirely, per spec */}
      <Route element={<AdminLayout />}>
        <Route
          path="/admin/dashboard"
          element={
            <RoleRoute role="ADMIN">
              <AdminDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/vehicles"
          element={
            <RoleRoute role="ADMIN">
              <AdminVehicles />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <RoleRoute role="ADMIN">
              <AdminUsers />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <RoleRoute role="ADMIN">
              <AdminBookings />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/payments"
          element={
            <RoleRoute role="ADMIN">
              <AdminPayments />
            </RoleRoute>
          }
        />
      </Route>

      <Route path="/not-authorized" element={<NotAuthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
