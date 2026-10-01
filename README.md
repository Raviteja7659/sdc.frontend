# SelfDriveConnect — Frontend

A React (Vite) SPA restructured around the spec in `Self_Drive_Connect_Frontend_Specification.docx` — role-based layouts, a real service layer, and a shared component library. It talks to a single **api-gateway** instance on port `8087`, which routes internally to all five backend services.

## What changed in this pass

The spec describes a bigger marketplace than the five backend services currently support (favorites, notifications, password reset, driver license verification, multi-image vehicle listings, owner payouts, full admin CRUD). Rather than either ignore the spec or fake features that don't exist, this pass:

1. **Fully adopted the architecture** — folder structure, layouts, routing, service layer, and component library, all backend-agnostic and genuinely better regardless of feature completeness.
2. **Built every feature the backend actually supports**, often better than before (vehicle edit — the PUT endpoint existed but had no UI; a real filter sidebar/drawer for browsing; date-aware Upcoming/Active/Completed/Cancelled tabs; a real "remember me" via localStorage-vs-sessionStorage).
3. **For features with no backend support, followed the spec's own instruction** ("use realistic mock data initially... keep the data-access layer separated") rather than building nothing or faking something silently. Every mocked section says so visibly in the UI.

## Folder structure

```
src/
  layouts/            PublicLayout, RenterLayout, OwnerLayout, AdminLayout, SharedLayout
  routes/              AppRoutes.jsx (all route definitions), ProtectedRoute, RoleRoute (role-gated guard)
  services/            apiClient.js (shared axios + gateway URL) + one file per domain:
                        authService, vehicleService, bookingService, paymentService,
                        reviewService, adminService
  components/
    common/            Button, Input, Modal, ConfirmDialog, Drawer, Loader, EmptyState,
                        ErrorState, StatCard, StatusBadge, Navbar, Footer,
                        NotificationsPanel, ComingSoonList
    vehicle/           VehicleCard, VehicleCardSkeleton, VehicleFilters
    booking/           BookingCard
    owner/             VehicleForm (shared by Add/Edit)
  context/             AuthContext, FavoritesContext
  pages/
    public/            Home, Login, Register, ForgotPassword, NotAuthorized, NotFound
    renter/             RenterDashboard, VehicleBrowse, VehicleDetail, BookingDetail,
                        MyBookings, Favorites, Profile
    owner/              OwnerDashboard, MyVehicles, AddVehicle, EditVehicle,
                        VehicleAvailability, OwnerBookings, OwnerEarnings, Profile
    admin/              AdminDashboard, AdminVehicles, AdminUsers, AdminBookings, AdminPayments
  index.css            design tokens + all component styles
```

## Routes

| Path | Layout | Guard | Notes |
|---|---|---|---|
| `/` | Public | none | Rebuilt as a real marketing landing (hero search, popular vehicles, why-us, how-it-works, owner CTA) |
| `/vehicles`, `/vehicles/:id` | Public | none | Browsing stays public, matching the backend's own rule |
| `/login`, `/register`, `/forgot-password` | Public | none | Split into separate pages/routes per the spec |
| `/bookings/:id` | Shared | any authenticated user | Viewed by both renter and owner — see "Known deviations" below |
| `/renter/dashboard`, `/renter/bookings`, `/renter/favorites`, `/renter/profile` | Renter | `RoleRoute role="RENTER"` | |
| `/owner/dashboard`, `/owner/vehicles`, `/owner/vehicles/new`, `/owner/vehicles/:id/edit`, `/owner/vehicles/:id/availability`, `/owner/bookings`, `/owner/earnings`, `/owner/profile` | Owner | `RoleRoute role="OWNER"` | |
| `/admin/dashboard`, `/admin/vehicles`, `/admin/users`, `/admin/bookings`, `/admin/payments` | Admin | `RoleRoute role="ADMIN"` | Separate layout, per the spec's explicit "don't mix admin nav" instruction |
| `/not-authorized` | none | — | 403 page, shown when `RoleRoute` blocks a logged-in user missing the required role |

