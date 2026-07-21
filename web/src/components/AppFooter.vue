<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <footer
    class="px-6 md:px-12 lg:px-24 py-3 bg-sky-300/20 shadow-lg flex flex-col md:flex-row justify-between items-start gap-8"
  >
    <div class="space-y-4">
      <span class="text-xl font-bold tracking-tighter text-blue-700">CodeNopoly</span>
      <p class="text-xs text-on-surface-variant max-w-xs font-body">
        A production by APU student. All code execution is final. No refunds on
        corrupted dependencies.
      </p>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 gap-12">
      <div class="flex flex-col gap-3">
        <span class="text-[10px] uppercase font-label tracking-widest font-bold">
          Documentation
        </span>
        <RouterLink class="text-sm hover:text-primary" to="/nfc-setup">NFC Setup</RouterLink>
        <RouterLink class="text-sm hover:text-primary" to="/game-guidelines">Rulebook</RouterLink>
      </div>

      <div class="flex flex-col gap-3">
        <span class="text-[10px] uppercase font-label tracking-widest font-bold">Community</span>
        <a class="text-sm hover:text-primary" href="https://github.com/jcting2003/CodeNopoly_FYP" target="_blank" rel="noopener noreferrer">
          GitHub Repo
        </a>
      </div>

      <div class="flex flex-col gap-3">
        <span class="text-[10px] uppercase font-label tracking-widest font-bold">Legal</span>
        <RouterLink class="text-sm hover:text-primary" to="/legal#privacy">Privacy Policy</RouterLink>
        <RouterLink class="text-sm hover:text-primary" to="/legal#legal">Legal Notice</RouterLink>
      </div>
    </div>
  </footer>
</template>
