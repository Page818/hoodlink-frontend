// services/api.js
import axios from 'axios'

const API_BASE_URL = process.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
