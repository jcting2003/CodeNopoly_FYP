<template>
  <div class="bg-background text-on-background min-h-screen flex flex-col">
    <Navbar />

    <main
      class="flex-grow pt-32 pb-12 px-6 flex items-center justify-center relative overflow-hidden"
    >
      <div class="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl"></div>
      <div class="absolute bottom-[-10%] left-[-5%] w-[350px] h-[350px] bg-secondary/5 rounded-full blur-3xl"></div>

      <div class="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <!-- Left Side -->
        <div class="lg:col-span-5 space-y-6">
          <div
            class="inline-flex items-center gap-2 px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold tracking-widest uppercase font-label"
          >
            <span class="material-symbols-outlined text-sm">terminal</span>
            Ready for Deployment
          </div>

          <h1 class="text-6xl font-bold tracking-tighter text-on-surface leading-[0.9]">
            Join the <span class="text-primary">Logical</span> Arena.
          </h1>

          <p class="text-on-surface-variant text-lg leading-relaxed max-w-md font-body">
            Enter your session credentials to sync with the board. Collaborative logic and syntax
            high-stakes are waiting.
          </p>

          <div class="flex gap-4 pt-4">
            <div class="flex -space-x-3">
              <div
                class="w-10 h-10 rounded-full border-2 border-surface-container-lowest bg-primary-container flex items-center justify-center text-primary"
              >
                <span class="material-symbols-outlined text-sm">person</span>
              </div>
              <div
                class="w-10 h-10 rounded-full border-2 border-surface-container-lowest bg-secondary-container flex items-center justify-center text-secondary"
              >
                <span class="material-symbols-outlined text-sm">person</span>
              </div>
              <div
                class="w-10 h-10 rounded-full border-2 border-surface-container-lowest bg-tertiary-container flex items-center justify-center text-tertiary"
              >
                <span class="material-symbols-outlined text-sm">person</span>
              </div>
              <div
                class="w-10 h-10 rounded-full border-2 border-surface-container-lowest bg-surface-container-highest flex items-center justify-center text-xs font-bold text-on-surface-variant"
              >
                +12
              </div>
            </div>

            <div class="text-sm">
              <p class="font-bold text-on-surface">15 Players Online</p>
              <p class="text-on-surface-variant">Active in 3 clusters</p>
            </div>
          </div>
        </div>

        <!-- Right Side -->
        <div class="lg:col-span-7 relative">
          <div
            class="bg-surface-container-lowest rounded-[2rem] p-1 shadow-[0_12px_40px_rgba(42,51,60,0.06)] relative z-10 overflow-hidden"
          >
            <div class="h-4 bg-primary rounded-t-[1.5rem]"></div>

            <div class="p-10 space-y-8">
              <div class="space-y-2">
                <label class="text-[10px] uppercase tracking-[0.2em] font-bold text-primary font-label">
                  Authentication Console
                </label>
                <h2 class="text-3xl font-bold text-on-surface tracking-tight">
                  Enter Game Code
                </h2>
              </div>

              <div class="space-y-4">
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <span
                      class="material-symbols-outlined text-primary/40 group-focus-within:text-primary transition-colors"
                    >
                      vpn_key
                    </span>
                  </div>

                  <input
                    v-model="gameCode"
                    type="text"
                    placeholder="e.g. PY-ALPHA-2024"
                    class="w-full bg-surface-container-low border-none rounded-2xl py-6 pl-14 pr-6 text-2xl font-bold text-on-surface placeholder:text-on-surface-variant/30 focus:ring-4 focus:ring-primary/10 transition-all font-headline tracking-widest uppercase"
                  />
                </div>

                <div
                  v-if="errorMessage"
                  class="bg-error-container/10 border border-error/10 rounded-xl p-4 flex items-start gap-4 transition-all"
                >
                  <div
                    class="bg-error-container text-on-error-container w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  >
                    <span class="material-symbols-outlined text-sm">error_outline</span>
                  </div>

                  <div class="space-y-0.5">
                    <p class="font-bold text-sm text-error">Access Denied</p>
                    <p class="text-xs text-on-surface-variant font-body">
                      {{ errorMessage }}
                    </p>
                  </div>
                </div>

                <div
                  v-if="successMessage"
                  class="bg-tertiary-container/20 border border-tertiary/10 rounded-xl p-4 flex items-start gap-4 transition-all"
                >
                  <div
                    class="bg-tertiary-container text-on-tertiary-container w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  >
                    <span class="material-symbols-outlined text-sm">check_circle</span>
                  </div>

                  <div class="space-y-0.5">
                    <p class="font-bold text-sm text-tertiary">Access Granted</p>
                    <p class="text-xs text-on-surface-variant font-body">
                      {{ successMessage }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="pt-2">
                <button
                  type="button"
                  @click="handleJoinGame"
                  :disabled="loading"
                  class="w-full bg-gradient-to-br from-primary to-primary-dim text-on-primary text-xl font-bold py-5 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 font-label tracking-tight disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {{ loading ? 'Joining...' : 'Execute Join' }}
                  <span class="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>

              <div class="flex items-center justify-between text-xs font-medium text-on-surface-variant pt-4 opacity-60">
                <span class="flex items-center gap-1">
                  <span class="w-2 h-2 bg-tertiary rounded-full"></span>
                  Server Status: Nominal
                </span>
                <span>Build v2.4.0-stable</span>
              </div>
            </div>
          </div>

          <div class="absolute -top-4 -right-4 w-full h-full bg-surface-container rounded-[2rem] -z-0 opacity-40"></div>
        </div>
      </div>
    </main>

    <footer class="mt-auto py-8 px-10 flex flex-col md:flex-row justify-between items-center gap-6">
      <div class="flex gap-8 text-sm font-medium text-on-surface-variant opacity-70 font-['Space_Grotesk']">
        <a class="hover:text-primary transition-colors" href="#">Open Source Docs</a>
        <a class="hover:text-primary transition-colors" href="#">Code Lab API</a>
        <a class="hover:text-primary transition-colors" href="#">Privacy Protocol</a>
      </div>

      <div class="flex items-center gap-6">
        <span class="text-xs tracking-widest uppercase text-on-surface-variant font-label opacity-40">
          Synthesized by Logic Team
        </span>

        <div class="flex gap-4">
          <button
            type="button"
            class="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-all"
          >
            <span class="material-symbols-outlined text-sm">help</span>
          </button>

          <button
            type="button"
            class="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-all"
          >
            <span class="material-symbols-outlined text-sm">code</span>
          </button>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Navbar from '@/components/NavBar.vue'
import api from '@/services/api'

type JoinGameResponse = {
  message?: string
  game?: {
    id: number
    game_code?: string
    status?: string
  }
}

type ApiErrorResponse = {
  message?: string
  errors?: Record<string, string[]>
}

const router = useRouter()

const gameCode = ref('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const handleJoinGame = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!gameCode.value.trim()) {
    errorMessage.value = 'Please enter a game code.'
    return
  }

  try {
    loading.value = true

    const response = await api.post<JoinGameResponse>('/api/games/join', {
      game_code: gameCode.value.trim().toUpperCase(),
    })

    const data = response.data

    successMessage.value = data.message || 'Joined game successfully.'

    if (data.game) {
      sessionStorage.setItem('joined_game', JSON.stringify(data.game))

      router.push({
        name: 'game-lobby',
        params: { id: data.game.id },
        query: { code: data.game.game_code || gameCode.value.trim().toUpperCase() },
      })
    }
  } catch (error: unknown) {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      const apiError = error.response?.data

      if (apiError?.errors) {
        const firstKey = Object.keys(apiError.errors)[0]
        errorMessage.value =
          (firstKey && apiError.errors[firstKey]?.[0]) ||
          apiError.message ||
          'Failed to join game.'
      } else {
        errorMessage.value =
          apiError?.message ||
          `Game code ${gameCode.value.trim().toUpperCase()} not found in active registries. Check for typos or session expiration.`
      }
    } else {
      errorMessage.value = 'Failed to join game.'
    }
  } finally {
    loading.value = false
  }
}
</script>