<template>
  <div class="min-h-screen bg-background font-body text-on-surface flex flex-col">
    <Navbar />

    <main class="flex-1 w-full pt-24 pb-20 px-6 max-w-7xl mx-auto">
      <header class="mb-12 relative">
        <div class="max-w-3xl">
          <p class="font-headline uppercase tracking-[0.2em] text-primary font-bold text-xs mb-3">
            System.Initialized()
          </p>

          <h1
            class="font-headline text-5xl md:text-6xl font-bold text-on-surface tracking-tighter leading-tight mb-4"
          >
            Welcome back,
            <span class="text-primary">
              {{ authStore.user?.name || 'Player' }}!
            </span>
          </h1>

          <p class="text-on-surface-variant text-lg leading-relaxed font-light">
            The compiler is ready and the board is set.
          </p>
        </div>
      </header>

      <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <button
          type="button"
          @click="goToCreateGame"
          class="group relative flex flex-col text-left h-80 rounded-xl overflow-hidden bg-surface-container-lowest shadow-xl hover:shadow-[0_20px_50px_rgba(30,99,151,0.15)] transition-all duration-300 transform hover:-translate-y-2"
        >
          <div class="h-2 w-full syntax-gradient"></div>
          <div class="p-8 flex flex-col h-full">
            <div class="mb-auto">
              <span class="material-symbols-outlined text-4xl text-primary mb-4">add_circle</span>
              <h3 class="font-headline text-2xl font-bold text-on-surface mb-2">Create Game</h3>
              <p class="text-on-surface-variant text-sm font-body">
                Initialize a new logic board and invite fellow developers.
              </p>
            </div>
          </div>
        </button>

        <button
          type="button"
          @click="goToJoinGame"
          class="group relative flex flex-col text-left h-80 rounded-xl overflow-hidden bg-surface-container-lowest shadow-xl hover:shadow-[0_20px_50px_rgba(132,67,159,0.15)] transition-all duration-300 transform hover:-translate-y-2"
        >
          <div class="h-2 w-full secondary-syntax-gradient"></div>
          <div class="p-8 flex flex-col h-full">
            <div class="mb-auto">
              <span class="material-symbols-outlined text-4xl text-secondary mb-4">hub</span>
              <h3 class="font-headline text-2xl font-bold text-on-surface mb-2">Join Game</h3>
              <p class="text-on-surface-variant text-sm font-body">
                Connect to an active session using a Room ID or Public Lobby.
              </p>
            </div>
          </div>
        </button>

        <button
          type="button"
          @click="goToHowToPlay"
          class="group relative flex flex-col text-left h-80 rounded-xl overflow-hidden bg-surface-container-lowest shadow-xl hover:shadow-[0_20px_50px_rgba(0,110,55,0.15)] transition-all duration-300 transform hover:-translate-y-2"
        >
          <div class="h-2 w-full tertiary-syntax-gradient"></div>
          <div class="p-8 flex flex-col h-full">
            <div class="mb-auto">
              <span class="material-symbols-outlined text-4xl text-tertiary mb-4">emoji_events</span>
              <h3 class="font-headline text-2xl font-bold text-on-surface mb-2">How to play?</h3>
              <p class="text-on-surface-variant text-sm font-body">
                Learn the rules and strategies to succeed in the game.
              </p>
            </div>
          </div>
        </button>

        <button
          type="button"
          @click="handleLogout"
          class="group relative flex flex-col text-left h-80 rounded-xl overflow-hidden bg-surface-container-lowest shadow-xl hover:shadow-[0_20px_50px_rgba(172,52,52,0.15)] transition-all duration-300 transform hover:-translate-y-2"
        >
          <div class="h-2 w-full bg-error"></div>
          <div class="p-8 flex flex-col h-full">
            <div class="mb-auto">
              <span class="material-symbols-outlined text-4xl text-error mb-4">logout</span>
              <h3 class="font-headline text-2xl font-bold text-on-surface mb-2">Logout</h3>
              <p class="text-on-surface-variant text-sm font-body">
                Terminate current session and save environment state.
              </p>
            </div>
          </div>
        </button>
      </section>

      <section class="mb-12">
        <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <p class="font-headline uppercase tracking-[0.2em] text-primary font-bold text-xs mb-3">
              Recent Sessions
            </p>
            <h2 class="font-headline text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
              Your latest 3 games
            </h2>
            <p class="text-on-surface-variant text-base leading-relaxed mt-2">
              Jump back into unfinished matches or open the latest results.
            </p>
          </div>

          <button
            type="button"
            @click="goToMyGames"
            class="self-start md:self-auto px-5 py-3 rounded-full border border-slate-200 bg-white text-slate-700 font-bold hover:border-primary hover:text-primary transition-colors"
          >
            View All Games
          </button>
        </div>

        <div
          v-if="loadingRecentGames"
          class="rounded-[2rem] bg-surface-container-lowest border border-white/70 p-8 text-center text-on-surface-variant shadow-[0_12px_40px_rgba(42,51,60,0.04)]"
        >
          Loading your recent games...
        </div>

        <div
          v-else-if="recentGames.length === 0"
          class="rounded-[2rem] bg-surface-container-lowest border border-white/70 p-10 text-center shadow-[0_12px_40px_rgba(42,51,60,0.04)]"
        >
          <span class="material-symbols-outlined text-5xl text-slate-400">sports_esports</span>
          <h3 class="font-headline text-2xl font-bold text-on-surface mt-4">No recent games yet</h3>
          <p class="text-on-surface-variant mt-2">
            Create or join a game and your latest sessions will show up here.
          </p>
        </div>

        <div
          v-else
          class="overflow-hidden rounded-[2rem] bg-surface-container-lowest border border-white/70 shadow-[0_12px_40px_rgba(42,51,60,0.04)]"
        >
          <article
            v-for="game in recentGames"
            :key="game.id"
            class="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between md:gap-4"
            :class="recentGames[recentGames.length - 1]?.id !== game.id ? 'border-b border-slate-100' : ''"
          >
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2 mb-2">
                <h3 class="font-headline text-xl font-bold text-primary">
                  {{ game.game_code }}
                </h3>
                <span
                  class="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase"
                  :class="getStatusClass(game.status)"
                >
                  {{ getStatusLabel(game.status) }}
                </span>
              </div>

              <div class="grid grid-cols-1 gap-1.5 text-[13px] text-on-surface-variant md:grid-cols-2 xl:grid-cols-5">
                <p>
                  <span class="text-slate-500">Role:</span>
                  <span class="ml-2 font-bold text-on-surface">{{ game.is_host ? 'Host' : 'Player' }}</span>
                </p>
                <p>
                  <span class="text-slate-500">Host:</span>
                  <span class="ml-2 font-bold text-on-surface">{{ game.host_name || '—' }}</span>
                </p>
                <p>
                  <span class="text-slate-500">Current:</span>
                  <span class="ml-2 font-bold text-on-surface">{{ game.credits }} Cr</span>
                </p>
                <p>
                  <span class="text-slate-500">Total:</span>
                  <span class="ml-2 font-bold text-tertiary">{{ game.total_credits }} Cr</span>
                </p>
                <p>
                  <span class="text-slate-500">Created:</span>
                  <span class="ml-2 font-bold text-on-surface">{{ formatDate(game.created_at) }}</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              @click="goToGameAction(game)"
              class="w-full shrink-0 px-4 py-2.5 rounded-full text-xs font-bold text-white transition-colors md:w-auto md:min-w-[140px]"
              :class="getGameActionClass(game.status)"
            >
              {{ getGameActionLabel(game.status) }}
            </button>
          </article>
        </div>
      </section>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Navbar from '@/components/NavBar.vue'
