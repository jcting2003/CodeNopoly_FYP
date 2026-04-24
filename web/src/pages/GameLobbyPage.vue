<template>
  <div class="bg-background text-on-background min-h-screen">
    <Navbar />

    <main class="pt-24 pb-12 px-6 max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
      <div class="flex-1 space-y-8">
        <section class="bg-surface-container-low rounded-[2rem] p-8 relative overflow-hidden">
          <div class="relative z-10">
            <div
              class="inline-flex items-center gap-2 px-3 py-1 bg-tertiary-container text-on-tertiary-container rounded-full text-xs font-bold font-label mb-4"
            >
              <span class="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
              LIVE SESSION
            </div>

            <h1 class="text-5xl font-bold tracking-tighter text-on-surface mb-2 font-headline">
              {{ gameTitle }}
            </h1>

            <p class="text-on-surface-variant text-lg font-medium">
              {{ gameStatusText }}
            </p>

            <div class="mt-12 grid grid-cols-2 gap-4">
              <div
                class="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_12px_40px_rgba(42,51,60,0.06)]"
              >
                <span class="block text-xs uppercase tracking-widest font-label text-outline mb-1">
                  Game Code
                </span>
                <span class="text-3xl font-bold font-headline tracking-tight text-primary">
                  {{ displayGameCode }}
                </span>
              </div>

              <div
                class="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_12px_40px_rgba(42,51,60,0.06)]"
              >
                <span class="block text-xs uppercase tracking-widest font-label text-outline mb-1">
                  Players
                </span>
                <span class="text-3xl font-bold font-headline tracking-tight text-secondary">
                  {{ players.length }} / {{ maxPlayers }}
                </span>
              </div>
            </div>
          </div>

          <div class="absolute -right-12 -top-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div class="absolute right-10 bottom-10 opacity-20">
            <span class="material-symbols-outlined text-[120px] text-primary rotate-12">
              grid_view
            </span>
          </div>
        </section>

        <section
          v-if="isCurrentUserHost"
          class="bg-surface-container-high rounded-[2rem] p-8 flex items-center justify-between"
        >
          <div>
            <h3 class="text-xl font-bold font-headline text-on-surface">Ready to Execute?</h3>
            <p class="text-sm text-on-surface-variant mt-1">
              Minimum 2 players required to initialize.
            </p>
          </div>

          <button
            type="button"
            :disabled="players.length < 2 || startingGame"
            @click="handleStartGame"
            class="bg-gradient-to-br from-primary to-primary-dim text-on-primary px-10 py-4 rounded-full font-bold font-headline tracking-tight shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {{ startingGame ? 'Starting...' : 'Start Game' }}
          </button>
        </section>
      </div>

      <div class="w-full md:w-[400px]">
        <div
          class="bg-surface-container-lowest rounded-[2.5rem] p-6 shadow-[0_12px_40px_rgba(42,51,60,0.04)] h-full"
        >
          <div class="flex items-center justify-between mb-8 px-2">
            <h2 class="text-2xl font-bold font-headline">Joined Players</h2>
            <span class="material-symbols-outlined text-outline">group</span>
          </div>

          <div class="space-y-4">
            <div
              v-for="player in players"
              :key="player.id"
              class="group flex items-center gap-4 p-4 rounded-3xl transition-all duration-300"
              :class="
                player.is_host
                  ? 'bg-primary-container/20 border-2 border-primary/10 hover:bg-primary-container/30'
                  : 'bg-surface-container-low hover:pl-6'
              "
            >
              <div class="relative">
                <div class="w-14 h-14 rounded-2xl bg-white p-1 flex items-center justify-center">
                  <div
                    class="w-full h-full rounded-[0.9rem] bg-surface-container-highest flex items-center justify-center text-slate-500"
                  >
                    <span class="material-symbols-outlined">person</span>
                  </div>
                </div>

                <div
                  v-if="player.is_host"
                  class="absolute -top-2 -left-2 bg-primary text-on-primary text-[10px] font-bold font-label px-2 py-0.5 rounded-full uppercase tracking-tighter"
                >
                  Host
                </div>
              </div>

              <div class="flex-1">
                <h4 class="font-bold text-on-surface font-headline">{{ player.name }}</h4>
                <p
                  class="text-xs font-medium font-label"
                  :class="player.is_host ? 'text-primary' : 'text-on-surface-variant'"
                >
                  STATUS: {{ player.status }}
                </p>
              </div>

              <span
                v-if="player.is_host"
                class="material-symbols-outlined text-primary"
                style="font-variation-settings: 'FILL' 1;"
              >
                verified
              </span>
            </div>

            <div
              v-for="slot in emptySlots"
              :key="`slot-${slot}`"
              class="flex items-center gap-4 p-4 rounded-3xl border-2 border-dashed border-outline-variant/30 opacity-60"
            >
              <div
                class="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center"
              >
                <span class="material-symbols-outlined text-outline">person_add</span>
              </div>

              <div class="flex-1">
                <h4 class="font-medium text-outline font-headline italic">
                  Waiting for connection...
                </h4>
              </div>
            </div>
          </div>

          <div class="mt-12 p-4 bg-surface-container rounded-2xl">
            <p class="text-xs text-on-surface-variant font-medium flex items-center gap-2">
              <span class="material-symbols-outlined text-sm">info</span>
              Players can join using the game code.
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import Navbar from '@/components/NavBar.vue'
import api from '@/services/api'
import echo from '@/lib/echo'
import { useAuthStore } from '@/stores/auth'

