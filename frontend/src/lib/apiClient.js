import axios from 'axios'

// Shared Axios client for the FastAPI backend.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
})

export default apiClient