import Footer from '@/components/AppFooter.vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
import { useToast } from 'vue-toastification'

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
const authStore = useAuthStore()
const toast = useToast()
const loadingRecentGames = ref(false)
const recentGames = ref<MyGame[]>([])

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

const getGameActionLabel = (status: string) => {
  if (status === 'waiting') return 'Go to Lobby'
  if (status === 'started') return 'Continue Game'
  if (status === 'ended') return 'View Results'
  return 'Open My Games'
}

const getGameActionClass = (status: string) => {
  if (status === 'waiting') return 'bg-yellow-500 hover:bg-yellow-600'
  if (status === 'started') return 'bg-primary hover:bg-primary-dim'
  if (status === 'ended') return 'bg-secondary hover:bg-secondary-dim'
  return 'bg-slate-600 hover:bg-slate-700'
}

const formatDate = (value: string | null) => {
  if (!value) return '—'

  return new Date(value).toLocaleDateString('en-MY', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const goToGameAction = (game: MyGame) => {
  if (game.status === 'waiting') {
    router.push(`/game-lobby/${game.id}`)
    return
  }

  if (game.status === 'started') {
    router.push(`/game-board/${game.id}`)
    return
  }

  if (game.status === 'ended') {
    router.push(`/games/${game.id}/final-leaderboard`)
    return
  }

  router.push('/my-games')
}

const goToCreateGame = () => {
  router.push('/create-game')
}

const goToJoinGame = () => {
  router.push('/join-game')
}

const goToHowToPlay = () => {
  router.push('/game-guidelines')
}

const goToMyGames = () => {
  router.push('/my-games')
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}

const fetchRecentGames = async () => {
  try {
    loadingRecentGames.value = true

    const response = await api.get<MyGamesResponse>('/api/my-games')
    recentGames.value = (response.data.games || []).slice(0, 3)
  } catch (error: unknown) {
    toast.error(getErrorMessage(error, 'Failed to load your recent games.'))
  } finally {
    loadingRecentGames.value = false
  }
}

onMounted(() => {
  fetchRecentGames()
})
</script>