type GameData = {
  id: number
  host_id: number
  game_code?: string
  status: string
}

type RawPlayer = {
  user_id?: number
  id?: number
  user?: {
    id: number
    name: string
  }
  name?: string
  username?: string
}

type PlayersResponse =
  | RawPlayer[]
  | {
      players?: RawPlayer[]
    }

type LobbyPlayer = {
  id: number
  name: string
  status: string
  is_host: boolean
}

type StartGameResponse = {
  message?: string
}

type GameShowResponse = {
  game: {
    id: number
    host_id: number
    game_code?: string
    status: string
    started_at?: string | null
    ended_at?: string | null
  }
}

type GameStartedEvent = {
  game_id: number
  status: string
  current_turn_user_id: number | null
  turn_number: number
}

type TurnChangedEvent = {
  game_id: number
  turn_number: number
  current_turn_user_id: number | null
  current_turn_user_name: string | null
}

type LobbyPlayersUpdatedEvent = {
  game_id: number
  players: LobbyPlayer[]
}

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const gameId = Number(route.params.id)

const game = ref<GameData | null>(null)
const players = ref<LobbyPlayer[]>([])
const startingGame = ref(false)

const maxPlayers = 6
let gameChannel: ReturnType<typeof echo.private> | null = null

const currentUserId = computed(() => authStore.user?.id ?? null)

const routeGameCode = computed(() => {
  const code = route.query.code
  return typeof code === 'string' ? code : ''
})

const storedCreatedGame = computed<GameData | null>(() => {
  const raw = sessionStorage.getItem('created_game')
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw)
    if (parsed?.id === gameId) {
      return parsed as GameData
    }
    return null
  } catch {
    return null
  }
})

const isCurrentUserHost = computed(() => {
  const hostId = game.value?.host_id || storedCreatedGame.value?.host_id
  return currentUserId.value !== null && currentUserId.value === hostId
})

const displayGameCode = computed(() => {
  return (
    game.value?.game_code ||
    storedCreatedGame.value?.game_code ||
    routeGameCode.value ||
    '------'
  )
})

const gameTitle = computed(() => {
  if (game.value) return `Game #${game.value.id}`
  if (storedCreatedGame.value) return `Game #${storedCreatedGame.value.id}`
  return `Game #${gameId}`
})

const gameStatusText = computed(() => {
  const status = game.value?.status || storedCreatedGame.value?.status
  if (!status) return 'Waiting for players...'
  return status === 'waiting' ? 'Waiting for players...' : status
})

const emptySlots = computed(() => Math.max(maxPlayers - players.value.length, 0))

const fetchGame = async () => {
  const response = await api.get<GameShowResponse>(`/api/games/${gameId}`)
  const foundGame = response.data.game

  game.value = foundGame
  sessionStorage.setItem('created_game', JSON.stringify(foundGame))

  if (foundGame.status === 'started') {
    router.push(`/game-board/${gameId}`)
    return
  }
}

const fetchPlayers = async () => {
  const response = await api.get<PlayersResponse>(`/api/games/${gameId}/players`)

  const rawPlayers = Array.isArray(response.data)
    ? response.data
    : response.data.players || []

  const hostId = game.value?.host_id || storedCreatedGame.value?.host_id

  players.value = rawPlayers.map((player) => {
    const playerId = player.user?.id || player.user_id || player.id || 0
    const playerName =
      player.user?.name ||
      player.name ||
      player.username ||
      `Player ${playerId}`

    return {
      id: playerId,
      name: playerName,
      status: 'CONNECTED',
      is_host: playerId === hostId,
    }
  })
}

const handleStartGame = async () => {
  if (players.value.length < 2) return

  try {
    startingGame.value = true
    await api.post<StartGameResponse>(`/api/games/${gameId}/start`)
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data?.message || 'Failed to start game.')
    } else {
      console.error('Failed to start game.')
    }
  } finally {
    startingGame.value = false
  }
}

onMounted(async () => {
  try {
    await fetchGame()
    await fetchPlayers()

    gameChannel = echo.private(`game.${gameId}`)

    gameChannel.listen('.lobby.players.updated', (event: LobbyPlayersUpdatedEvent) => {
      players.value = event.players
    })

    gameChannel.listen('.game.started', (event: GameStartedEvent) => {
      if (game.value) {
        game.value.status = event.status
      }

      router.push(`/game-board/${event.game_id}`)
    })

    gameChannel.listen('.turn.changed', () => {
      if (game.value) {
        game.value.status = 'started'
      }
    })

    gameChannel.listen('.leaderboard.updated', () => {
      // Lobby currently does not render leaderboard data.
    })
  } catch (error) {
    console.error('Failed to load lobby:', error)
  }
})

onUnmounted(() => {
  if (gameChannel) {
    echo.leave(`game.${gameId}`)
    gameChannel = null
  }
})
</script>
