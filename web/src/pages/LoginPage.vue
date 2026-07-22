<template>
  <div class="bg-background text-on-background min-h-screen flex flex-col">
    <main class="flex-grow flex items-center justify-center p-4 md:p-8 lg:p-12">
      <div
        class="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 bg-surface-container-low rounded-3xl overflow-hidden shadow-2xl shadow-on-surface/5"
      >
        <!-- Left Side -->
        <div class="hidden md:flex flex-col bg-inverse-surface p-10 relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-inverse-surface to-black opacity-50"></div>

          <div class="relative z-10 flex flex-col h-full items-center justify-center">
            <div class="relative flex flex-col items-center">
              <div
                class="w-64 h-64 rounded-3xl bg-primary transform rotate-3 flex items-center justify-center shadow-2xl relative overflow-hidden"
              >
                <div
                  class="absolute inset-0 opacity-10"
                  style="background-image: radial-gradient(#fff 1px, transparent 1px); background-size: 20px 20px;"
                ></div>

                <div class="transform -rotate-3 flex flex-col items-center">
                  <div class="relative">
                    <span class="material-symbols-outlined text-[120px] text-on-primary font-bold drop-shadow-lg">
                      token
                    </span>

                    <div
                      class="absolute -bottom-2 -right-2 bg-tertiary w-12 h-12 rounded-full border-4 border-primary flex items-center justify-center"
                    >
                      <span class="material-symbols-outlined text-on-tertiary-container text-2xl font-bold">
                        terminal
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-12 text-center">
                <h1 class="text-5xl font-display font-extrabold text-on-primary tracking-tighter">
                  CodeNopoly<span class="animate-pulse text-tertiary-fixed-dim inline-block ml-1">_</span>
                </h1>
                <p class="text-outline-variant font-body mt-2 text-lg opacity-80 uppercase tracking-widest">
                  The Logic of Wealth
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side -->
        <div class="bg-surface-container-lowest p-8 md:p-12 flex flex-col justify-center">
          <div class="mb-10 flex justify-between items-end">
            <div>
              <h1 class="text-4xl font-display font-extrabold tracking-tighter text-on-surface">
                CodeNopoly
              </h1>
              <p class="text-on-surface-variant font-body mt-1">Access the main frame</p>
            </div>

            <div class="hidden sm:block">
              <span class="material-symbols-outlined text-4xl text-primary-dim">terminal</span>
            </div>
          </div>

          <div class="flex p-1.5 bg-surface-container-low rounded-full mb-10 w-full max-w-xs mx-auto">
            <button
              type="button"
              @click="switchTab('login')"
              :class="[
                'flex-1 py-2 text-sm font-label font-semibold rounded-full transition-all',
                activeTab === 'login'
                  ? 'text-on-primary-container bg-primary-container shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              ]"
            >
              Login
            </button>

            <button
              type="button"
              @click="switchTab('register')"
              :class="[
                'flex-1 py-2 text-sm font-label font-semibold rounded-full transition-all',
                activeTab === 'register'
                  ? 'text-on-primary-container bg-primary-container shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              ]"
            >
              Register
            </button>
          </div>

          <!-- Login -->
          <div v-if="activeTab === 'login'" class="space-y-6">
            <div class="space-y-4">
              <div class="space-y-1">
                <label class="text-xs font-label font-bold uppercase tracking-wider text-on-surface-variant ml-1">
                  Email Endpoint
                </label>

                <input
                  v-model="loginForm.email"
                  class="w-full h-14 px-6 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/40 font-body transition-all text-on-surface placeholder:text-outline"
                  placeholder="dev@pythonopoly.io"
                  type="email"
                />
              </div>

              <div class="space-y-1">
                <div class="flex justify-between items-center px-1">
                  <label class="text-xs font-label font-bold uppercase tracking-wider text-on-surface-variant">
                    Access Secret
                  </label>

                  <a class="text-xs font-label text-primary hover:underline" href="#">
                    Forgot Secret?
                  </a>
                </div>

                <input
                  v-model="loginForm.password"
                  class="w-full h-14 px-6 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/40 font-body transition-all text-on-surface"
                  placeholder="••••••••"
                  type="password"
                />
              </div>
            </div>
            <p
              v-if="successMessage"
              class="text-sm text-green-600 font-medium"
            >
              {{ successMessage }}
            </p>
            <p v-if="authStore.error" class="text-sm text-red-600 font-medium">
              {{ authStore.error }}
            </p>

            <button
              type="button"
              @click="handleLogin"
              :disabled="authStore.loading"
              class="w-full h-14 rounded-full bg-gradient-to-r from-primary to-primary-dim text-on-primary font-label font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span>{{ authStore.loading ? 'Logging in...' : 'Execute Login' }}</span>
              <span class="material-symbols-outlined text-xl">login</span>
            </button>
          </div>

          <!-- Register -->
          <div v-else class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-xs font-label font-bold uppercase tracking-wider text-on-surface-variant ml-1">
                  Handle
                </label>

                <input
                  v-model="registerForm.username"
                  class="w-full h-14 px-6 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/40 font-body text-on-surface"
                  placeholder="py_coder"
                  type="text"
                />
              </div>

              <div class="space-y-1">
                <label class="text-xs font-label font-bold uppercase tracking-wider text-on-surface-variant ml-1">
                  Email
                </label>

                <input
                  v-model="registerForm.email"
                  class="w-full h-14 px-6 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/40 font-body text-on-surface"
                  placeholder="dev@mail.com"
                  type="email"
                />
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-xs font-label font-bold uppercase tracking-wider text-on-surface-variant ml-1">
                Access Secret
              </label>

              <input
                v-model="registerForm.password"
                class="w-full h-14 px-6 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/40 font-body text-on-surface"
                placeholder="••••••••"
                type="password"
              />
            </div>

            <div class="space-y-1">
              <label class="text-xs font-label font-bold uppercase tracking-wider text-on-surface-variant ml-1">
                Confirm Secret
              </label>

              <input
                v-model="registerForm.confirmPassword"
                class="w-full h-14 px-6 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/40 font-body text-on-surface"
                placeholder="••••••••"
                type="password"
              />
            </div>

            <p v-if="authStore.error" class="text-sm text-red-600 font-medium">
              {{ authStore.error }}
            </p>

            <button
              type="button"
              @click="handleRegister"
              :disabled="authStore.loading"
              class="w-full h-14 rounded-full bg-gradient-to-r from-secondary to-secondary-dim text-on-secondary font-label font-bold text-lg shadow-lg shadow-secondary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span>{{ authStore.loading ? 'Registering...' : 'Initialize Profile' }}</span>
              <span class="material-symbols-outlined text-xl">person_add</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const activeTab = ref<'login' | 'register'>('login')
