import axios from 'axios'

const api = axios.create({
  baseURL: 'http://192.168.0.12:8000',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common.Authorization
  }
}

export default api