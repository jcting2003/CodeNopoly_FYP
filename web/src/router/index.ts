import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '@/pages/MainPage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import DashboardPage from '@/pages/DashboardPage.vue'
import CreateGamePage from '@/pages/CreateGamePage.vue'
import { useAuthStore } from '@/stores/auth'
import GameLobbyPage from '@/pages/GameLobbyPage.vue'
import JoinGamePage from '@/pages/JoinGamePage.vue'
import GameBoardPage from '@/pages/GameBoardPage.vue'
import FinalLeaderboardPage from '@/pages/FinalLeaderboardPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: MainPage,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardPage,
      meta: { requiresAuth: true },
    },
      {
      path: '/create-game',
      name: 'create-game',
      component: CreateGamePage,
      meta: { requiresAuth: true },
    },
    {
      path: '/game-lobby/:id',
      name: 'game-lobby',
      component: GameLobbyPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/join-game',
      name: 'join-game',
      component: JoinGamePage,
      meta: { requiresAuth: true },
    },
    {
      path: '/game-board/:id',
      name: 'game-board',
      component: GameBoardPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/games/:id/final-leaderboard',
      name: 'FinalLeaderboard',
      component: FinalLeaderboardPage,
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (!authStore.user) {
    await authStore.fetchUser()
  }

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return '/login'
  }

  if (to.path === '/login' && authStore.isLoggedIn) {
    return '/dashboard'
  }

  return true
})

export default router