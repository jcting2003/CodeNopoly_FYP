import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import axios from 'axios'
import type { ChannelAuthorizationCallback, ChannelAuthorizerGenerator } from 'pusher-js'
import type { ChannelAuthorizationData } from 'pusher-js/types/src/core/auth/options'
import api from '@/services/api'

declare global {
  interface Window {
    Pusher: typeof Pusher
    axios: typeof axios
  }
}

window.Pusher = Pusher
window.axios = axios

axios.defaults.withCredentials = true
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers.common['Accept'] = 'application/json'

const apiBaseUrl =
  typeof api.defaults.baseURL === 'string' && api.defaults.baseURL.length > 0
    ? api.defaults.baseURL
    : window.location.origin

const authEndpoint = new URL('/broadcasting/auth', apiBaseUrl).toString()

const echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  forceTLS: true,
  authEndpoint,
  auth: {
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      Accept: 'application/json',
    },
  },
  authorizer: ((channel) => {
    return {
      authorize: (
        socketId: string,
        callback: ChannelAuthorizationCallback
      ) => {
        api.post(
          '/broadcasting/auth',
          {
            socket_id: socketId,
            channel_name: channel.name,
          }
        )
          .then((response) => {
            callback(null, response.data as ChannelAuthorizationData)
          })
          .catch((error: Error) => {
            callback(error, null)
          })
      },
    }
  }) as ChannelAuthorizerGenerator,
})

export default echo
