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

type UserResponse =
  | User
  | {
      user: User
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
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

type RegisterPayload = {
  name: string
  email: string
  password: string
  password_confirmation: string
}

type RegisterResponse = {
  message: string
  token: string
  user: User
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const TOKEN_KEY = 'pythonopoly_token'

const saveToken = async (value: string) => {
  if (Platform.OS === 'web') {
    localStorage.setItem(TOKEN_KEY, value)
    return
  }

  await SecureStore.setItemAsync(TOKEN_KEY, value)
}

export const getStoredToken = async () => {
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
  const response = await api.get<UserResponse>('/user')

  if ('user' in response.data) {
    setUser(response.data.user)
  } else {
    setUser(response.data)
  }
}

  const register = async (payload: RegisterPayload) => {
    const response = await api.post<RegisterResponse>('/register', {
      ...payload,
      device_name: `expo_mobile_${Platform.OS}`,
    })

    const newToken = response.data.token

    await saveToken(newToken)
    setAuthToken(newToken)
    setToken(newToken)
    setUser(response.data.user)
  }

const login = async (email: string, password: string) => {
  const response = await api.post<LoginResponse>('/login', {
    email,
    password,
    device_name: `expo_mobile_${Platform.OS}`,
  })

  const newToken = response.data.token

  await saveToken(newToken)
  setAuthToken(newToken)
  setToken(newToken)
  setUser(response.data.user)
}

const logout = async () => {
  try {
    await api.post('/logout')
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
        register,
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