<template>
  <div class="min-h-screen bg-background text-on-background">
    <NavBar />

    <main class="pt-24 pb-16 overflow-hidden">
      <section class="relative px-6 md:px-12 lg:px-24 pt-12 md:pt-20 pb-12">
        <div class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.12),_transparent_30%)]" />

        <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div class="lg:col-span-7 space-y-6">
            <div class="inline-flex items-center gap-2 rounded-full bg-primary-container px-4 py-2 text-xs font-black uppercase tracking-[3px] text-on-primary-container">
              <span class="material-symbols-outlined text-sm">menu_book</span>
              Full Game Walkthrough
            </div>

            <h1 class="text-5xl md:text-7xl font-black tracking-tighter leading-none">
              Game Guidelines
            </h1>

            <p class="max-w-2xl text-lg md:text-xl leading-8 text-on-surface-variant">
              Everything players need to know from the moment a lobby is created until the final
              leaderboard appears. Follow this guide in order if you are new to CodeNopoly.
            </p>

            <div class="flex flex-wrap gap-3">
              <a
                href="#start-here"
                class="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-black text-white transition-transform duration-200 hover:scale-[1.02]"
              >
                Start Here
                <span class="material-symbols-outlined text-base">arrow_downward</span>
              </a>

              <a
                href="#turn-flow"
                class="inline-flex items-center gap-2 rounded-full bg-surface-container-high px-5 py-3 text-sm font-black text-on-surface"
              >
                Turn Flow
                <span class="material-symbols-outlined text-base">sync_alt</span>
              </a>
            </div>
          </div>

          <div class="lg:col-span-5">
            <div class="rounded-[2rem] bg-surface-container-lowest p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <div class="mb-5 flex items-center justify-between">
                <div>
                  <p class="text-xs font-black uppercase tracking-[3px] text-on-surface-variant">
                    Visual Overview
                  </p>
                  <h2 class="mt-2 text-2xl font-black text-on-surface">
                    From lobby to winner
                  </h2>
                </div>

                <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary-container text-on-secondary-container">
                  <span class="material-symbols-outlined">stadia_controller</span>
                </div>
              </div>

              <div class="rounded-[1.75rem] bg-[linear-gradient(145deg,#dbeafe_0%,#f8fafc_42%,#dcfce7_100%)] p-5">
                <div class="grid grid-cols-4 gap-3 text-center">
                  <div class="rounded-2xl bg-white/85 p-3 shadow-sm">
                    <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                      <span class="material-symbols-outlined">groups</span>
                    </div>
                    <p class="mt-2 text-[11px] font-black uppercase tracking-[2px] text-slate-600">
                      Lobby
                    </p>
                  </div>

                  <div class="rounded-2xl bg-white/85 p-3 shadow-sm">
                    <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                      <span class="material-symbols-outlined">casino</span>
                    </div>
                    <p class="mt-2 text-[11px] font-black uppercase tracking-[2px] text-slate-600">
                      Roll
                    </p>
                  </div>

                  <div class="rounded-2xl bg-white/85 p-3 shadow-sm">
                    <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                      <span class="material-symbols-outlined">qr_code_scanner</span>
                    </div>
                    <p class="mt-2 text-[11px] font-black uppercase tracking-[2px] text-slate-600">
                      Verify
                    </p>
                  </div>

                  <div class="rounded-2xl bg-white/85 p-3 shadow-sm">
                    <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                      <span class="material-symbols-outlined">leaderboard</span>
                    </div>
                    <p class="mt-2 text-[11px] font-black uppercase tracking-[2px] text-slate-600">
                      Win
                    </p>
                  </div>
                </div>

                <div class="mt-4 rounded-2xl bg-slate-950 px-5 py-4 text-white">
                  <p class="text-xs font-black uppercase tracking-[3px] text-white/60">
                    Core Rule
                  </p>
                  <p class="mt-2 text-sm leading-6 text-white/85">
                    Roll first and move first. Only scan when you land on a question tile or
                    need to reveal a chance or community chest card.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="start-here" class="px-6 md:px-12 lg:px-24 py-8">
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
            <p class="text-xs font-black uppercase tracking-[3px] text-primary">Complete Flow</p>
            <h2 class="mt-3 text-4xl md:text-5xl font-black tracking-tight">
              Start to End Game Guide
            </h2>
            <p class="mt-4 text-lg leading-8 text-on-surface-variant">
              Each step below follows the actual order players go through during a normal match.
            </p>
          </div>

          <div class="mt-10 space-y-6">
            <article
              v-for="(step, index) in steps"
              :key="step.title"
              :id="step.anchor"
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
                  <p class="text-xs font-black uppercase tracking-[3px] text-white/60">What Players Should Remember</p>
                  <p class="mt-2 text-sm leading-7 text-white/85">{{ step.tip }}</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="turn-flow" class="px-6 md:px-12 lg:px-24 py-10">
        <div class="max-w-6xl mx-auto rounded-[2rem] bg-slate-950 px-6 py-8 md:px-8 md:py-10 text-white">
          <p class="text-xs font-black uppercase tracking-[3px] text-white/60">Fast Reference</p>
          <h2 class="mt-3 text-3xl md:text-4xl font-black tracking-tight">One Turn In Plain English</h2>

          <div class="mt-8 grid grid-cols-1 md:grid-cols-5 gap-4">
            <div
              v-for="turn in turnFlow"
              :key="turn.title"
              class="rounded-[1.5rem] bg-white/8 p-5 ring-1 ring-white/10"
            >
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/12">
                <span class="material-symbols-outlined text-2xl">{{ turn.icon }}</span>
              </div>
              <h3 class="mt-4 text-lg font-black">{{ turn.title }}</h3>
              <p class="mt-2 text-sm leading-6 text-white/72">{{ turn.body }}</p>
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

