import { apiClient } from './apiClient'

export const authService = {
  register: (payload) => apiClient.post('/api/v1/auth/register', payload),
  login: (payload) => apiClient.post('/api/v1/auth/login', payload),
  bootstrapAdmin: (payload) => apiClient.post('/api/v1/auth/bootstrap-admin', payload),

  getCurrentUser: () => apiClient.get('/api/v1/users/me'),
  getUserById: (id) => apiClient.get(`/api/v1/users/${id}`),
  updateRoles: (id, roles) => apiClient.patch(`/api/v1/users/${id}/roles`, { roles }),
  changePassword: (currentPassword, newPassword) =>
    apiClient.put('/api/v1/users/password', { currentPassword, newPassword }),

  // NOT backed by a real endpoint yet — user-service has no
  // password-reset flow. Kept here (rather than left out entirely)
  // so ForgotPassword.jsx has a real call site to swap in once
  // user-service grows one; today it always rejects.
  requestPasswordReset: () =>
    Promise.reject({
      response: { data: { message: 'Password reset isn\u2019t available yet \u2014 this needs a new user-service endpoint.' } },
    }),
}
