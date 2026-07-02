<template>
  <div class="min-h-screen bg-background text-on-surface">
    <NavBar />

    <main class="pt-28 px-8 max-w-6xl mx-auto">
      <div class="mb-10">
        <p class="text-sm uppercase tracking-widest text-primary font-bold">
          Admin Panel
        </p>
        <h1 class="text-5xl font-headline font-bold mt-2">
          Dashboard
        </h1>
        <p class="text-on-surface-variant mt-3">
          Manage CodeNopoly system data, questions, users, and game activity.
        </p>
      </div>

      <div v-if="loading" class="text-on-surface-variant">
        Loading dashboard...
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="rounded-3xl bg-surface-container-low p-6 shadow">
          <p class="text-sm text-on-surface-variant">Total Users</p>
          <p class="text-4xl font-bold text-primary mt-2">
            {{ stats.total_users }}
          </p>
        </div>

        <div class="rounded-3xl bg-surface-container-low p-6 shadow">
          <p class="text-sm text-on-surface-variant">Total Questions</p>
          <p class="text-4xl font-bold text-primary mt-2">
            {{ stats.total_questions }}
          </p>
        </div>

        <div class="rounded-3xl bg-surface-container-low p-6 shadow">
          <p class="text-sm text-on-surface-variant">Total Games</p>
          <p class="text-4xl font-bold text-primary mt-2">
            {{ stats.total_games }}
          </p>
        </div>

        <div class="rounded-3xl bg-surface-container-low p-6 shadow">
          <p class="text-sm text-on-surface-variant">Active Games</p>
          <p class="text-4xl font-bold text-primary mt-2">
            {{ stats.active_games }}
          </p>
        </div>
      </div>

      <div class="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <RouterLink
          to="/admin/questions"
          class="rounded-3xl bg-primary text-white p-6 shadow font-bold hover:opacity-90 transition"
        >
          <p class="text-2xl">Manage Question Bank</p>
          <p class="text-sm opacity-80 mt-2">
            Add, edit, delete, and review programming questions.
          </p>
        </RouterLink>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import NavBar from '@/components/NavBar.vue'
import api from '@/services/api'

const loading = ref(true)

const stats = ref({
  total_users: 0,
  total_questions: 0,
  total_games: 0,
  active_games: 0,
})

onMounted(async () => {
  try {
    const response = await api.get('/api/admin/dashboard')
    stats.value = response.data
  } catch (error) {
    console.error('Failed to load admin dashboard:', error)
  } finally {
    loading.value = false
  }
})
</script>