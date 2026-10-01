import { apiClient } from './apiClient'

export const bookingService = {
  create: (payload) => apiClient.post('/api/v1/bookings', payload),
  getById: (id) => apiClient.get(`/api/v1/bookings/${id}`),
  getByRenter: (renterId) => apiClient.get(`/api/v1/bookings/renter/${renterId}`),
  getByOwner: (ownerId) => apiClient.get(`/api/v1/bookings/owner/${ownerId}`),
  getByVehicle: (vehicleId) => apiClient.get(`/api/v1/bookings/vehicle/${vehicleId}`),
  checkAvailability: (vehicleId, start, end) =>
    apiClient.get('/api/v1/bookings/availability', { params: { vehicleId, start, end } }),

  confirm: (id) => apiClient.patch(`/api/v1/bookings/${id}/confirm`),
  complete: (id) => apiClient.patch(`/api/v1/bookings/${id}/complete`),
  cancel: (id, reason) => apiClient.patch(`/api/v1/bookings/${id}/cancel`, null, { params: { reason } }),
}
