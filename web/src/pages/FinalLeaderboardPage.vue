<template>
  <div class="bg-surface min-h-screen text-on-surface">
    <Navbar />

    <main class="max-w-7xl mx-auto px-6 py-12 pb-40 relative z-10">
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div class="text-center md:text-left flex-grow">
          <div
            class="inline-flex items-center gap-2 mb-4 bg-tertiary-container/40 text-on-tertiary-container px-4 py-1.5 rounded-full text-sm font-bold font-['Space_Grotesk']"
          >
            <span class="material-symbols-outlined text-lg" style="font-variation-settings: 'FILL' 1;">
              celebration
            </span>
            Session Complete
          </div>

          <h1 class="text-5xl md:text-7xl font-bold font-['Space_Grotesk'] text-primary tracking-tight mb-4">
            Final Leaderboard
          </h1>

          <p class="text-on-surface-variant text-lg font-medium">
            Final ranking and results for this Pythonopoly session.
          </p>
        </div>

        <div class="bg-surface-container-low px-8 py-6 rounded-2xl flex flex-col gap-2 items-center md:items-end shadow-sm">
          <span class="text-[11px] font-['Space_Grotesk'] uppercase tracking-[0.2em] text-on-surface-variant font-bold">
            Session Identity
          </span>
          <span class="font-mono text-primary font-bold text-xl">{{ gameCode }}</span>
          <div class="flex items-center gap-2 mt-2 bg-surface-container-highest px-3 py-1 rounded-lg">
            <span class="material-symbols-outlined text-sm text-primary">flag</span>
            <span class="text-sm font-bold">{{ gameStatus }}</span>
          </div>
        </div>
      </div>

      <div class="bg-surface-container-lowest rounded-[2.5rem] p-6 md:p-12 shadow-[0_32px_64px_rgba(42,51,60,0.08)] border border-surface-container">
        <div class="flex flex-col md:flex-row items-center justify-between mb-12 gap-4 px-2">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-on-primary">
              <span class="material-symbols-outlined text-2xl">leaderboard</span>
            </div>
            <h3 class="text-3xl font-bold font-['Space_Grotesk'] tracking-tight">Session Rankings</h3>
          </div>

          <div class="flex gap-4">
            <span class="bg-surface-container-high text-on-surface-variant font-bold px-6 py-2 rounded-full text-sm font-['Space_Grotesk']">
              {{ leaderboard.length }} Players
            </span>
            <span class="bg-primary-container/30 text-on-primary-container font-bold px-6 py-2 rounded-full text-sm font-['Space_Grotesk']">
              Game Ended
            </span>
          </div>
        </div>

        <div v-if="loading" class="py-16 text-center text-on-surface-variant">
          Loading final results...
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full border-separate border-spacing-y-4">
            <thead>
              <tr class="text-left text-[11px] uppercase font-['Space_Grotesk'] tracking-[0.25em] text-on-surface-variant/60">
                <th class="pb-6 px-8 font-bold">Position</th>
                <th class="pb-6 px-8 font-bold">Player</th>
                <th class="pb-6 px-8 font-bold text-right">Current Credits</th>
                <th class="pb-6 px-8 font-bold text-right">Total Credits</th>
                <th class="pb-6 px-8 font-bold text-right">Board Position</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(player, index) in leaderboard"
                :key="player.user_id"
                class="group transition-all duration-300 bg-white hover:shadow-xl hover:-translate-y-0.5 rounded-2xl"
                :class="index === 0 ? 'bg-gradient-to-r from-yellow-50/60 to-white' : ''"
              >
                <td class="py-6 px-8 align-middle">
                  <div
                    class="flex items-center justify-center w-10 h-10 rounded-full font-bold font-['Space_Grotesk'] text-xl"
                    :class="
                      index === 0
                        ? 'bg-yellow-400 text-yellow-950'
                        : index === 1
                          ? 'bg-slate-300 text-slate-800'
                          : index === 2
                            ? 'bg-orange-200 text-orange-900'
                            : 'bg-surface-container-highest text-on-surface-variant'
                    "
                  >
                    {{ index + 1 }}
                  </div>
                </td>

                <td class="py-6 px-8">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center font-bold">
                      {{ getInitials(player.name) }}
                    </div>
                    <div>
                      <span class="block font-bold text-lg">{{ player.name }}</span>
                      <span v-if="index === 0" class="text-xs font-medium text-yellow-700">
                        Winner
                      </span>
                    </div>
                  </div>
                </td>

                <td class="py-6 px-8 text-right font-mono font-bold text-on-surface">
                  {{ player.credits }}
                </td>

                <td class="py-6 px-8 text-right font-mono font-black text-primary">
                  {{ player.total_credits }}
                </td>

                <td class="py-6 px-8 text-right font-medium text-on-surface-variant">
                  {{ player.position ?? '—' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <footer class="fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-xl py-6 px-6 z-40 border-t border-outline-variant/10 shadow-[0_-8px_30px_rgba(0,0,0,0.05)]">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 bg-gradient-to-br from-secondary-container to-secondary-fixed-dim rounded-2xl flex items-center justify-center">
            <span class="material-symbols-outlined text-primary text-3xl" style="font-variation-settings: 'FILL' 1;">
              workspace_premium
            </span>
          </div>
          <div>
            <h4 class="text-lg font-bold font-['Space_Grotesk'] leading-tight">
              Winner: {{ leaderboard[0]?.name || '—' }}
            </h4>
            <p class="text-sm text-on-surface-variant">
              Top total credits: {{ leaderboard[0]?.total_credits ?? '—' }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-4 w-full md:w-auto">
          <button
            type="button"
            @click="router.push('/dashboard')"
            class="flex-1 md:flex-none px-10 py-4 bg-white border-2 border-surface-container-highest text-on-surface-variant font-bold font-['Space_Grotesk'] rounded-2xl hover:bg-surface-container-high transition-all active:scale-95 duration-200"
          >
            Return to Dashboard
          </button>

          <button
            type="button"
            @click="router.push('/mainpage')"
            class="flex-1 md:flex-none px-14 py-4 bg-gradient-to-br from-primary to-primary-dim text-on-primary font-bold font-['Space_Grotesk'] rounded-2xl shadow-xl shadow-primary/30 hover:brightness-110 hover:scale-[1.02] transition-all active:scale-95 duration-200 flex items-center justify-center gap-3"
          >
            <span class="material-symbols-outlined text-2xl">refresh</span>
            Start New Game
          </button>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from '@/components/NavBar.vue'
import api from '@/services/api'

type LeaderboardPlayer = {
  rank: number
  user_id: number
  name: string
  email: string | null
  credits: number
  total_credits: number
  position?: number
}

type LeaderboardResponse = {
  game_id: number
  game_code: string
  status: string
  leaderboard: LeaderboardPlayer[]
}

const route = useRoute()
const router = useRouter()
const gameId = Number(route.params.id)

const loading = ref(false)
const gameCode = ref('')
const gameStatus = ref('')
const leaderboard = ref<LeaderboardPlayer[]>([])

const fetchFinalLeaderboard = async () => {
  loading.value = true
  try {
    const response = await api.get<LeaderboardResponse>(`/api/games/${gameId}/leaderboard`)
    gameCode.value = response.data.game_code || ''
    gameStatus.value = response.data.status || ''
    leaderboard.value = response.data.leaderboard || []
  } finally {
    loading.value = false
  }
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('')
}

onMounted(async () => {
  await fetchFinalLeaderboard()
})
</script>