Since roles are a **set** on the backend (a user can hold RENTER + OWNER + ADMIN simultaneously), `RoleRoute` checks "does this user have at least this role," not "is this their only role" — someone can freely move between `/renter/...` and `/owner/...` if they hold both.

## Real features built this pass

- **Vehicle edit** (`/owner/vehicles/:id/edit`) — the backend's `PUT /api/v1/vehicles/{id}` existed but had no UI before now
- **Filter sidebar (desktop) / drawer (mobile)** for vehicle browsing — fuel, transmission, seats, max price, sort
- **Date-aware booking tabs** — Upcoming/Active/Completed/Cancelled computed client-side from status + dates, not just raw backend status
- **Real "remember me"** — checked → token in `localStorage` (persists); unchecked → `sessionStorage` (cleared when the tab closes). Not cosmetic.
- **Owner earnings page** — real totals + a lightweight CSS bar chart from actual completed-booking data, no charting library needed
- **Owner "hosted by" panel** on vehicle detail — fetches the real owner profile via `GET /api/v1/users/{id}`
- **ConfirmDialog** for every destructive action (cancel booking, refund, reject listing) instead of firing immediately on click

## Honest gaps — mocked or unavailable, and why

| Feature | Status | Why |
|---|---|---|
| Favorites (`/renter/favorites`) | **Local-only** (localStorage) | No favorites-service or join table exists. Won't sync across devices. |
| Notifications (bell icon) | **Derived, not persisted** | No notification-service. Computed live from real booking data (upcoming trips, pending requests) each time you open it — not a stored/pushed notification system. |
| Admin Users/Bookings/Payments (`/admin/users`, `/admin/bookings`, `/admin/payments`) | **Mock data**, visible banner on each page | No admin-only "list everything" endpoint on user-service, booking-service, or payment-service. Real vehicle data is used on `/admin/vehicles` and `/admin/dashboard` since that endpoint *does* exist. `adminService.js` is written so swapping in real endpoints later is a one-line change per function. |
| Forgot password (`/forgot-password`) | **UI only, always shows an error** | No password-reset endpoint on user-service. The page is real and wired to a real service call — it's just honest that the call always fails right now. |
| Vehicle availability calendar | **Read-only** | Shows existing bookings as blocked ranges (real data). Manually blocking dates (e.g. for maintenance) isn't supported — would need a new capability on booking-service or vehicle-service. |
| Change password, delete account, payment methods, bank/payout info, driver license verification | **Not built** | No backend fields or endpoints exist for any of these. Listed explicitly on the Profile pages (`ComingSoonList` component) rather than silently missing. |
| Google/social login | **Not built** | Would need real OAuth provider setup — out of scope for a portfolio backend with no OAuth integration. |
| Multi-step vehicle listing wizard (7 steps, features checklist, weekly discount, security deposit, multi-image upload with primary image) | **Simplified to one form** | vehicle-service only stores the fields in the single `VehicleForm` component. Building a fake wizard around data that goes nowhere would be worse than a clean single form — see the comment at the top of `components/owner/VehicleForm.jsx`. |

## Known deviations from the spec's exact route list

- **Booking detail lives at `/bookings/:id`**, not spec's `/renter/bookings/:bookingId` — because the same page is viewed by both the renter and the owner of a booking, and nesting it under `/renter/...` would show the wrong nav to an owner following a link from `/owner/bookings`. It uses a neutral `SharedLayout` instead.
- **No dedicated Pagination component** — vehicle/booking lists are small enough at demo scale that "load everything" is fine; noted as a real gap for scale, not built to keep this pass focused.

## Setup

```bash
cd frontend
npm install
cp .env.example .env   # points at the gateway on :8087
npm run dev
```

Runs on **http://localhost:5173**. The api-gateway (and all five backend services) must already be running.
