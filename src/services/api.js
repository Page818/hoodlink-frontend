// services/api.js
import axios from 'axios'

// const VITE_API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || ''}/api`
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// 20250901
const api = axios.create({
  baseURL: VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 原始
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
