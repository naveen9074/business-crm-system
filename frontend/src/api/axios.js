/**
 * Axios instance configured for the CRM backend API.
 * Automatically attaches JWT token to all requests.
 */
import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor — attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('crms_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor — handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('crms_token')
      localStorage.removeItem('crms_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
