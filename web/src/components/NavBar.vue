<template>
  <nav
    class="fixed top-0 left-0 w-full z-50 px-6 py-4 bg-sky-300/30 shadow-sm backdrop-blur-xl font-['Space_Grotesk'] tracking-tight"
  >
    <div class="flex justify-between items-center gap-4">
      <!-- Left side -->
      <div class="flex items-center gap-8">
        <RouterLink
          :to="logoRoute"
          class="text-2xl font-bold tracking-tighter text-blue-700"
        >
          CodeNopoly
        </RouterLink>

        <!-- Show nav links only when logged in -->
        <div v-if="authStore.isLoggedIn" class="hidden md:flex gap-6 items-center">
          <!-- Admin links -->
          <template v-if="isAdmin">
            <RouterLink
              to="/admin/dashboard"
              class="text-slate-500 font-medium hover:text-blue-500 transition-colors"
              active-class="text-blue-700 border-b-2 border-blue-600 font-bold"
            >
              Admin Dashboard
            </RouterLink>

            <RouterLink
              to="/admin/questions"
              class="text-slate-500 font-medium hover:text-blue-500 transition-colors"
              active-class="text-blue-700 border-b-2 border-blue-600 font-bold"
            >
              Question Bank
            </RouterLink>
          </template>

          <!-- Normal player links -->
          <template v-else>
            <RouterLink
              to="/dashboard"
              class="text-slate-500 font-medium hover:text-blue-500 transition-colors"
              active-class="text-blue-700 border-b-2 border-blue-600 font-bold"
            >
              Dashboard
            </RouterLink>

            <RouterLink
              to="/my-games"
              class="text-slate-500 font-medium hover:text-blue-500 transition-colors"
              active-class="text-blue-700 border-b-2 border-blue-600 font-bold"
            >
              My Games
            </RouterLink>

            <RouterLink
              to="/game-guidelines"
              class="text-slate-500 font-medium hover:text-blue-500 transition-colors"
              active-class="text-blue-700 border-b-2 border-blue-600 font-bold"
            >
              Guidelines
            </RouterLink>
          </template>
        </div>

        <div v-else class="hidden md:flex gap-6 items-center">
          <RouterLink
            to="/game-guidelines"
            class="text-slate-500 font-medium hover:text-blue-500 transition-colors"
            active-class="text-blue-700 border-b-2 border-blue-600 font-bold"
          >
            Guidelines
          </RouterLink>
        </div>
      </div>

      <!-- Right side -->
      <div class="flex items-center gap-4">
        <template v-if="authStore.isLoggedIn">
          <div class="hidden md:flex items-center gap-3">
            <RouterLink
              to="/profile"
              class="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden block"
            >
              <img
                v-if="authStore.user?.profile_photo_url"
                :src="authStore.user.profile_photo_url"
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

        <RouterLink
          v-else
          to="/login"
          class="hidden md:inline-flex px-4 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
        >
          Login
        </RouterLink>

        <button
          type="button"
          class="inline-flex md:hidden items-center justify-center rounded-full border border-slate-200 bg-white/90 p-2 text-slate-600 shadow-sm transition-colors hover:text-blue-600"
          :aria-expanded="isMobileMenuOpen"
          aria-label="Toggle navigation menu"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <span class="material-symbols-outlined">
            {{ isMobileMenuOpen ? 'close' : 'menu' }}
          </span>
        </button>
      </div>
    </div>

    <div
      v-if="isMobileMenuOpen"
      class="fixed inset-0 z-[60] bg-slate-900/15 md:hidden"
      @click="closeMobileMenu"
    >
      <Transition
        enter-active-class="transform transition duration-300 ease-out"
        enter-from-class="translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transform transition duration-200 ease-in"
        leave-from-class="translate-x-0"
        leave-to-class="translate-x-full"
        appear
      >
        <div
          v-if="isMobileMenuOpen"
          class="ml-auto flex h-screen w-full max-w-sm flex-col bg-slate-50 px-4 py-5 shadow-2xl"
          @click.stop
        >
          <div class="mb-4 flex items-center justify-between gap-4">
            <RouterLink
              :to="logoRoute"
              class="text-2xl font-bold tracking-tighter text-blue-700"
              @click="closeMobileMenu"
            >
              CodeNopoly
            </RouterLink>

            <button
              type="button"
              class="inline-flex items-center justify-center rounded-full border-2 border-slate-900 bg-white p-2 text-slate-600 transition-colors hover:text-blue-600"
              aria-label="Close navigation menu"
              @click="closeMobileMenu"
            >
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div class="flex flex-col gap-2 border-t border-slate-200 pt-4">
            <template v-if="authStore.isLoggedIn">
              <template v-if="isAdmin">
                <RouterLink
                  to="/admin/dashboard"
                  class="rounded-2xl px-4 py-3 text-slate-600 font-medium transition-colors hover:bg-slate-100 hover:text-blue-600"
                  active-class="bg-blue-50 text-blue-700 font-bold"
                  @click="closeMobileMenu"
                >
                  Admin Dashboard
                </RouterLink>
                <RouterLink
                  to="/admin/questions"
                  class="rounded-2xl px-4 py-3 text-slate-600 font-medium transition-colors hover:bg-slate-100 hover:text-blue-600"
                  active-class="bg-blue-50 text-blue-700 font-bold"
                  @click="closeMobileMenu"
                >
                  Question Bank
                </RouterLink>
              </template>

              <template v-else>
                <RouterLink
                  to="/dashboard"
                  class="rounded-2xl px-4 py-3 text-slate-600 font-medium transition-colors hover:bg-slate-100 hover:text-blue-600"
                  active-class="bg-blue-50 text-blue-700 font-bold"
                  @click="closeMobileMenu"
                >
                  Dashboard
                </RouterLink>
                <RouterLink
                  to="/my-games"
                  class="rounded-2xl px-4 py-3 text-slate-600 font-medium transition-colors hover:bg-slate-100 hover:text-blue-600"
                  active-class="bg-blue-50 text-blue-700 font-bold"
                  @click="closeMobileMenu"
                >
                  My Games
                </RouterLink>
                <RouterLink
                  to="/game-guidelines"
                  class="rounded-2xl px-4 py-3 text-slate-600 font-medium transition-colors hover:bg-slate-100 hover:text-blue-600"
                  active-class="bg-blue-50 text-blue-700 font-bold"
                  @click="closeMobileMenu"
                >
                  Guidelines
                </RouterLink>
              </template>

              <RouterLink
                to="/profile"
                class="rounded-2xl px-4 py-3 text-slate-600 font-medium transition-colors hover:bg-slate-100 hover:text-blue-600"
                active-class="bg-blue-50 text-blue-700 font-bold"
                @click="closeMobileMenu"
              >
                Profile
              </RouterLink>

              <button
                type="button"
                class="mt-3 rounded-2xl bg-red-500 px-4 py-3 text-left text-sm font-medium text-white transition-colors hover:bg-red-600"
                @click="handleLogout"
              >
                Logout
              </button>
            </template>

            <template v-else>
              <RouterLink
                to="/game-guidelines"
                class="rounded-2xl px-4 py-3 text-slate-600 font-medium transition-colors hover:bg-slate-100 hover:text-blue-600"
                active-class="bg-blue-50 text-blue-700 font-bold"
                @click="closeMobileMenu"
              >
                Guidelines
              </RouterLink>
              <RouterLink
                to="/login"
                class="mt-3 rounded-2xl bg-blue-600 px-4 py-3 text-center font-medium text-white transition-colors hover:bg-blue-700"
                @click="closeMobileMenu"
              >
                Login
              </RouterLink>
            </template>
          </div>
        </div>
      </Transition>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const isMobileMenuOpen = ref(false)

const isAdmin = computed(() => authStore.user?.role === 'admin')

const logoRoute = computed(() => {
  if (!authStore.isLoggedIn) {
    return '/'
  }

  return isAdmin.value ? '/admin/dashboard' : '/dashboard'
})

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const handleLogout = async () => {
  closeMobileMenu()
  await authStore.logout()
  router.push('/')
}
</script>
