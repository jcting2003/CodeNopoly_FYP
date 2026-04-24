<template>
  <div class="min-h-screen bg-background text-on-surface flex flex-col">
    <main class="flex-1 flex items-center justify-center px-6 py-10">
      <div class="w-full max-w-xl text-center">
        <p
          class="font-headline uppercase tracking-[0.2em] text-primary font-bold text-xs mb-4"
        >
          Initialize Instance
        </p>

        <h1 class="font-headline text-5xl md:text-6xl font-bold tracking-tight mb-10">
          Pythonopoly
        </h1>

        <div
          class="bg-surface-container-lowest rounded-[2rem] shadow-[0_12px_40px_rgba(42,51,60,0.06)] px-8 py-10 md:px-12 md:py-12"
        >
          <div class="flex flex-col items-center">
            <div
              class="w-24 h-24 rounded-[1.25rem] bg-primary-container flex items-center justify-center mb-8 shadow-inner"
            >
              <div
                class="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-on-primary"
              >
                <span class="material-symbols-outlined text-2xl">add</span>
              </div>
            </div>

            <h2 class="font-headline text-3xl font-bold mb-3">Ready to play?</h2>

            <p class="text-on-surface-variant text-lg leading-relaxed max-w-sm mb-10">
              Generate a unique session code to invite your fellow developers.
            </p>

            <p v-if="errorMessage" class="text-sm text-red-600 font-medium mb-4">
              {{ errorMessage }}
            </p>

            <p v-if="successMessage" class="text-sm text-green-600 font-medium mb-4">
              {{ successMessage }}
            </p>

            <button
              type="button"
              @click="handleCreateGame"
              :disabled="loading"
              class="w-full max-w-md h-16 rounded-full bg-gradient-to-r from-primary to-primary-dim text-on-primary font-label font-bold text-xl shadow-[0_12px_30px_rgba(30,99,151,0.28)] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Creating...' : 'Create Game' }}
            </button>
          </div>
        </div>

        <div
          v-if="createdGame"
          class="mt-8 bg-surface-container-lowest rounded-2xl px-6 py-5 shadow-[0_12px_40px_rgba(42,51,60,0.06)] text-left"
        >
          <h3 class="font-headline text-2xl font-bold mb-3">Game Created</h3>

          <div class="space-y-2 text-sm">
            <p><span class="font-bold">Game ID:</span> {{ createdGame.id }}</p>
            <p><span class="font-bold">Game Code:</span> {{ createdGame.game_code }}</p>
            <p><span class="font-bold">Status:</span> {{ createdGame.status }}</p>
            <p><span class="font-bold">Host ID:</span> {{ createdGame.host_id }}</p>
          </div>

          <div class="mt-5 flex gap-3">
            <button
              type="button"
              @click="goToDashboard"
              class="px-5 py-2.5 rounded-full bg-primary text-on-primary font-label font-bold"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { createGame, type CreatedGame } from '@/services/game'

type ApiErrorResponse = {
  message?: string
}

const router = useRouter()

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const createdGame = ref<CreatedGame | null>(null)

const handleCreateGame = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  createdGame.value = null

  try {
    loading.value = true

    const data = await createGame()

    successMessage.value = data.message || 'Game created successfully.'
    createdGame.value = data.game

    sessionStorage.setItem('created_game', JSON.stringify(data.game))

    router.push({
      name: 'game-lobby',
      params: { id: data.game.id },
      query: { code: data.game.game_code },
    })
  } catch (error: unknown) {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      errorMessage.value =
        error.response?.data?.message || 'Failed to create game.'
    } else {
      errorMessage.value = 'Failed to create game.'
    }
  } finally {
    loading.value = false
  }
}

const goToDashboard = () => {
  router.push('/dashboard')
}
</script>