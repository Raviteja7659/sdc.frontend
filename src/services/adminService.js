import { vehicleService } from './vehicleService'

/**
 * IMPORTANT — read before wiring real data in here.
 *
 * user-service, booking-service, and payment-service currently have
 * NO "list everything, admin-only" endpoint — only per-user/per-owner/
 * per-vehicle lookups. So a true platform-wide admin view of all
 * users, all bookings, or all payments isn't fetchable today.
 *
 * Per the spec's own instruction ("use realistic mock data initially
 * if backend APIs are not available, but keep the data-access layer
 * separated so it can later be replaced with real APIs"), the
 * functions below return clearly-shaped MOCK data for those three
 * sections, matching the exact response shape the real endpoints
 * would need to return. Every page that calls these renders a visible
 * "Demo data" banner — this is scaffolding, not a claim that the data
 * is real.
 *
 * To make these real: add admin-only GET /api/v1/users,
 * GET /api/v1/bookings, and GET /api/v1/payments to the respective
 * services (role-gated to ADMIN, same pattern as the vehicle status
 * endpoint already uses), then replace the bodies below with
 * apiClient.get(...) calls — the calling pages don't need to change.
 */

const MOCK_USERS = [
  { id: 1, fullName: 'Ravi Teja', email: 'ravi@example.com', roles: ['OWNER', 'RENTER'], enabled: true, createdAt: '2026-06-01T10:00:00' },
  { id: 2, fullName: 'Ananya Rao', email: 'ananya@example.com', roles: ['RENTER'], enabled: true, createdAt: '2026-06-14T09:20:00' },
  { id: 3, fullName: 'Vikram Iyer', email: 'vikram@example.com', roles: ['OWNER'], enabled: true, createdAt: '2026-07-02T15:45:00' },
]

const MOCK_BOOKINGS = [
  { id: 101, vehicleId: 1, renterId: 2, ownerId: 1, status: 'COMPLETED', totalAmount: 1800, createdAt: '2026-07-10T08:00:00' },
  { id: 102, vehicleId: 3, renterId: 2, ownerId: 3, status: 'CONFIRMED', totalAmount: 900, createdAt: '2026-08-01T11:00:00' },
  { id: 103, vehicleId: 1, renterId: 2, ownerId: 1, status: 'CANCELLED', totalAmount: 450, createdAt: '2026-08-05T18:30:00' },
]

const MOCK_PAYMENTS = [
  { id: 201, bookingId: 101, amount: 1800, method: 'UPI', status: 'SUCCESS', transactionId: 'MOCK-a1b2', createdAt: '2026-07-10T08:05:00' },
  { id: 202, bookingId: 102, amount: 900, method: 'CARD', status: 'SUCCESS', transactionId: 'MOCK-c3d4', createdAt: '2026-08-01T11:05:00' },
  { id: 203, bookingId: 103, amount: 450, method: 'UPI', status: 'REFUNDED', transactionId: 'MOCK-e5f6', createdAt: '2026-08-05T18:35:00' },
]

function delay(data) {
  return new Promise((resolve) => setTimeout(() => resolve({ data }), 250))
}

export const adminService = {
  // Real — vehicle-service already supports listing everything.
  getAllVehicles: () => vehicleService.list(),

  // Mock — see banner note above.
  getAllUsers: () => delay(MOCK_USERS),
  getAllBookings: () => delay(MOCK_BOOKINGS),
  getAllPayments: () => delay(MOCK_PAYMENTS),
  isMockSection: true,
}
