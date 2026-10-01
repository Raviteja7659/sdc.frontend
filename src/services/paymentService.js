import { apiClient } from './apiClient'

export const paymentService = {
  pay: (payload) => apiClient.post('/api/v1/payments', payload),
  getById: (id) => apiClient.get(`/api/v1/payments/${id}`),
  getByBooking: (bookingId) => apiClient.get(`/api/v1/payments/booking/${bookingId}`),
  getByRenter: (renterId) => apiClient.get(`/api/v1/payments/renter/${renterId}`),
  getByOwner: (ownerId) => apiClient.get(`/api/v1/payments/owner/${ownerId}`),
  refund: (id) => apiClient.patch(`/api/v1/payments/${id}/refund`),
}
