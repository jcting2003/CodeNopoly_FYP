<template>
  <div class="bg-background text-on-background min-h-screen flex items-center justify-center p-4 md:p-8">
    <div class="w-full max-w-xl rounded-3xl bg-surface-container-lowest p-8 shadow-2xl shadow-on-surface/5 md:p-10">
      <div class="mb-8 text-center">
        <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-primary text-on-primary shadow-lg shadow-primary/20">
          <span class="material-symbols-outlined text-4xl">key</span>
        </div>

        <h1 class="mt-6 text-4xl font-display font-extrabold tracking-tighter text-on-surface">
          Reset Your Secret
        </h1>

        <p class="mt-3 text-sm font-body leading-6 text-on-surface-variant">
          Choose a new password for your CodeNopoly account.
        </p>
      </div>

      <form class="space-y-5" @submit.prevent="handleSubmit">
        <div class="space-y-2">
          <label class="text-xs font-label font-bold uppercase tracking-wider text-on-surface-variant">
            Email Endpoint
          </label>

          <input
            v-model="form.email"
            class="w-full h-14 px-6 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/40 font-body transition-all text-on-surface placeholder:text-outline"
            placeholder="dev@codenopoly.io"
            type="email"
          />
        </div>

        <div class="space-y-2">
          <label class="text-xs font-label font-bold uppercase tracking-wider text-on-surface-variant">
            New Secret
          </label>

          <input
            v-model="form.password"
            class="w-full h-14 px-6 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/40 font-body transition-all text-on-surface"
            placeholder="••••••••"
            type="password"
          />
        </div>

        <div class="space-y-2">
          <label class="text-xs font-label font-bold uppercase tracking-wider text-on-surface-variant">
            Confirm Secret
          </label>

          <input
            v-model="form.password_confirmation"
            class="w-full h-14 px-6 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/40 font-body transition-all text-on-surface"
            placeholder="••••••••"
            type="password"
          />
        </div>

        <p v-if="successMessage" class="text-sm text-green-600 font-medium">
          {{ successMessage }}
        </p>

        <p v-if="errorMessage" class="text-sm text-red-600 font-medium">
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          :disabled="authStore.loading || !token"
          class="w-full h-14 rounded-full bg-gradient-to-r from-primary to-primary-dim text-on-primary font-label font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span>{{ authStore.loading ? 'Resetting...' : 'Reset Password' }}</span>
          <span class="material-symbols-outlined text-xl">lock_reset</span>
        </button>
      </form>

      <div class="mt-6 text-center">
        <button
          type="button"
          class="text-sm font-label font-semibold text-primary hover:underline"
          @click="router.push('/login')"
        >
          Return to login
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const token = computed(() => {
  const value = route.query.token
  return typeof value === 'string' ? value : ''
})

const emailFromQuery = computed(() => {
  const value = route.query.email
  return typeof value === 'string' ? value : ''
})

const form = reactive({
  email: emailFromQuery.value,
  password: '',
  password_confirmation: '',
})

const successMessage = ref('')
const errorMessage = ref(!token.value ? 'This reset link is missing its token.' : '')

const handleSubmit = async () => {
  successMessage.value = ''
  errorMessage.value = ''
  authStore.clearError()

  if (!token.value) {
    errorMessage.value = 'This reset link is invalid or incomplete.'
    return
  }

  if (!form.email.trim() || !form.password.trim() || !form.password_confirmation.trim()) {
    errorMessage.value = 'Please complete all password reset fields.'
    return
  }

  if (form.password !== form.password_confirmation) {
    errorMessage.value = 'Passwords do not match.'
    return
  }

  try {
    const response = await authStore.resetPassword({
      token: token.value,
      email: form.email.trim(),
      password: form.password,
      password_confirmation: form.password_confirmation,
    })

    successMessage.value = response.message
    form.password = ''
    form.password_confirmation = ''
  } catch {
    errorMessage.value = authStore.error || 'Unable to reset password.'
  }
}
</script>
