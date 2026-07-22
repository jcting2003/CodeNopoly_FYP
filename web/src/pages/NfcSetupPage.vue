<template>
  <div class="min-h-screen bg-background text-on-background">
    <NavBar />

    <main class="pt-24 pb-16 overflow-hidden">
      <section class="relative px-6 md:px-12 lg:px-24 pt-12 md:pt-20 pb-12">
        <div class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.14),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.12),_transparent_32%)]" />

        <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div class="lg:col-span-7 space-y-6">
            <div class="inline-flex items-center gap-2 rounded-full bg-tertiary-container px-4 py-2 text-xs font-black uppercase tracking-[3px] text-on-tertiary-container">
              <span class="material-symbols-outlined text-sm">nfc</span>
              Hardware Setup Guide
            </div>

            <h1 class="text-5xl md:text-7xl font-black tracking-tighter leading-none">
              NFC Setup
            </h1>

            <p class="max-w-2xl text-lg md:text-xl leading-8 text-on-surface-variant">
              Get your board, tags, and browser ready before starting a match. This page
              walks through the easiest setup flow for hosts and players using the web app.
            </p>

            <div class="flex flex-wrap gap-3">
              <a
                href="#quick-check"
                class="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-black text-white transition-transform duration-200 hover:scale-[1.02]"
              >
                Quick Check
                <span class="material-symbols-outlined text-base">arrow_downward</span>
              </a>

              <a
                href="#troubleshooting"
                class="inline-flex items-center gap-2 rounded-full bg-surface-container-high px-5 py-3 text-sm font-black text-on-surface"
              >
                Troubleshooting
                <span class="material-symbols-outlined text-base">build</span>
              </a>
            </div>
          </div>

          <div class="lg:col-span-5">
            <div class="rounded-[2rem] bg-surface-container-lowest p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <div class="mb-5 flex items-center justify-between">
                <div>
                  <p class="text-xs font-black uppercase tracking-[3px] text-on-surface-variant">
                    Ready Checklist
                  </p>
                  <h2 class="mt-2 text-2xl font-black text-on-surface">
                    Before you tap
                  </h2>
                </div>

                <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-container text-on-primary-container">
                  <span class="material-symbols-outlined">memory</span>
                </div>
              </div>

              <div class="space-y-3 rounded-[1.75rem] bg-[linear-gradient(145deg,#ecfeff_0%,#f8fafc_38%,#dbeafe_100%)] p-5">
                <div
                  v-for="item in checklist"
                  :key="item.title"
                  class="flex items-start gap-3 rounded-2xl bg-white/85 p-4 shadow-sm"
                >
                  <div class="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                    <span class="material-symbols-outlined">{{ item.icon }}</span>
                  </div>
                  <div>
                    <p class="text-[11px] font-black uppercase tracking-[2px] text-slate-500">
                      {{ item.title }}
                    </p>
                    <p class="mt-1 text-sm font-semibold leading-6 text-slate-700">
                      {{ item.body }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="quick-check" class="px-6 md:px-12 lg:px-24 py-8">
        <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          <article
            v-for="item in quickStart"
            :key="item.title"
            class="rounded-[2rem] bg-surface-container-low p-6"
          >
            <div
              class="flex h-14 w-14 items-center justify-center rounded-2xl text-white"
              :class="item.color"
            >
              <span class="material-symbols-outlined text-3xl">{{ item.icon }}</span>
            </div>
            <h2 class="mt-5 text-2xl font-black">{{ item.title }}</h2>
            <p class="mt-3 text-sm leading-7 text-on-surface-variant">{{ item.body }}</p>
          </article>
        </div>
      </section>

      <section class="px-6 md:px-12 lg:px-24 py-14">
        <div class="max-w-6xl mx-auto">
          <div class="max-w-2xl">
            <p class="text-xs font-black uppercase tracking-[3px] text-primary">Step By Step</p>
            <h2 class="mt-3 text-4xl md:text-5xl font-black tracking-tight">
              How to prepare NFC for a match
            </h2>
            <p class="mt-4 text-lg leading-8 text-on-surface-variant">
              Follow this in order if you want the smoothest setup before players start
              scanning tiles or cards.
            </p>
          </div>

          <div class="mt-10 space-y-6">
            <article
              v-for="(step, index) in steps"
              :key="step.title"
              class="grid grid-cols-1 lg:grid-cols-12 overflow-hidden rounded-[2rem] bg-surface-container-lowest shadow-[0_14px_45px_rgba(15,23,42,0.06)]"
            >
              <div class="lg:col-span-4 p-6 md:p-8" :class="step.panelClass">
                <div class="flex items-center justify-between">
                  <div class="rounded-full bg-white/85 px-4 py-2 text-xs font-black uppercase tracking-[3px] text-slate-700">
                    Step {{ index + 1 }}
                  </div>
                  <span class="material-symbols-outlined text-4xl text-white/90">
                    {{ step.icon }}
                  </span>
                </div>

                <div class="mt-8 rounded-[1.75rem] bg-white/14 p-5 backdrop-blur-sm">
                  <div class="flex h-44 items-center justify-center rounded-[1.5rem] border border-white/30 bg-white/10">
                    <div class="w-full max-w-[16rem] space-y-3">
                      <div
                        v-for="picture in step.picture"
                        :key="picture.label"
                        class="flex items-center gap-3 rounded-2xl bg-white/80 px-4 py-3 text-slate-700 shadow-sm"
                      >
                        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                          <span class="material-symbols-outlined text-slate-700">
                            {{ picture.icon }}
                          </span>
                        </div>
                        <div>
                          <p class="text-[11px] font-black uppercase tracking-[2px] text-slate-500">
                            {{ picture.label }}
                          </p>
                          <p class="text-sm font-bold text-slate-800">{{ picture.value }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="lg:col-span-8 p-6 md:p-8">
                <h3 class="text-3xl font-black tracking-tight">{{ step.title }}</h3>
                <p class="mt-4 text-base leading-8 text-on-surface-variant">{{ step.description }}</p>

                <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    v-for="point in step.points"
                    :key="point"
                    class="rounded-2xl bg-surface-container-low px-4 py-4 text-sm leading-7 text-on-surface-variant"
                  >
                    <span class="mr-2 font-black text-primary">•</span>{{ point }}
                  </div>
                </div>

                <div class="mt-6 rounded-[1.5rem] bg-slate-950 px-5 py-4 text-white">
                  <p class="text-xs font-black uppercase tracking-[3px] text-white/60">Helpful Reminder</p>
                  <p class="mt-2 text-sm leading-7 text-white/85">{{ step.tip }}</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="troubleshooting" class="px-6 md:px-12 lg:px-24 py-10">
        <div class="max-w-6xl mx-auto rounded-[2rem] bg-slate-950 px-6 py-8 md:px-8 md:py-10 text-white">
          <p class="text-xs font-black uppercase tracking-[3px] text-white/60">Troubleshooting</p>
          <h2 class="mt-3 text-3xl md:text-4xl font-black tracking-tight">If scanning does not work</h2>

          <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              v-for="issue in troubleshooting"
              :key="issue.title"
              class="rounded-[1.5rem] bg-white/8 p-5 ring-1 ring-white/10"
            >
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/12">
                <span class="material-symbols-outlined text-2xl">{{ issue.icon }}</span>
              </div>
              <h3 class="mt-4 text-lg font-black">{{ issue.title }}</h3>
              <p class="mt-2 text-sm leading-6 text-white/72">{{ issue.body }}</p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
import Footer from '@/components/AppFooter.vue'

const checklist = [
  {
    title: 'Browser',
    body: 'Use a browser and device that can read NFC or connect cleanly to your reader setup.',
    icon: 'language',
  },
  {
    title: 'Tags',
    body: 'Make sure each NFC tag is labeled clearly so players know which piece or tile they are tapping.',
    icon: 'sell',
  },
  {
    title: 'Board',
    body: 'Place the physical board flat and keep the tag position consistent for every scan.',
    icon: 'grid_view',
  },
] as const

const quickStart = [
  {
    title: '1. Prepare Device',
    body: 'Turn on NFC support and keep the browser tab open before the match starts.',
    icon: 'smartphone',
    color: 'bg-sky-500',
  },
  {
    title: '2. Check Tags',
    body: 'Confirm the board tiles or player tokens use the NFC tags you expect before gameplay.',
    icon: 'nfc',
    color: 'bg-emerald-500',
  },
  {
    title: '3. Test A Scan',
    body: 'Run one quick scan before the lobby goes live so players know the setup is working.',
    icon: 'qr_code_scanner',
    color: 'bg-amber-500',
  },
  {
    title: '4. Start Match',
    body: 'Once the test succeeds, continue into the normal lobby and gameplay flow.',
    icon: 'play_circle',
    color: 'bg-violet-500',
  },
] as const

const steps = [
  {
    title: 'Get your scanning device ready',
    description:
      'Open the web app on the device that will be used for NFC interactions. Hosts should verify battery, browser access, and physical placement before players gather.',
    icon: 'devices',
    panelClass: 'bg-[linear-gradient(145deg,#1d4ed8_0%,#3b82f6_45%,#93c5fd_100%)]',
    picture: [
      { label: 'Device', value: 'Phone or reader station', icon: 'phonelink_setup' },
      { label: 'Browser', value: 'Keep game tab active', icon: 'language' },
      { label: 'Power', value: 'Charge before session', icon: 'battery_charging_full' },
    ],
    points: [
      'Use one consistent device if possible so players learn the scan position quickly.',
      'Keep the device unlocked and ready before asking players to scan.',
      'If you are using a phone, make sure NFC is enabled in system settings.',
      'Avoid switching browsers or tabs during the setup test.',
    ],
    tip: 'Most setup problems come from the device not being ready yet, so start there before checking the board or tags.',
  },
  {
    title: 'Map your tags to the physical board flow',
    description:
      'Before gameplay, confirm which tags belong to tiles, cards, or player tokens. Clear labeling prevents players from tapping the wrong item during a turn.',
    icon: 'schema',
    panelClass: 'bg-[linear-gradient(145deg,#047857_0%,#10b981_42%,#6ee7b7_100%)]',
    picture: [
      { label: 'Tiles', value: 'Question and card zones', icon: 'map' },
      { label: 'Cards', value: 'Chance or chest set', icon: 'style' },
      { label: 'Tokens', value: 'Keep player tags distinct', icon: 'person_pin_circle' },
    ],
    points: [
      'Label tags physically if they look identical.',
      'Keep chance and community chest tags separate from normal property areas.',
      'Make sure players know which items need scanning and which do not.',
      'Use the same naming or numbering pattern across the board and your printed guide.',
    ],
    tip: 'Good labeling makes setup feel simple because players stop guessing what needs to be scanned.',
  },
  {
    title: 'Run a quick pre-game scan test',
    description:
      'Test one known NFC interaction before the session starts. A quick success tells you the device, browser, and tag placement are all aligned.',
    icon: 'fact_check',
    panelClass: 'bg-[linear-gradient(145deg,#b45309_0%,#f59e0b_40%,#fde68a_100%)]',
    picture: [
      { label: 'Test', value: 'Use one known tag', icon: 'verified' },
      { label: 'Distance', value: 'Hold steady and close', icon: 'straighten' },
      { label: 'Feedback', value: 'Confirm app response', icon: 'task_alt' },
    ],
    points: [
      'Use a tag you can easily identify first.',
      'Hold the device still for a moment instead of tapping too quickly.',
      'Watch for the app feedback before moving on.',
      'If the first test fails, retry with slower movement and cleaner positioning.',
    ],
    tip: 'A single successful test before the lobby starts is much easier than debugging during a live turn.',
  },
  {
    title: 'Explain the scan rules to players',
    description:
      'Once the hardware is ready, tell players when they should scan. This reduces confusion and keeps the table moving smoothly.',
    icon: 'record_voice_over',
    panelClass: 'bg-[linear-gradient(145deg,#5b21b6_0%,#8b5cf6_45%,#ddd6fe_100%)]',
    picture: [
      { label: 'Questions', value: 'Scan when prompted', icon: 'code' },
      { label: 'Cards', value: 'Scan to reveal effects', icon: 'featured_play_list' },
      { label: 'Properties', value: 'Usually no scan needed', icon: 'home_work' },
    ],
    points: [
      'Tell players that not every turn needs an NFC scan.',
      'Question tiles and card moments should be the main scan-heavy interactions.',
      'Property purchases and rent usually follow the tracked board state instead.',
      'Keeping the rules short helps new players feel more confident.',
    ],
    tip: 'The simpler the explanation, the fewer mid-game interruptions you will have.',
  },
] as const

const troubleshooting = [
  {
    title: 'No response on tap',
    body: 'Check that NFC is enabled, the device is close enough to the tag, and the tag is the one you intended to test.',
    icon: 'nfc',
  },
  {
    title: 'Wrong item scanned',
    body: 'Relabel your tags or separate them more clearly so players can identify the correct tile or card before tapping.',
    icon: 'label_important',
  },
  {
    title: 'Players are confused',
    body: 'Remind the table that scanning is mainly for question tiles and card reveals, not every move on the board.',
    icon: 'help',
  },
] as const
</script>
