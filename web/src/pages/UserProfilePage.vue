<template>
  <div class="bg-background text-on-surface min-h-screen flex flex-col">
    <Navbar />

    <main class="flex-1 pt-24 pb-20 px-6 max-w-6xl mx-auto w-full">
      <section class="mb-10">
        <p class="font-headline uppercase tracking-[0.2em] text-primary font-bold text-xs mb-3">
          Account.Profile()
        </p>

        <h1 class="font-headline text-5xl md:text-6xl font-bold tracking-tighter text-on-surface mb-4">
          {{ isAdmin ? 'Admin Profile' : 'My Profile' }}
        </h1>

        <p class="text-on-surface-variant text-lg leading-relaxed">
          {{
            isAdmin
              ? 'View your admin account details and manage CodeNopoly system functions.'
              : 'View your account details, player statistics, and recent CodeNopoly sessions.'
          }}
        </p>
      </section>

      <section class="bg-surface-container-low rounded-[2rem] p-8 md:p-10 relative overflow-hidden mb-8">
        <div class="absolute -right-16 -top-16 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>

        <div class="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
          <div class="relative">
            <div
              class="w-32 h-32 rounded-3xl bg-primary-container flex items-center justify-center shadow-lg overflow-hidden ring-4 ring-white"
            >
              <img
                v-if="profile.profile_photo_url"
                :src="profile.profile_photo_url"
                alt="Profile picture"
                class="w-full h-full object-cover"
              />

              <span
                v-else
                class="text-5xl font-headline font-bold text-on-primary-container"
              >
                {{ initials }}
              </span>
            </div>

            <label
              class="absolute -bottom-3 -right-3 bg-primary text-on-primary p-3 rounded-2xl shadow-lg cursor-pointer hover:bg-primary-dim transition-all active:scale-95"
            >
              <span class="material-symbols-outlined text-xl">photo_camera</span>

              <input
                type="file"
                accept="image/*"
                class="hidden"
                @change="handlePhotoUpload"
              />
            </label>
          </div>

          <div class="flex-1">
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-tertiary-container text-on-tertiary-container rounded-full text-xs font-bold font-label mb-4">
              <span class="w-2 h-2 rounded-full bg-tertiary"></span>
              {{ isAdmin ? 'ADMIN ACCOUNT' : 'ACTIVE ACCOUNT' }}
            </div>

            <h2 class="text-4xl font-headline font-bold tracking-tight text-on-surface">
              {{ profile.name || 'Player' }}
            </h2>

            <p class="mt-2 text-on-surface-variant">
              {{ profile.email || 'No email available' }}
            </p>

            <p class="mt-3 text-sm text-on-surface-variant">
              User ID:
              <span class="font-bold text-primary">#{{ profile.id || '—' }}</span>
            </p>

            <p class="mt-2 text-sm text-on-surface-variant">
              Role:
              <span class="font-bold text-primary capitalize">
                {{ profile.role || authStore.user?.role || 'player' }}
              </span>
            </p>
          </div>
        </div>
      </section>

      <!-- Player stats only -->
      <section
        v-if="!isAdmin"
        class="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8"
      >
        <div class="bg-surface-container-lowest rounded-2xl p-6 shadow-md">
          <span class="block text-xs uppercase tracking-widest font-label text-outline mb-2">
            Games Joined
          </span>
          <span class="text-3xl font-headline font-bold text-primary">
            {{ stats.games_joined }}
          </span>
        </div>

        <div class="bg-surface-container-lowest rounded-2xl p-6 shadow-md">
          <span class="block text-xs uppercase tracking-widest font-label text-outline mb-2">
            Games Won
          </span>
          <span class="text-3xl font-headline font-bold text-tertiary">
            {{ stats.games_won }}
          </span>
        </div>

        <div class="bg-surface-container-lowest rounded-2xl p-6 shadow-md">
          <span class="block text-xs uppercase tracking-widest font-label text-outline mb-2">
            Total Credits
          </span>
          <span class="text-3xl font-headline font-bold text-secondary">
            {{ stats.total_credits_earned }}
          </span>
        </div>

        <div class="bg-surface-container-lowest rounded-2xl p-6 shadow-md">
          <span class="block text-xs uppercase tracking-widest font-label text-outline mb-2">
            Highest Score
          </span>
          <span class="text-3xl font-headline font-bold text-on-surface">
            {{ stats.highest_score }}
          </span>
        </div>
      </section>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section
          :class="[
            isAdmin ? 'lg:col-span-12' : 'lg:col-span-5',
            'bg-surface-container-lowest rounded-[2rem] p-8 shadow-[0_12px_40px_rgba(42,51,60,0.06)]'
          ]"
        >
          <div class="flex items-center gap-3 mb-8">
            <div class="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-on-primary">
              <span class="material-symbols-outlined">person</span>
            </div>

            <div>
              <h3 class="text-2xl font-headline font-bold text-on-surface">
                Account Details
              </h3>
              <p class="text-sm text-on-surface-variant">
                Update your display name.
              </p>
            </div>
          </div>

          <div class="space-y-5">
            <div>
              <label class="text-xs font-label uppercase tracking-wider text-on-surface-variant px-1">
                Display Name
              </label>

              <input
                v-model="form.name"
                type="text"
                class="mt-2 w-full bg-surface-container-low border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/40 font-body text-on-background"
              />
            </div>

            <div>
              <label class="text-xs font-label uppercase tracking-wider text-on-surface-variant px-1">
                Email Address
              </label>

              <input
                :value="profile.email"
                type="email"
                disabled
                class="mt-2 w-full bg-surface-container-low border-none rounded-xl px-4 py-3 opacity-70 font-body text-on-background cursor-not-allowed"
              />
            </div>

            <div>
              <label class="text-xs font-label uppercase tracking-wider text-on-surface-variant px-1">
                Role
              </label>

              <input
                :value="profile.role || authStore.user?.role || 'player'"
                type="text"
                disabled
                class="mt-2 w-full bg-surface-container-low border-none rounded-xl px-4 py-3 opacity-70 font-body text-on-background cursor-not-allowed capitalize"
              />
            </div>
          </div>

          <div class="mt-8 flex justify-end gap-4">
            <button
              type="button"
              @click="resetForm"
              class="px-6 py-2.5 rounded-full font-headline text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              @click="saveProfile"
              :disabled="savingProfile"
              class="px-8 py-2.5 rounded-full font-headline bg-gradient-to-br from-primary to-primary-dim text-on-primary shadow-lg hover:shadow-primary/20 active:scale-95 transition-all disabled:opacity-60"
            >
              {{ savingProfile ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </section>

        <!-- Player recent games only -->
        <section
          v-if="!isAdmin"
          class="lg:col-span-7 bg-surface-container-lowest rounded-[2rem] shadow-[0_12px_40px_rgba(42,51,60,0.06)] overflow-hidden"
        >
          <div class="p-8 pb-4">
            <h3 class="text-2xl font-headline font-bold text-on-background flex items-center gap-2">
              <span class="material-symbols-outlined text-tertiary">history</span>
              Recent Games
            </h3>

            <p class="text-sm text-on-surface-variant mt-2">
              Your latest joined sessions.
            </p>
          </div>

          <div v-if="loadingStats" class="p-8 text-on-surface-variant">
            Loading recent games...
          </div>

          <div v-else-if="recentGames.length === 0" class="p-8 text-on-surface-variant">
            No recent games found.
          </div>

          <div v-else class="divide-y divide-outline-variant/10">
            <div
              v-for="game in recentGames"
              :key="game.game_id"
              class="p-6 hover:bg-surface-container-low/50 transition-colors flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div>
                <p class="font-headline font-bold text-lg text-on-surface">
                  Game {{ game.game_code || `#${game.game_id}` }}
                </p>

                <p class="text-sm text-on-surface-variant mt-1">
                  Status:
                  <span class="font-bold capitalize text-primary">
                    {{ game.status }}
                  </span>
                  · Credits: {{ game.credits }}
                  · Total: {{ game.total_credits }}
                </p>
              </div>

              <button
                type="button"
                @click="openGame(game)"
                class="px-5 py-2.5 rounded-full bg-surface-container-high text-on-surface font-headline font-bold hover:bg-surface-container-highest transition-colors"
              >
                {{ getGameActionLabel(game.status) }}
              </button>
            </div>
          </div>

          <div class="p-4 bg-surface-container-low/30 text-center">
            <button
              type="button"
              @click="goToMyGames"
              class="font-label text-[10px] uppercase tracking-widest text-primary font-bold hover:underline"
            >
              View All Games
            </button>
          </div>
        </section>
      </div>

      <section class="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
        <button
          type="button"
          @click="goToDashboard"
          class="bg-surface-container-lowest rounded-2xl p-6 text-left shadow-[0_12px_40px_rgba(42,51,60,0.04)] hover:shadow-[0_20px_50px_rgba(30,99,151,0.15)] hover:-translate-y-1 transition-all duration-300"
        >
          <span class="material-symbols-outlined text-primary text-4xl mb-4">
            dashboard
          </span>

          <h4 class="font-headline text-xl font-bold text-on-surface mb-2">
            {{ isAdmin ? 'Admin Dashboard' : 'Dashboard' }}
          </h4>

          <p class="text-sm text-on-surface-variant">
            {{
              isAdmin
                ? 'Return to the admin dashboard.'
                : 'Return to your main game dashboard.'
            }}
          </p>
        </button>

        <button
          v-if="!isAdmin"
          type="button"
          @click="goToMyGames"
          class="bg-surface-container-lowest rounded-2xl p-6 text-left shadow-[0_12px_40px_rgba(42,51,60,0.04)] hover:shadow-[0_20px_50px_rgba(132,67,159,0.15)] hover:-translate-y-1 transition-all duration-300"
        >
          <span class="material-symbols-outlined text-secondary text-4xl mb-4">
            stadia_controller
          </span>

          <h4 class="font-headline text-xl font-bold text-on-surface mb-2">
            My Games
          </h4>

          <p class="text-sm text-on-surface-variant">
            View active and past CodeNopoly sessions.
          </p>
        </button>

        <button
          v-if="isAdmin"
          type="button"
          @click="goToQuestionBank"
          class="bg-surface-container-lowest rounded-2xl p-6 text-left shadow-[0_12px_40px_rgba(42,51,60,0.04)] hover:shadow-[0_20px_50px_rgba(30,99,151,0.15)] hover:-translate-y-1 transition-all duration-300"
        >
          <span class="material-symbols-outlined text-primary text-4xl mb-4">
            quiz
          </span>

          <h4 class="font-headline text-xl font-bold text-on-surface mb-2">
            Question Bank
          </h4>

          <p class="text-sm text-on-surface-variant">
            Manage and edit programming questions.
          </p>
        </button>

        <button
          type="button"
          @click="handleLogout"
          class="bg-surface-container-lowest rounded-2xl p-6 text-left shadow-[0_12px_40px_rgba(42,51,60,0.04)] hover:shadow-[0_20px_50px_rgba(172,52,52,0.15)] hover:-translate-y-1 transition-all duration-300"
        >
          <span class="material-symbols-outlined text-error text-4xl mb-4">
            logout
          </span>

          <h4 class="font-headline text-xl font-bold text-on-surface mb-2">
            Logout
          </h4>

          <p class="text-sm text-on-surface-variant">
            End your current session safely.
          </p>
        </button>
      </section>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Footer from '@/components/AppFooter.vue'
import Navbar from '@/components/NavBar.vue'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

type UserRole = 'player' | 'admin'

type Profile = {
  id: number | null
  name: string
  email: string
  role?: UserRole
  profile_photo_url: string | null
}

type ProfileStats = {
  games_joined: number
  games_won: number
  total_credits_earned: number
  highest_score: number
}

type RecentGame = {
  game_id: number
  game_code: string | null
  status: string
  credits: number
  total_credits: number
  position: number | null
  joined_at: string | null
}

type ErrorResponse = {
  message?: string
}

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const profile = reactive<Profile>({
  id: null,
  name: '',
  email: '',
  role: undefined,
  profile_photo_url: null,
})

const isAdmin = computed(() => authStore.user?.role === 'admin' || profile.role === 'admin')

const form = reactive({
  name: '',
})

const stats = reactive<ProfileStats>({
  games_joined: 0,
  games_won: 0,
  total_credits_earned: 0,
  highest_score: 0,
})

const recentGames = ref<RecentGame[]>([])
const loadingProfile = ref(false)
const loadingStats = ref(false)
const savingProfile = ref(false)
const uploadingPhoto = ref(false)

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    return error.response?.data?.message || fallback
  }

  return fallback
}

