<template>
  <div class="bg-background font-body text-on-surface min-h-screen">
    <Navbar />

    <main class="pt-24 pb-20 px-6 max-w-7xl mx-auto">
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
          class="group relative flex flex-col text-left h-80 rounded-xl overflow-hidden bg-surface-container-lowest shadow-[0_12px_40px_rgba(42,51,60,0.04)] hover:shadow-[0_20px_50px_rgba(30,99,151,0.15)] transition-all duration-300 transform hover:-translate-y-2"
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
          class="group relative flex flex-col text-left h-80 rounded-xl overflow-hidden bg-surface-container-lowest shadow-[0_12px_40px_rgba(42,51,60,0.04)] hover:shadow-[0_20px_50px_rgba(132,67,159,0.15)] transition-all duration-300 transform hover:-translate-y-2"
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
          class="group relative flex flex-col text-left h-80 rounded-xl overflow-hidden bg-surface-container-lowest shadow-[0_12px_40px_rgba(42,51,60,0.04)] hover:shadow-[0_20px_50px_rgba(0,110,55,0.15)] transition-all duration-300 transform hover:-translate-y-2"
        >
          <div class="h-2 w-full tertiary-syntax-gradient"></div>
          <div class="p-8 flex flex-col h-full">
            <div class="mb-auto">
              <span class="material-symbols-outlined text-4xl text-tertiary mb-4">emoji_events</span>
              <h3 class="font-headline text-2xl font-bold text-on-surface mb-2">Leaderboard</h3>
              <p class="text-on-surface-variant text-sm font-body">
                Compare your algorithmic wealth against global competitors.
              </p>
            </div>
          </div>
        </button>

        <button
          type="button"
          @click="handleLogout"
          class="group relative flex flex-col text-left h-80 rounded-xl overflow-hidden bg-surface-container-lowest shadow-[0_12px_40px_rgba(42,51,60,0.04)] hover:shadow-[0_20px_50px_rgba(172,52,52,0.15)] transition-all duration-300 transform hover:-translate-y-2"
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
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Navbar from '@/components/NavBar.vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const goToCreateGame = () => {
  router.push('/create-game')
}

const goToJoinGame = () => {
  router.push('/join-game')
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}
</script>