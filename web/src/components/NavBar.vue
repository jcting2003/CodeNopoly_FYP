<template>
  <nav
    class="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-slate-50/80 backdrop-blur-xl shadow-[0_12px_40px_rgba(42,51,60,0.06)] font-['Space_Grotesk'] tracking-tight"
  >
    <!-- Left side -->
    <div class="flex items-center gap-8">
      <RouterLink
        :to="authStore.isLoggedIn ? '/dashboard' : '/'"
        class="text-2xl font-bold tracking-tighter text-blue-700"
      >
        Pythonopoly
      </RouterLink>

      <!-- Show nav links only when logged in -->
      <div v-if="authStore.isLoggedIn" class="hidden md:flex gap-6 items-center">
        <RouterLink
          to="/dashboard"
          class="text-slate-500 font-medium hover:text-blue-500 transition-colors"
          active-class="text-blue-700 border-b-2 border-blue-600 font-bold"
        >
          Dashboard
        </RouterLink>

        <RouterLink
          to="/history"
          class="text-slate-500 font-medium hover:text-blue-500 transition-colors"
          active-class="text-blue-700 border-b-2 border-blue-600 font-bold"
        >
          History
        </RouterLink>
      </div>
    </div>

    <!-- Right side -->
    <div class="flex items-center gap-4">
      <!-- Show these only when logged in -->
      <template v-if="authStore.isLoggedIn">
        <button
          class="p-2 text-slate-500 hover:text-blue-500 transition-transform scale-95 active:scale-90 duration-200"
          type="button"
        >
          <span class="material-symbols-outlined">terminal</span>
        </button>

        <button
          class="p-2 text-slate-500 hover:text-blue-500 transition-transform scale-95 active:scale-90 duration-200"
          type="button"
        >
          <span class="material-symbols-outlined">settings</span>
        </button>

        <div class="flex items-center gap-3">
          <RouterLink
            to="/profile"
            class="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden block"
          >
            <img
              v-if="authStore.user?.profile_picture"
              :src="authStore.user.profile_picture"
              alt="Profile picture"
              class="w-full h-full object-cover"
            />

            <div
              v-else
              class="w-full h-full flex items-center justify-center bg-slate-200 text-slate-500"
            >
              <span class="material-symbols-outlined">person</span>
            </div>
          </RouterLink>

          <button
            type="button"
            @click="handleLogout"
            class="px-3 py-2 rounded-full bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </template>

      <!-- Before login, only show Login if you want it on the right -->
      <RouterLink
        v-else
        to="/login"
        class="px-4 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
      >
        Login
      </RouterLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}
</script>