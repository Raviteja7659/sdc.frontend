import { apiClient } from './apiClient'

export const vehicleService = {
  list: () => apiClient.get('/api/v1/vehicles'),
  getById: (id) => apiClient.get(`/api/v1/vehicles/${id}`),
  searchByCity: (city) => apiClient.get('/api/v1/vehicles/search', { params: { city } }),
  getByOwner: (ownerId) => apiClient.get(`/api/v1/vehicles/owner/${ownerId}`),
  // Uber/Rapido-style "vehicles near me", using the vehicle's real
  // lat/lng and the Haversine-based query in vehicle-service.
  findNearby: (lat, lng, radiusKm = 10) =>
    apiClient.get('/api/v1/vehicles/nearby', { params: { lat, lng, radiusKm } }),

  create: (payload) => apiClient.post('/api/v1/vehicles', payload),
  update: (id, payload) => apiClient.put(`/api/v1/vehicles/${id}`, payload),
  updateStatus: (id, status) => apiClient.patch(`/api/v1/vehicles/${id}/status`, null, { params: { status } }),
  remove: (id) => apiClient.delete(`/api/v1/vehicles/${id}`),
}
