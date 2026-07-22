import Echo from 'laravel-echo'
import PusherModule from 'pusher-js/react-native'
import { backendBaseURL } from './api'
import { getStoredToken } from '../context/AuthContext'

let echoInstance: Echo<'pusher'> | null = null

const PusherClient =
  (
    (PusherModule as { default?: unknown; Pusher?: unknown }).default ??
    (PusherModule as { Pusher?: unknown }).Pusher ??
    PusherModule
  ) as new (
  key: string,
  options: Record<string, any>
) => any

export const getEcho = async () => {
  const token = await getStoredToken()

  if (!token) {
    console.log('No token found for Echo.')
    return null
  }

  if (echoInstance) {
    return echoInstance
  }

  const pusherKey = process.env.EXPO_PUBLIC_PUSHER_APP_KEY
  const pusherCluster = process.env.EXPO_PUBLIC_PUSHER_APP_CLUSTER
  const apiUrl = backendBaseURL

  if (!pusherKey || !pusherCluster || !apiUrl) {
    console.log('Missing Echo env values:', {
      pusherKey,
      pusherCluster,
      apiUrl,
    })

    return null
  }

  const pusherClient = new PusherClient(pusherKey, {
    cluster: pusherCluster,
    forceTLS: true,
    encrypted: true,
    authEndpoint: `${apiUrl}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    },
  })

  echoInstance = new Echo({
    broadcaster: 'pusher',
    client: pusherClient,
  })

  return echoInstance
}

export const disconnectEcho = () => {
  if (echoInstance) {
    echoInstance.disconnect()
    echoInstance = null
  }
}
