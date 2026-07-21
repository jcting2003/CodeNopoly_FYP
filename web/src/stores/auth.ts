import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import axios from 'axios'
import api from '@/services/api'

export type AuthUser = {
  id: number
  name?: string
  username?: string
  email: string
  role: 'player' | 'admin'
  profile_photo_url?: string | null
}

type LoginPayload = {
  email: string
  password: string
}

type RegisterPayload = {
  name: string
  email: string
  password: string
  password_confirmation: string
}

type ForgotPasswordPayload = {
  email: string
}

type ForgotPasswordResponse = {
  message: string
  reset_url?: string
}

type ResetPasswordPayload = {
  token: string
  email: string
  password: string
  password_confirmation: string
}

type ApiErrorResponse = {
  message?: string
  error?: string
  errors?: Record<string, string[]>
  user?: AuthUser
}

function getErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError<ApiErrorResponse>(err)) {
    const data = err.response?.data

    if (data?.errors) {
      const firstKey = Object.keys(data.errors)[0]
      const firstMessage = firstKey ? data.errors[firstKey]?.[0] : null
      if (firstMessage) return firstMessage
    }

    return data?.message || data?.error || fallback
  }

  return fallback
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const initialized = ref(false)
  let fetchUserPromise: Promise<AuthUser | null> | null = null

  const isLoggedIn = computed(() => user.value !== null)

  type UserResponse = {
    user: AuthUser
  }

  async function fetchUser() {
    if (initialized.value) {
      return user.value
    }

    if (fetchUserPromise) {
      return fetchUserPromise
    }

    fetchUserPromise = (async () => {
      try{
        const response = await api.get<{user: AuthUser}>('/api/user')
        user.value = response.data.user
        return user.value
      }catch{
        user.value = null
        return null
      }finally{
        initialized.value = true
        fetchUserPromise = null
      }
    })()

    return fetchUserPromise
  }

  async function refreshUser() {
    initialized.value = false
    return fetchUser()
  }

  async function login(payload: LoginPayload) {
    loading.value = true
    error.value = null

    try {
      await api.get('/sanctum/csrf-cookie')
      const response = await api.post<{message: string; user: AuthUser}>('/api/login' ,payload)
      user.value = response.data.user
      initialized.value = true
      return response.data
    } catch (err: unknown) {
      console.log('Login backend error:', axios.isAxiosError(err) ? err.response?.data : err)
      error.value = getErrorMessage(err, 'Login failed.')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function register(payload: RegisterPayload) {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/api/register', payload)
      return response.data
    } catch (err: unknown) {
      console.log('Register backend error:', axios.isAxiosError(err) ? err.response?.data : err)
      error.value = getErrorMessage(err, 'Registration failed.')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function forgotPassword(payload: ForgotPasswordPayload) {
    loading.value = true
    error.value = null

    try {
      const response = await api.post<ForgotPasswordResponse>('/api/forgot-password', payload)
      return response.data
    } catch (err: unknown) {
      console.log('Forgot password backend error:', axios.isAxiosError(err) ? err.response?.data : err)
      error.value = getErrorMessage(err, 'Unable to send reset email.')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function resetPassword(payload: ResetPasswordPayload) {
    loading.value = true
    error.value = null

    try {
      const response = await api.post<{ message: string }>('/api/reset-password', payload)
      return response.data
    } catch (err: unknown) {
      console.log('Reset password backend error:', axios.isAxiosError(err) ? err.response?.data : err)
      error.value = getErrorMessage(err, 'Unable to reset password.')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await api.post('/api/logout')
    } finally {
      user.value = null
      error.value = null
      initialized.value = true
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    user,
    loading,
    error,
    isLoggedIn,
    initialized,
    fetchUser,
    refreshUser,
    login,
    register,
    forgotPassword,
    resetPassword,
    logout,
    clearError,
  }
})