const initials = computed(() => {
  if (!profile.name) return 'P'

  return profile.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('')
})

const fetchProfile = async () => {
  loadingProfile.value = true

  try {
    const response = await api.get<Profile>('/api/profile')

    profile.id = response.data.id
    profile.name = response.data.name
    profile.email = response.data.email
    profile.role = response.data.role
    profile.profile_photo_url = response.data.profile_photo_url

    form.name = response.data.name

    if (authStore.user) {
      authStore.user.name = response.data.name
      authStore.user.email = response.data.email
      authStore.user.role = response.data.role || authStore.user.role
      authStore.user.profile_photo_url = response.data.profile_photo_url
    }
  } finally {
    loadingProfile.value = false
  }
}

const fetchStats = async () => {
  loadingStats.value = true

  try {
    const response = await api.get<{
      stats: ProfileStats
      recent_games: RecentGame[]
    }>('/api/profile/stats')

    stats.games_joined = response.data.stats.games_joined
    stats.games_won = response.data.stats.games_won
    stats.total_credits_earned = response.data.stats.total_credits_earned
    stats.highest_score = response.data.stats.highest_score
    recentGames.value = response.data.recent_games || []
  } finally {
    loadingStats.value = false
  }
}

const resetForm = () => {
  form.name = profile.name
}