const quickStart = [
  {
    title: '1. Create Or Join',
    body: 'A host creates the lobby and shares the game code. Other players join using that code before the game begins.',
    icon: 'groups',
    color: 'bg-sky-500',
  },
  {
    title: '2. Start The Match',
    body: 'When everyone is ready, the host starts the game and the system selects whose turn begins first.',
    icon: 'play_circle',
    color: 'bg-emerald-500',
  },
  {
    title: '3. Play By Turn',
    body: 'Each player rolls, lands on a tile, then resolves the action for that location. Scanning is only needed for question and card moments.',
    icon: 'sync',
    color: 'bg-amber-500',
  },
  {
    title: '4. Reach The Finish',
    body: 'Credits, property upgrades, and correct answers shape the rankings until the host ends the game and the final leaderboard is shown.',
    icon: 'emoji_events',
    color: 'bg-violet-500',
  },
] as const

const steps = [
  {
    anchor: 'lobby',
    title: 'Create the lobby and gather players',
    description:
      'Every match begins in a lobby. One player creates the game, receives a unique game code, and shares that code with everyone else who wants to join.',
    icon: 'groups',
    panelClass: 'bg-[linear-gradient(145deg,#1d4ed8_0%,#3b82f6_45%,#93c5fd_100%)]',
    picture: [
      { label: 'Game Code', value: 'Share with players', icon: 'key' },
      { label: 'Lobby', value: 'Wait for everyone', icon: 'meeting_room' },
      { label: 'Players', value: 'Join before start', icon: 'person_add' },
    ],
    points: [
      'The host creates the game and gets the code needed for entry.',
      'Each player joins the same lobby before the host starts the match.',
      'Make sure everyone has connected before moving into gameplay.',
      'If the game has not started yet, players remain in the waiting state.',
    ],
    tip: 'Do not begin until all intended players have joined, because the lobby is where turn order and shared game state are organized.',
  },
  {
    anchor: 'start',
    title: 'Start the game and prepare for the first turn',
    description:
      'Once the host starts the match, the board changes from waiting mode into active play. Players can now monitor the current turn, their credits, and the leaderboard.',
    icon: 'rocket_launch',
    panelClass: 'bg-[linear-gradient(145deg,#047857_0%,#10b981_42%,#6ee7b7_100%)]',
    picture: [
      { label: 'Status', value: 'Game started', icon: 'play_arrow' },
      { label: 'Turn', value: 'Watch active player', icon: 'timer' },
      { label: 'Board', value: 'Live session ready', icon: 'dashboard' },
    ],
    points: [
      'Only the current player should act during that turn.',
      'Everyone can watch the live board, rankings, and current status.',
      'Hosts can monitor progress while players wait for their turn.',
      'If a game ends early, players are redirected to the final leaderboard.',
    ],
    tip: 'The most important thing to watch is the current-turn indicator, because nearly every action is limited to the active player only.',
  },
  {
    anchor: 'roll-and-scan',
    title: 'Roll the dice, move, and resolve the landed tile',
    description:
      'A normal turn starts with rolling the dice. After moving to the new position on the physical board, the player checks what type of tile they landed on and follows the correct action for that tile.',
    icon: 'casino',
    panelClass: 'bg-[linear-gradient(145deg,#b45309_0%,#f59e0b_40%,#fde68a_100%)]',
    picture: [
      { label: 'Dice', value: 'Roll first', icon: 'casino' },
      { label: 'Board Tile', value: 'Move physically', icon: 'map' },
      { label: 'Action', value: 'Resolve tile type', icon: 'rule' },
    ],
    points: [
      'Players should not scan before rolling the dice.',
      'Normal property actions use the landed position already tracked by the game.',
      'Scanning is mainly for question tiles and for chance or community chest card reveals.',
      'If a question or card scan does not match the current position or code, the system blocks the action.',
    ],
    tip: 'The easiest rule to remember is: not every tile needs scanning. Scan only when you wish to reveal a question or card interaction on Chance tile and Community Chest tiles.',
  },
  {
    anchor: 'questions',
    title: 'Answer questions on question tiles',
    description:
      'When a player lands on a question tile, that is one of the times scanning matters. After the tile is verified successfully, the system shows the available difficulties. The chosen question can award credits when answered correctly.',
    icon: 'code',
    panelClass: 'bg-[linear-gradient(145deg,#5b21b6_0%,#8b5cf6_45%,#ddd6fe_100%)]',
    picture: [
      { label: 'Difficulty', value: 'Easy to hard', icon: 'tune' },
      { label: 'Question', value: 'MCQ or structured', icon: 'terminal' },
      { label: 'Reward', value: 'Earn credits', icon: 'savings' },
    ],
    points: [
      'Players scan only when they need to verify a question tile before opening its challenge.',
      'After verification, players pick one of the available difficulties for that tile.',
      'Questions can be multiple-choice or structured answer format.',
      'Correct answers increase credits and may affect leaderboard rank.',
      'Hints can help, but they are still tied to the current turn and active question.',
    ],
    tip: 'If you landed on a question tile, the next clear step is scan, choose difficulty, answer, then continue the turn.',
  },
  {
    anchor: 'cards',
    title: 'Scan chance and community chest cards when prompted',
    description:
      'Card interactions are the other place where scanning is part of the game flow. When a player lands on a matching card tile or needs to reveal a card effect, the card code is scanned so the system can apply the correct result.',
    icon: 'style',
    panelClass: 'bg-[linear-gradient(145deg,#0f172a_0%,#334155_45%,#94a3b8_100%)]',
    picture: [
      { label: 'Card Type', value: 'Chance or chest', icon: 'featured_play_list' },
      { label: 'Scan', value: 'Reveal the card', icon: 'qr_code_scanner' },
      { label: 'Effect', value: 'Apply result', icon: 'bolt' },
    ],
    points: [
      'Players do not scan random tiles just because they moved there.',
      'Card scanning is used when the game needs to reveal a chance or community chest effect.',
      'The scanned card determines the movement, credit, or special effect that follows.',
      'After the card result is shown, the board state updates with the new outcome.',
    ],
    tip: 'Question tiles and cards are the two scan-heavy parts of the experience. Property turns are simpler and usually do not need scanning.',
  },
  {
    anchor: 'properties',
    title: 'Buy property, pay rent, and upgrade holdings',
    description:
      'Property tiles affect the economy of the game. Players can purchase unowned properties, pay rent to rivals, and later invest in houses or hotels to increase value. These actions rely on the landed position already tracked by the system, so they do not usually need a separate scan.',
    icon: 'home_work',
    panelClass: 'bg-[linear-gradient(145deg,#0f766e_0%,#14b8a6_45%,#99f6e4_100%)]',
    picture: [
      { label: 'Property', value: 'Buy if unowned', icon: 'real_estate_agent' },
      { label: 'Rent', value: 'Pay when needed', icon: 'payments' },
      { label: 'Upgrade', value: 'House or hotel', icon: 'apartment' },
    ],
    points: [
      'A player must be on the correct tile before buying that property.',
      'The backend already checks the player position before buy and rent actions are allowed.',
      'Owned property may trigger rent payments when another player lands there.',
      'Houses and hotels improve the property and strengthen future returns.',
      'Some upgrades are limited by the rules of the current turn and previous actions.',
    ],
    tip: 'Properties are long-term strategy tools, while questions and cards are the places where scanning adds physical interaction to the turn.',
  },
  {
    anchor: 'endgame',
    title: 'End turns, track rankings, and finish the match',
    description:
      'After actions are complete, the player ends the turn so the next player can continue. Throughout the game, the leaderboard updates until the host ends the session and the final results are shown.',
    icon: 'leaderboard',
    panelClass: 'bg-[linear-gradient(145deg,#be185d_0%,#ec4899_45%,#fbcfe8_100%)]',
    picture: [
      { label: 'End Turn', value: 'Pass control', icon: 'skip_next' },
      { label: 'Leaderboard', value: 'Watch rankings', icon: 'leaderboard' },
      { label: 'Finish', value: 'Final results page', icon: 'emoji_events' },
    ],
    points: [
      'Only end the turn after the allowed actions for that move are complete.',
      'The leaderboard reflects credit totals and game progress over time.',
      'The host can end the game when the session should be finalized.',
      'Once the game ends, players are taken to the final leaderboard page.',
    ],
    tip: 'If players are unsure whether they are done, the simplest rule is: roll, resolve the landed tile, scan only if it is a question or card moment, then end the turn.',
  },
] as const

const turnFlow = [
  {
    title: 'Roll',
    body: 'The active player rolls the dice to determine movement.',
    icon: 'casino',
  },
  {
    title: 'Move',
    body: 'The player moves to the landed tile on the physical board.',
    icon: 'directions_walk',
  },
  {
    title: 'Check Tile',
    body: 'See whether it is a property, a question tile, or a chance/community chest moment.',
    icon: 'qr_code_scanner',
  },
  {
    title: 'Resolve',
    body: 'Answer, scan a card, pay rent, or buy property depending on the landed tile.',
    icon: 'rule',
  },
  {
    title: 'End Turn',
    body: 'Control passes to the next player and the board updates.',
    icon: 'skip_next',
  },
] as const
</script>
