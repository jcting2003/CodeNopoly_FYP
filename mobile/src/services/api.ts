import axios from 'axios'
import { Platform } from 'react-native'

const envBaseURL = process.env.EXPO_PUBLIC_API_URL

if (!envBaseURL) {
  console.warn(
    'EXPO_PUBLIC_API_URL is not set. Please set it in your .env file.'
  )
}

export const backendBaseURL = (
  envBaseURL ||
  (Platform.OS === 'web' ? 'http://localhost:8000' : 'http://10.0.2.2:8000')
)
  .replace(/\/api\/?$/, '')
  .replace(/\/$/, '')

console.log('BACKEND BASE URL:', backendBaseURL)
console.log('API BASE URL:', `${backendBaseURL}/api`)

const api = axios.create({
  baseURL: `${backendBaseURL}/api`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    // Prevent ngrok free-tier browser interstitials from being returned to XHR/fetch calls.
    ...(backendBaseURL.includes('ngrok') ? { 'ngrok-skip-browser-warning': 'true' } : {}),
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