const saveProfile = async () => {
  if (!form.name.trim()) {
    toast.warning('Display name is required.')
    return
  }

  try {
    savingProfile.value = true

    const response = await api.put('/api/profile', {
      name: form.name.trim(),
    })

    profile.name = response.data.user.name
    form.name = response.data.user.name

    if (authStore.user) {
      authStore.user.name = response.data.user.name
    }

    toast.success('Profile updated successfully.')
  } catch (error: unknown) {
    toast.error(getErrorMessage(error, 'Failed to update profile.'))
  } finally {
    savingProfile.value = false
  }
}

const handlePhotoUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  const formData = new FormData()
  formData.append('profile_photo', file)

  try {
    uploadingPhoto.value = true

    const response = await api.post('/api/profile/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    profile.profile_photo_url = response.data.profile_photo_url

    if (authStore.user) {
      authStore.user.profile_photo_url = response.data.profile_photo_url
    }

    toast.success('Profile picture updated successfully.')
  } catch (error: unknown) {
    toast.error(getErrorMessage(error, 'Failed to update profile picture.'))
  } finally {
    uploadingPhoto.value = false
    input.value = ''
  }
}

const getGameActionLabel = (status: string) => {
  if (status === 'waiting') return 'Go to Lobby'
  if (status === 'started') return 'Continue Game'
  if (status === 'ended') return 'View Results'
  return 'Open'
}

const openGame = (game: RecentGame) => {
  if (game.status === 'waiting') {
    router.push(`/game-lobby/${game.game_id}`)
    return
  }

  if (game.status === 'started') {
    router.push(`/game-board/${game.game_id}`)
    return
  }

  if (game.status === 'ended') {
    router.push(`/games/${game.game_id}/final-leaderboard`)
    return
  }

  router.push('/my-games')
}

const goToDashboard = () => {
  router.push(isAdmin.value ? '/admin/dashboard' : '/dashboard')
}

const goToMyGames = () => {
  router.push('/my-games')
}

const goToQuestionBank = () => {
  router.push('/admin/questions')
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}

onMounted(async () => {
  await fetchProfile()

  if (!isAdmin.value) {
    await fetchStats()
  }
})
</script>
