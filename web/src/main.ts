import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from 'vue-toastification'

import 'vue-toastification/dist/index.css'
import App from './App.vue'
import router from './router'
import './assets/css/mainPage.css'
import './lib/echo'

import { useAuthStore } from '@/stores/auth'

const app = createApp(App)
const pinia = createPinia()


app.use(pinia)
app.use(router)
app.use(Toast, {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
})

const authStore = useAuthStore()

app.mount('#app')
void authStore.fetchUser()
