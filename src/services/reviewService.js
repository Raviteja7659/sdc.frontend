import { apiClient } from './apiClient'

export const reviewService = {
  create: (payload) => apiClient.post('/api/v1/reviews', payload),
  getById: (id) => apiClient.get(`/api/v1/reviews/${id}`),
  getByVehicle: (vehicleId) => apiClient.get(`/api/v1/reviews/vehicle/${vehicleId}`),
  getSummary: (vehicleId) => apiClient.get(`/api/v1/reviews/vehicle/${vehicleId}/summary`),
  getByRenter: (renterId) => apiClient.get(`/api/v1/reviews/renter/${renterId}`),
  getByOwner: (ownerId) => apiClient.get(`/api/v1/reviews/owner/${ownerId}`),
  remove: (id) => apiClient.delete(`/api/v1/reviews/${id}`),
}
