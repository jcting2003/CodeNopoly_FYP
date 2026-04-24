<template>
  <div
    class="bg-background text-on-background selection:bg-primary-container selection:text-on-primary-container"
  >
    <NavBar />

    <main class="pt-24 pb-12 overflow-hidden">
      <!-- Hero Section -->
      <section
        class="relative px-6 md:px-12 lg:px-24 py-16 md:py-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
      >
        <div
          class="absolute inset-0 -z-10 opacity-10 pointer-events-none select-none font-mono text-xs overflow-hidden leading-relaxed p-10"
        >
          <pre>{{ codeSnippet }}</pre>
        </div>

        <div class="lg:col-span-7 space-y-8">
          <div
            class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold tracking-widest uppercase font-label"
          >
            <span class="material-symbols-outlined text-sm">terminal</span>
            The Evolution of Board Games
          </div>

          <h1
            class="text-6xl md:text-8xl font-bold tracking-tighter text-on-background leading-none"
          >
            CodeNopoly<br />
            <span class="text-primary">Syntax Mastery.</span>
          </h1>

          <p class="text-xl md:text-2xl text-on-surface-variant max-w-xl font-body leading-relaxed">
            A high-stakes hybrid experience blending tactile physical boards with digital NFC
            execution. Build your repository, outsmart rivals, and compile your way to victory.
          </p>

          <div class="flex flex-wrap gap-4 pt-4">
            <button
              class="px-8 py-4 rounded-full bg-gradient-to-br from-primary to-primary-dim text-on-primary font-bold text-lg shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
            >
              Initialize Session
            </button>

            <button
              class="px-8 py-4 rounded-full bg-secondary-container text-on-secondary-container font-bold text-lg hover:bg-secondary-fixed transition-all active:scale-95"
            >
              Join Network
            </button>
          </div>
        </div>

        <div class="lg:col-span-5 relative">
          <div
            class="relative z-10 p-6 bg-surface-container-lowest rounded-xl shadow-[0_12px_40px_rgba(42,51,60,0.06)] transform rotate-2 hover:rotate-0 transition-transform duration-500"
          >
            <div
              class="h-20 -mx-6 -mt-6 rounded-t-xl bg-secondary mb-8 flex items-center justify-center"
            >
              <span class="text-white font-headline font-bold text-2xl tracking-tighter">
                LIST COMPREHENSION
              </span>
            </div>

            <div class="space-y-6 pb-4">
              <div>
                <span
                  class="text-[10px] uppercase tracking-widest text-on-surface-variant font-label"
                >
                  Property Value
                </span>
                <p class="text-2xl font-bold font-headline">50 CREDITS</p>
              </div>

              <div>
                <span
                  class="text-[10px] uppercase tracking-widest text-on-surface-variant font-label"
                >
                  Runtime Rent
                </span>
                <p class="text-xl font-medium font-headline">45ms / turn</p>
              </div>

              <div class="flex justify-between items-center pt-4 border-t border-outline-variant/15">
                <span
                  class="px-3 py-1 bg-surface-variant text-on-surface-variant text-[10px] rounded-sm font-label"
                >
                  CLASS A
                </span>
                <span class="material-symbols-outlined filled-icon text-primary">
                  auto_awesome
                </span>
              </div>
            </div>
          </div>

          <div
            class="absolute top-10 -right-4 w-full h-full bg-primary/5 rounded-xl -z-10 backdrop-blur-sm -rotate-3 border border-primary/10"
          ></div>
        </div>
      </section>

      <!-- How It Works -->
      <section class="px-6 md:px-12 lg:px-24 py-24 space-y-12">
        <div class="text-center space-y-4 max-w-2xl mx-auto">
          <h2 class="text-4xl font-bold tracking-tight">How the Engine Operates</h2>
          <p class="text-on-surface-variant">
            Three layers of synchronized logic connecting your physical moves to the global ledger.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            class="p-8 bg-surface-container-low rounded-xl space-y-6 hover:bg-surface-container transition-colors group"
          >
            <div
              class="w-12 h-12 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container group-hover:scale-110 transition-transform"
            >
              <span class="material-symbols-outlined">grid_view</span>
            </div>
            <h3 class="text-2xl font-bold tracking-tight">Physical Board</h3>
            <p class="text-sm leading-relaxed text-on-surface-variant font-body">
              A high-quality tactile board designed with minimalist aesthetics. Every tile contains
              an embedded NFC sensor for real-time tracking.
            </p>
          </div>

          <div
            class="p-8 bg-surface-container-low rounded-xl space-y-6 hover:bg-surface-container transition-colors group"
          >
            <div
              class="w-12 h-12 rounded-lg bg-tertiary-container flex items-center justify-center text-on-tertiary-container group-hover:scale-110 transition-transform"
            >
              <span class="material-symbols-outlined">nfc</span>
            </div>
            <h3 class="text-2xl font-bold tracking-tight">NFC Integration</h3>
            <p class="text-sm leading-relaxed text-on-surface-variant font-body">
              Tap your custom "Token" on any tile to register your position. The web app instantly
              updates your inventory and wallet state.
            </p>
          </div>

          <div
            class="p-8 bg-surface-container-low rounded-xl space-y-6 hover:bg-surface-container transition-colors group"
          >
            <div
              class="w-12 h-12 rounded-lg bg-secondary-container flex items-center justify-center text-on-secondary-container group-hover:scale-110 transition-transform"
            >
              <span class="material-symbols-outlined">code</span>
            </div>
            <h3 class="text-2xl font-bold tracking-tight">Web IDE App</h3>
            <p class="text-sm leading-relaxed text-on-surface-variant font-body">
              Manage properties, trade functions with other players, and solve coding challenges to
              earn multipliers in our premium app shell.
            </p>
          </div>
        </div>
      </section>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'

const codeSnippet = `class Player(Logic):
    def __init__(self, nfc_tag):
        self.inventory = []
        self.position = 0
        self.syntax_level = 1

def handle_roll(dice_value):
    # Logic for Pythonopoly Move
    player.move(dice_value)
    if board.tile[player.pos].is_property:
        player.execute_transaction()`
</script>
