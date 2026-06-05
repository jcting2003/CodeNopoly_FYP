import axios from 'axios'
import { Platform } from 'react-native'

const fallbackBaseURL =
  Platform.OS === 'web'
    ? 'http://localhost:8000'
    : 'http://192.168.0.11:8000'

const baseURL = process.env.EXPO_PUBLIC_API_URL || fallbackBaseURL
console.log('API BASE URL:', `${baseURL}/api`)
const api = axios.create({
  baseURL: `${baseURL}/api`,
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