const successMessage = ref('')

const loginForm = reactive({
  email: '',
  password: '',
})

const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const switchTab = (tab: 'login' | 'register') => {
  activeTab.value = tab
  authStore.clearError()
  successMessage.value = ''
}

const handleLogin = async () => {
  authStore.clearError()
  successMessage.value = ''

  try {
    await authStore.login({
      email: loginForm.email,
      password: loginForm.password,
    })

    router.push('/dashboard')
  } catch (error) {
    console.error('Login failed:', error)
  }
}

const handleRegister = async () => {
  authStore.clearError()
  successMessage.value = ''

  if (registerForm.password !== registerForm.confirmPassword) {
    authStore.error = 'Passwords do not match.'
    return
  }

  try {
    await authStore.register({
      name: registerForm.username,
      email: registerForm.email,
      password: registerForm.password,
      password_confirmation: registerForm.confirmPassword,
    })

    successMessage.value = 'Registration successful. Please log in.'

    // Prefill login form
    loginForm.email = registerForm.email
    loginForm.password = ''

    // Clear register form
    registerForm.username = ''
    registerForm.email = ''
    registerForm.password = ''
    registerForm.confirmPassword = ''

    // Switch back to login tab
    activeTab.value = 'login'
  } catch (error) {
    console.error('Register failed:', error)
  }
}
</script>