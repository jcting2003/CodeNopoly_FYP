import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import { Platform } from 'react-native'
import * as SecureStore from 'expo-secure-store'
import api, { setAuthToken } from '../services/api'

type User = {
  id: number
  name: string
  email: string
}

type LoginResponse = {
  token: string
  user: User
}

type AuthContextValue = {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const TOKEN_KEY = 'codenopoly_token'

const saveToken = async (value: string) => {
  if (Platform.OS === 'web') {
    localStorage.setItem(TOKEN_KEY, value)
    return
  }

  await SecureStore.setItemAsync(TOKEN_KEY, value)
}

const getStoredToken = async () => {
  if (Platform.OS === 'web') {
    return localStorage.getItem(TOKEN_KEY)
  }

  return SecureStore.getItemAsync(TOKEN_KEY)
}

const removeStoredToken = async () => {
  if (Platform.OS === 'web') {
    localStorage.removeItem(TOKEN_KEY)
    return
  }

  await SecureStore.deleteItemAsync(TOKEN_KEY)
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    try {
      const response = await api.get<User>('/api/user')
      setUser(response.data)
    } catch (error: any) {
      if (error.response?.status === 401) {
        await removeStoredToken()
        setAuthToken(null)
        setToken(null)
        setUser(null)
      }

      throw error
    }
  }

  const login = async (email: string, password: string) => {
    const response = await api.post<LoginResponse>('/api/login', {
      email,
      password,
      device_name: 'expo_mobile',
    })

    const newToken = response.data.token

    await saveToken(newToken)
    setAuthToken(newToken)
    setToken(newToken)
    setUser(response.data.user)
  }

  const logout = async () => {
    try {
      await api.post('/api/logout')
    } catch {
      // Ignore backend logout failure and clear local session anyway.
    }

    await removeStoredToken()
    setAuthToken(null)
    setToken(null)
    setUser(null)
  }

  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedToken = await getStoredToken()

        if (storedToken) {
          setAuthToken(storedToken)
          setToken(storedToken)
          await refreshUser()
        }
      } catch {
        await removeStoredToken()
        setAuthToken(null)
        setToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadSession()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}