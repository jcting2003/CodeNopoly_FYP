<template>
  <div class="min-h-screen bg-surface">
    <Navbar />

    <main class="pt-28 px-6 pb-16">
      <div class="max-w-6xl mx-auto">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p class="text-sm font-bold text-primary uppercase tracking-widest">
              Game History
            </p>
            <h1 class="text-4xl md:text-5xl font-headline font-bold text-on-surface mt-2">
              My Past Games
            </h1>
            <p class="text-on-surface-variant mt-3">
              View games you hosted or joined.
            </p>
          </div>

          <button
            type="button"
            @click="router.push('/create-game')"
            class="px-6 py-3 rounded-full bg-primary text-white font-bold hover:bg-primary-dim transition-colors"
          >
            Create New Game
          </button>
        </div>

        <div
          v-if="loading"
          class="bg-white rounded-3xl p-8 text-center text-slate-500"
        >
          Loading your games...
        </div>

        <div
          v-else-if="games.length === 0"
          class="bg-white rounded-3xl p-10 text-center"
        >
          <span class="material-symbols-outlined text-5xl text-slate-400">
            sports_esports
          </span>
          <h2 class="text-2xl font-headline font-bold mt-4">
            No games found
          </h2>
          <p class="text-slate-500 mt-2">
            Create or join a game to see your history here.
          </p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div
            v-for="game in games"
            :key="game.id"
            class="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all"
          >
            <div class="flex items-start justify-between gap-4 mb-5">
              <div>
                <p class="text-xs text-slate-500 uppercase tracking-widest font-bold">
                  Game Code
                </p>
                <h2 class="text-3xl font-headline font-bold text-primary mt-1">
                  {{ game.game_code }}
                </h2>
              </div>

              <span
                class="px-3 py-1 rounded-full text-xs font-bold uppercase"
                :class="getStatusClass(game.status)"
              >
                {{ getStatusLabel(game.status) }}
              </span>
            </div>

            <div class="space-y-3 mb-6">
              <div class="flex justify-between text-sm">
                <span class="text-slate-500">Role</span>
                <span class="font-bold">
                  {{ game.is_host ? 'Host' : 'Player' }}
                </span>
              </div>

              <div class="flex justify-between text-sm">
                <span class="text-slate-500">Host</span>
                <span class="font-bold">
                  {{ game.host_name || '—' }}
                </span>
              </div>

              <div class="flex justify-between text-sm">
                <span class="text-slate-500">Current Credits</span>
                <span class="font-bold">
                  {{ game.credits }} Cr
                </span>
              </div>

              <div class="flex justify-between text-sm">
                <span class="text-slate-500">Total Credits</span>
                <span class="font-bold text-tertiary">
                  {{ game.total_credits }} Cr
                </span>
              </div>

              <div class="flex justify-between text-sm">
                <span class="text-slate-500">Created</span>
                <span class="font-bold">
                  {{ formatDate(game.created_at) }}
                </span>
              </div>
            </div>
            <div class="flex gap-3">
              <button
                v-if="game.status === 'waiting'"
                type="button"
                @click="router.push(`/game-lobby/${game.id}`)"
                class="flex-1 px-4 py-3 rounded-full bg-yellow-500 text-white font-bold text-sm"
              >
                Go to Lobby
              </button>

              <button
                v-else-if="game.status === 'started'"
                type="button"
                @click="router.push(`/game-board/${game.id}`)"
                class="flex-1 px-4 py-3 rounded-full bg-primary text-white font-bold text-sm"
              >
                Continue Game
              </button>

              <button
                v-else-if="game.status === 'ended'"
                type="button"
                @click="router.push(`/games/${game.id}/final-leaderboard`)"
                class="flex-1 px-4 py-3 rounded-full bg-secondary text-white font-bold text-sm"
              >
                View Results
            </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import axios from 'axios'
import Navbar from '@/components/NavBar.vue'
import api from '@/services/api'

type MyGame = {
  id: number
  game_code: string
  status: string
  host_id: number
  host_name: string | null
  is_host: boolean
  credits: number
  total_credits: number
  position: number | null
  started_at: string | null
  ended_at: string | null
  created_at: string
}

type MyGamesResponse = {
  games: MyGame[]
}

type ErrorResponse = {
  message?: string
}

const router = useRouter()
const toast = useToast()

const loading = ref(false)
const games = ref<MyGame[]>([])

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    return error.response?.data?.message || fallback
  }

  return fallback
}

const getStatusLabel = (status: string) => {
  if (status === 'waiting') return 'Waiting'
  if (status === 'started') return 'In Progress'
  if (status === 'ended') return 'Ended'
  return 'Unknown'
}

const getStatusClass = (status: string) => {
  if (status === 'waiting') return 'bg-yellow-100 text-yellow-700'
  if (status === 'started') return 'bg-green-100 text-green-700'
  if (status === 'ended') return 'bg-red-100 text-red-700'
  return 'bg-slate-100 text-slate-600'
}

const formatDate = (value: string | null) => {
  if (!value) return '—'

  return new Date(value).toLocaleDateString('en-MY', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const fetchMyGames = async () => {
  try {
    loading.value = true

    const response = await api.get<MyGamesResponse>('/api/my-games')
    games.value = response.data.games || []
  } catch (error: unknown) {
    toast.error(getErrorMessage(error, 'Failed to load your games.'))
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchMyGames()
})
</script>