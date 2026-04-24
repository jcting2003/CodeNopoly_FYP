<template>
  <div class="bg-surface min-h-screen">
    <Navbar />

    <!-- SideNavBar -->
    <aside
      class="fixed left-0 top-0 h-full flex flex-col p-4 z-40 bg-slate-100/50 backdrop-blur-lg w-64 rounded-r-2xl pt-24 text-sm"
    >
      <div class="mb-8 px-2">
        <div class="flex items-center gap-3 mb-1">
          <div class="p-2 bg-purple-100 rounded-xl text-purple-600">
            <span class="material-symbols-outlined">grid_view</span>
          </div>
          <div>
            <h3 class="font-headline font-bold text-slate-900">{{ gameName }}</h3>
            <p class="text-xs text-slate-500">Turn: {{ currentTurnText }}</p>
          </div>
        </div>
      </div>

      <div class="space-y-1 flex-1">
        <div
          class="bg-white text-purple-700 rounded-xl shadow-sm font-bold flex items-center gap-3 p-3 transition-all duration-300"
        >
          <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">
            group
          </span>
          <span>Leaderboard</span>
        </div>

        <div class="mt-4 px-2 space-y-4">
          <div
            v-for="player in rankedPlayers"
            :key="player.id"
            class="flex flex-col gap-2 rounded-2xl transition-all duration-300"
            :class="
              player.isCurrentTurn
                ? 'p-4 bg-surface-container-lowest border-l-4 border-primary dice-shadow'
                : player.isDimmed
                  ? 'p-3 opacity-60 hover:pl-3'
                  : 'p-3 hover:pl-3'
            "
          >
            <div class="flex justify-between items-start gap-3">
              <div class="flex items-start gap-3">
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  :class="
                    player.rank === 1
                      ? 'bg-yellow-100 text-yellow-700'
                      : player.rank === 2
                        ? 'bg-slate-200 text-slate-700'
                        : player.rank === 3
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                  "
                >
                  {{ player.rank }}
                </div>

                <div>
                  <p
                    class="font-headline font-bold leading-tight"
                    :class="player.isCurrentTurn ? 'text-primary' : 'text-slate-900'"
                  >
                    {{ player.name }}
                  </p>

                  <p class="text-[11px] text-slate-500 mt-1">
                    Position: {{ player.position !== null ? player.position : '—' }}
                  </p>
                </div>
              </div>

              <div class="text-right">
                <p
                  class="font-bold text-sm"
                  :class="player.isCurrentTurn ? 'text-primary' : player.rankColor"
                >
                  {{ player.credits }}
                  <span class="text-[10px] font-normal opacity-70">Cr</span>
                </p>
                <p class="text-[11px] text-slate-500">
                  Total: {{ player.totalCredits }}
                </p>
              </div>
            </div>

            <p
              v-if="player.isCurrentTurn"
              class="text-[10px] uppercase tracking-wider text-primary-dim font-bold"
            >
              Current Turn
            </p>

            <div class="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
              <div
                class="h-full"
                :class="player.progressColor"
                :style="{ width: `${player.progressWidth}%` }"
              ></div>
            </div>
          </div>

          <p
            v-if="!loadingLeaderboard && rankedPlayers.length === 0"
            class="text-xs text-slate-500 px-2"
          >
            No players found.
          </p>
        </div>
      </div>

      <button
        type="button"
        @click="handleRollDice"
        :disabled="rollingDice || !isCurrentUserTurn || hasRolledThisTurn"
        class="w-full py-4 bg-primary text-white rounded-2xl font-headline font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mb-4 hover:bg-primary-dim transition-all active:scale-95 duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span class="material-symbols-outlined">casino</span>
        {{ rollingDice ? 'Rolling...' : 'Roll Syntax Dice' }}
      </button>

      <div class="pt-4 border-t border-slate-200 space-y-2">
        <div class="flex items-center gap-3 p-2 text-slate-600 hover:bg-slate-200/50 rounded-lg">
          <span class="material-symbols-outlined">description</span>
          <span>Docs</span>
        </div>
        <div class="flex items-center gap-3 p-2 text-slate-600 hover:bg-slate-200/50 rounded-lg">
          <span class="material-symbols-outlined">help</span>
          <span>Help</span>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="ml-64 pt-24 pb-24 px-8 min-h-screen">
      <div class="max-w-6xl mx-auto">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <span
                class="px-3 py-1 bg-primary-container text-on-primary-container text-xs font-bold rounded-full uppercase tracking-widest"
              >
                Turn {{ turnNumber || '—' }}
              </span>

              <span class="text-on-surface-variant font-label text-sm tracking-tight flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">schedule</span>
                {{ elapsedTime }}
              </span>
            </div>

            <h1 class="text-5xl md:text-6xl font-headline font-bold tracking-tighter text-on-surface">
              Code: <span class="text-primary">{{ gameCode || '—' }}</span>
            </h1>
          </div>

          <div class="flex gap-4">
            <div class="px-6 py-3 bg-surface-container-low rounded-2xl flex flex-col items-end">
              <span class="text-xs uppercase tracking-widest text-on-surface-variant font-bold">
                Position
              </span>
              <span class="text-2xl font-headline font-bold text-on-surface">
                {{ currentPositionLabel }}
              </span>
            </div>

            <div class="px-6 py-3 bg-surface-container-low rounded-2xl flex flex-col items-end">
              <span class="text-xs uppercase tracking-widest text-on-surface-variant font-bold">
                Current Tile
              </span>
              <span class="text-2xl font-headline font-bold text-secondary">
                {{ resolvedCurrentTile || '—' }}
              </span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-6">
          <!-- Dice Engine -->
          <div
            class="col-span-12 lg:col-span-7 bg-surface-container-lowest rounded-[2rem] p-8 dice-shadow relative overflow-hidden"
          >
            <div class="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <span class="material-symbols-outlined text-9xl">casino</span>
            </div>

            <div class="relative z-10">
              <h2 class="text-2xl font-headline font-bold mb-8">Dice Engine</h2>

              <div class="flex items-center gap-8 mb-10">
                <div
                  class="w-32 h-32 bg-primary rounded-3xl flex items-center justify-center text-6xl text-white font-headline font-bold shadow-xl shadow-primary/30"
                >
                  {{ diceOneDisplay }}
                </div>

                <div
                  class="w-32 h-32 bg-primary-dim rounded-3xl flex items-center justify-center text-6xl text-white font-headline font-bold shadow-xl shadow-primary/30"
                >
                  {{ diceTwoDisplay }}
                </div>

                <div class="flex flex-col">
                  <span class="text-sm font-label uppercase tracking-widest text-on-surface-variant">
                    Total Result
                  </span>
                  <span class="text-5xl font-headline font-bold text-primary">
                    {{ diceTotalDisplay }}
                  </span>
                  <span class="text-xs text-tertiary font-bold flex items-center gap-1 mt-1">
                    <span class="material-symbols-outlined text-xs">check_circle</span>
                    {{ lastDiceRoll !== null ? 'Valid Move' : 'Awaiting Roll' }}
                  </span>
                </div>
              </div>

              <div class="flex gap-4">
                <button
                  type="button"
                  @click="handleRollDice"
                  :disabled="rollingDice || !isCurrentUserTurn || hasRolledThisTurn"
                  class="px-8 py-4 bg-gradient-to-br from-primary to-primary-dim text-white rounded-full font-headline font-bold flex items-center gap-2 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span class="material-symbols-outlined">refresh</span>
                  {{ rollingDice ? 'Rolling...' : 'Roll Dice' }}
                </button>

                <button
                  type="button"
                  class="px-8 py-4 bg-surface-container-highest text-on-surface rounded-full font-headline font-bold hover:bg-surface-container-high transition-colors"
                >
                  View Probabilities
                </button>
              </div>
            </div>
          </div>

          <!-- Sync Portal -->
          <div
            class="col-span-12 lg:col-span-5 bg-tertiary-container rounded-[2rem] p-8 flex flex-col justify-between relative overflow-hidden"
          >
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-headline font-bold text-on-tertiary-container">
                  Sync Portal
                </h2>
                <div class="w-12 h-12 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center">
                  <span
                    class="material-symbols-outlined text-on-tertiary-container"
                    style="font-variation-settings: 'FILL' 1;"
                  >
                    nfc
                  </span>
                </div>
              </div>

              <div class="p-6 bg-white/60 backdrop-blur-xl rounded-2xl border-2 border-white/50 mb-6 space-y-4">
                <p class="text-on-tertiary-container font-medium">
                  Awaiting tile verification...
                </p>

                <input
                  v-model="qrInputValue"
                  type="text"
                  placeholder="Enter QR value for testing"
                  class="w-full px-4 py-3 rounded-xl border border-white/50 bg-white text-slate-800 outline-none"
                />

                <button
                  type="button"
                  @click="handleScanTile"
                  :disabled="scanningTile || !isCurrentUserTurn || !hasRolledThisTurn"
                  class="w-full px-4 py-3 rounded-xl bg-tertiary text-white font-bold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {{ scanningTile ? 'Scanning...' : 'Scan Tile (QR Test)' }}
                </button>

                <div class="flex items-center gap-4">
                  <div class="w-full h-3 bg-white/40 rounded-full overflow-hidden">
                    <div class="h-full bg-tertiary w-1/3 animate-pulse"></div>
                  </div>
                  <span class="text-xs font-bold text-on-tertiary-container">33%</span>
                </div>
              </div>
            </div>

            <div class="bg-white p-4 rounded-2xl flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-slate-600">contactless</span>
              </div>
              <p class="text-sm font-medium leading-tight">
                Scan tile on physical board to confirm position
              </p>
            </div>
          </div>

          <!-- Syntax State -->
          <div class="col-span-12 lg:col-span-4 bg-surface-container-high rounded-[2rem] p-8">
            <h2 class="text-xl font-headline font-bold mb-6">Syntax State</h2>

            <div class="space-y-4">
              <div class="flex justify-between items-center p-4 bg-white/50 rounded-xl">
                <span class="text-sm font-medium opacity-70">Current Turn Player</span>
                <span class="px-2 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold rounded">
                  {{ currentTurnName || '—' }}
                </span>
              </div>

              <div class="flex justify-between items-center p-4 bg-white/50 rounded-xl">
                <span class="text-sm font-medium opacity-70">Last Dice Roll</span>
                <span class="font-headline font-bold">{{ lastDiceRoll ?? '—' }}</span>
              </div>

              <div class="flex justify-between items-center p-4 bg-white/50 rounded-xl">
                <span class="text-sm font-medium opacity-70">Game Status</span>
                <div class="flex gap-1 items-center">
                  <div class="w-2 h-4 bg-tertiary rounded-sm"></div>
                  <span class="font-headline font-bold text-sm">{{ gameStatus || '—' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Tile Details -->
          <div
            class="col-span-12 lg:col-span-8 bg-surface-container-low rounded-[2rem] overflow-hidden flex flex-col md:flex-row"
          >
            <div class="w-full md:w-1/3 bg-secondary p-8 flex flex-col justify-between text-white">
              <div>
                <span class="text-xs font-label uppercase tracking-widest opacity-80">Library</span>
                <h2 class="text-3xl font-headline font-bold leading-none mt-1">
                  {{ resolvedCurrentTile || 'Unknown Tile' }}
                </h2>
              </div>

              <span class="material-symbols-outlined text-6xl opacity-30">code</span>
            </div>

            <div class="w-full md:w-2/3 p-8 bg-surface-container-lowest">
              <div class="grid grid-cols-2 gap-8">
                <div>
                  <span class="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold block mb-1">
                    Execution Cost
                  </span>
                  <span class="text-2xl font-headline font-bold">
                    {{ currentProperty ? `${currentProperty.cost} Cr` : executionCost }}
                  </span>
                </div>

                <div>
                  <span class="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold block mb-1">
                    Runtime Yield
                  </span>
                  <span class="text-2xl font-headline font-bold text-tertiary">
                    {{ currentProperty ? currentProperty.color_group : runtimeYield }}
                  </span>
                </div>

                <div class="col-span-2">
                  <span class="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold block mb-2">
                    Description
                  </span>
                  <p class="text-sm text-on-surface-variant leading-relaxed">
                    {{ currentProperty
                      ? `${currentProperty.property_name} • Owner: ${currentProperty.owner_name || 'Unowned'} • Houses: ${currentProperty.houses} • Hotel: ${currentProperty.hotel ? 'Yes' : 'No'} • Rent Due: ${currentRentAmount} Cr`
                      : tileDescription }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Action Bar -->
        <div class="mt-12 flex justify-end gap-4">
          <button
            v-if="canBuyCurrentProperty"
            type="button"
            @click="handleBuyProperty"
            :disabled="buyingProperty"
            class="px-10 py-5 bg-gradient-to-r from-primary to-primary-dim text-white rounded-full font-headline font-bold hover:shadow-xl transition-colors scale-95 active:scale-90 duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {{ buyingProperty ? 'Buying...' : 'Buy Property' }}
          </button>

          <button
            v-if="canBuyHouseForCurrentProperty"
            type="button"
            @click="handleBuyHouse"
            :disabled="buyingHouse"
            class="px-10 py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full font-headline font-bold hover:shadow-xl transition-colors scale-95 active:scale-90 duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {{ buyingHouse ? 'Buying House...' : `Buy House (${currentProperty?.house_cost ?? 0} Cr)` }}
          </button>

          <button
            v-if="canBuyHotelForCurrentProperty"
            type="button"
            @click="handleBuyHotel"
            :disabled="buyingHotel"
            class="px-10 py-5 bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 text-white rounded-full font-headline font-bold hover:shadow-xl transition-colors scale-95 active:scale-90 duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {{ buyingHotel ? 'Buying Hotel...' : `Buy Hotel (${currentProperty?.hotel_cost ?? 0} Cr)` }}
          </button>

          <button
            v-if="canPayRentForCurrentProperty"
            type="button"
            @click="handlePayRent"
            :disabled="payingRent"
            class="px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-headline font-bold hover:shadow-xl transition-colors scale-95 active:scale-90 duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {{ payingRent ? 'Paying...' : `Pay Rent (${currentRentAmount} Cr)` }}
          </button>

          <button
            type="button"
            class="px-10 py-5 bg-surface-container-highest text-on-surface rounded-full font-headline font-bold hover:bg-surface-container-high transition-colors scale-95 active:scale-90 duration-200"
          >
            Trade Proposal
          </button>

          <button
            type="button"
            @click="handleEndTurn"
            :disabled="endingTurn"
            class="px-12 py-5 bg-gradient-to-r from-secondary to-secondary-dim text-white rounded-full font-headline font-extrabold text-xl shadow-xl shadow-secondary/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {{ endingTurn ? 'Ending Turn...' : 'End Turn' }}
          </button>

          <button
            v-if="isCurrentUserHost"
            type="button"
            @click="handleEndGame"
            :disabled="endingGame"
            class="px-12 py-5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-headline font-extrabold text-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {{ endingGame ? 'Ending Game...' : 'End Game' }}
          </button>
        </div>
      </div>
    </main>

    <!-- BottomNavBar -->
    <nav
      class="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 h-20 bg-white/90 backdrop-blur-md shadow-[0_-10px_30px_rgba(0,0,0,0.04)]"
    >
      <div class="flex flex-col items-center justify-center text-slate-400 hover:text-blue-500 transition-all active:scale-90 duration-200">
        <span class="material-symbols-outlined">directions_run</span>
        <span class="font-['Space_Grotesk'] text-[10px] uppercase tracking-widest">Move</span>
      </div>

      <div class="flex flex-col items-center justify-center text-slate-400 hover:text-blue-500 transition-all active:scale-90 duration-200">
        <span class="material-symbols-outlined">style</span>
        <span class="font-['Space_Grotesk'] text-[10px] uppercase tracking-widest">Cards</span>
      </div>

      <div class="flex flex-col items-center justify-center bg-blue-600 text-white rounded-full w-14 h-14 -mt-10 shadow-lg shadow-blue-500/40 active:scale-90 duration-200">
        <span class="material-symbols-outlined">auto_awesome</span>
        <span class="font-['Space_Grotesk'] text-[8px] uppercase tracking-widest">Roll</span>
      </div>

      <div class="flex flex-col items-center justify-center text-slate-400 hover:text-blue-500 transition-all active:scale-90 duration-200">
        <span class="material-symbols-outlined">account_circle</span>
        <span class="font-['Space_Grotesk'] text-[10px] uppercase tracking-widest">Profile</span>
      </div>
    </nav>
        <div
      v-if="difficultyModalOpen && activeTile"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
    >
      <div class="w-full max-w-xl rounded-[2rem] bg-white p-8 shadow-2xl">
        <div class="flex items-start justify-between gap-4 mb-6">
          <div>
            <p class="text-sm font-bold text-primary uppercase tracking-widest">
              {{ activeTile.tile_name }}
            </p>
            <h2 class="text-2xl font-headline font-bold text-slate-900 mt-2">
              Choose Difficulty
            </h2>
            <p class="text-sm text-slate-500 mt-2">
              Select the challenge level for this tile.
            </p>
          </div>

          <button
            type="button"
            @click="difficultyModalOpen = false"
            class="text-slate-500 hover:text-slate-900"
          >
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div class="space-y-3">
          <label
            v-for="difficulty in availableDifficulties"
            :key="difficulty"
            class="flex items-center gap-3 p-4 rounded-xl border cursor-pointer"
          >
            <input
              v-model="selectedDifficulty"
              type="radio"
              :value="difficulty"
            />
            <span class="capitalize font-medium">{{ difficulty }}</span>
          </label>
        </div>

        <div class="mt-6 flex justify-end">
          <button
            type="button"
            @click="handleChooseDifficulty"
            :disabled="scanningTile || !selectedDifficulty"
            class="px-6 py-3 rounded-full bg-primary text-white font-bold disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {{ scanningTile ? 'Loading...' : 'Continue' }}
          </button>
        </div>
      </div>
    </div>

        <div
      v-if="questionModalOpen && activeQuestion"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
    >
      <div class="w-full max-w-2xl rounded-[2rem] bg-white p-8 shadow-2xl">
        <div class="flex items-start justify-between gap-4 mb-6">
          <div>
            <p class="text-sm font-bold text-primary uppercase tracking-widest">
              {{ activeTile?.tile_name || 'Question Tile' }}
            </p>
            <h2 class="text-2xl font-headline font-bold text-slate-900 mt-2">
              {{ activeQuestion.question_text }}
            </h2>
          </div>

          <button
            type="button"
            @click="closeQuestionModal"
            class="text-slate-500 hover:text-slate-900"
          >
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div class="space-y-3">
          <label class="flex items-center gap-3 p-4 rounded-xl border cursor-pointer">
            <input v-model="selectedAnswer" type="radio" value="A" />
            <span><strong>A.</strong> {{ activeQuestion.option_a }}</span>
          </label>

          <label class="flex items-center gap-3 p-4 rounded-xl border cursor-pointer">
            <input v-model="selectedAnswer" type="radio" value="B" />
            <span><strong>B.</strong> {{ activeQuestion.option_b }}</span>
          </label>

          <label class="flex items-center gap-3 p-4 rounded-xl border cursor-pointer">
            <input v-model="selectedAnswer" type="radio" value="C" />
            <span><strong>C.</strong> {{ activeQuestion.option_c }}</span>
          </label>

          <label class="flex items-center gap-3 p-4 rounded-xl border cursor-pointer">
            <input v-model="selectedAnswer" type="radio" value="D" />
            <span><strong>D.</strong> {{ activeQuestion.option_d }}</span>
          </label>
        </div>

        <div class="mt-6 flex items-center justify-between">
          <div class="text-sm text-slate-500">
            Reward: <span class="font-bold text-tertiary">{{ activeQuestion.credits }} Cr</span>
          </div>

          <button
            type="button"
            @click="handleSubmitAnswer"
            :disabled="submittingAnswer || !selectedAnswer"
            class="px-6 py-3 rounded-full bg-primary text-white font-bold disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {{ submittingAnswer ? 'Submitting...' : 'Submit Answer' }}
          </button>
        </div>

        <div v-if="answerResult" class="mt-6 rounded-2xl p-4 border">
          <p class="font-bold" :class="answerResult.is_correct ? 'text-green-600' : 'text-red-600'">
            {{ answerResult.is_correct ? 'Correct answer submitted!' : 'Answer submitted.' }}
          </p>
          <p class="text-sm text-slate-600 mt-2">
            Earned credits: {{ answerResult.earned_credits }}
          </p>
          <p class="text-sm text-slate-600">
            Current credits: {{ answerResult.current_credits }}
          </p>
        </div>
      </div>
    </div>

    <div class="fixed inset-0 pointer-events-none -z-10 opacity-30">
      <div class="absolute top-1/4 right-[-5%] w-[400px] h-[400px] bg-primary/10 blur-[100px] rounded-full"></div>
      <div class="absolute bottom-[-10%] left-[10%] w-[500px] h-[500px] bg-secondary/10 blur-[120px] rounded-full"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import Navbar from '@/components/NavBar.vue'
import api from '@/services/api'
import echo from '@/lib/echo'
import { useAuthStore } from '@/stores/auth'

type LeaderboardPlayer = {
  rank: number
  user_id: number
  user_name: string
  credits: number
  total_credits: number
  position?: number
}

type LeaderboardResponse = {
  game_id: number
  game_code: string
  status: string
  leaderboard: LeaderboardPlayer[]
}

type GameShowResponse = {
  game: {
    id: number
    host_id: number
    game_code?: string
    status: string
  }
}

type CurrentTurnResponse = {
  game_id?: number
  status?: string
  turn_number?: number
  last_dice_roll?: number | null
  current_turn_user_id?: number | null
  current_turn_user_name?: string | null
}

type RollDiceResponse = {
  message?: string
  dice_one?: number
  dice_two?: number
  total?: number
  roll_total?: number
  dice_total?: number
  last_dice_roll?: number
  current_position?: number
  tile_name?: string
  current_tile?: string
}

type RankedPlayer = {
  id: number
  name: string
  credits: number
  totalCredits: number
  position: number | null
  rank: number
  isCurrentTurn: boolean
  isDimmed: boolean
  rankColor: string
  progressColor: string
  progressWidth: number
}

type EndTurnResponse = {
  message?: string
  turn_number?: number
  current_turn_user_id?: number | null
  current_turn_user_name?: string | null
  status?: string
}

type EndGameResponse = {
  message?: string
  game?: {
    id: number
    game_code?: string
    status?: string
    ended_at?: string | null
  }
}

type TurnChangedEvent = {
  game_id: number
  turn_number: number
  current_turn_user_id: number | null
  current_turn_user_name: string | null
}

type DiceRolledEvent = {
  game_id: number
  user_id: number
  user_name: string
  dice_value: number
  new_position: number
}

type LeaderboardUpdatedEvent = {
  game_id: number
  leaderboard: LeaderboardPlayer[]
}

type GameEndedEvent = {
  game_id: number
  status: string
}

type ScanTileResponse = {
  message: string
  tile: {
    id: number
    tile_number: number
    tile_name: string
    nfc_value: string
    tile_type: string
    difficulty: string
  }
  available_difficulties: string[]
}

type QuestionData = {
  id: number
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  credits: number
  difficulty: string
}

type GetQuestionResponse = {
  message: string
  tile: {
    id: number
    tile_number: number
    tile_name: string
    nfc_value: string
    tile_type: string
    difficulty: string
  }
  question: QuestionData
}

type SubmitAnswerResponse = {
  message: string
  is_correct: boolean
  earned_credits: number
  current_credits: number
  total_credits: number
}

type GameProperty = {
  game_property_id: number
  property_id: number
  tile_id: number
  tile_number: number
  tile_name: string
  property_name: string
  color_group: string
  cost: number
  house_cost: number
  hotel_cost: number
  rent: number
  rent_1_house: number
  rent_2_houses: number
  rent_3_houses: number
  rent_4_houses: number
  rent_hotel: number
  owner_user_id: number | null
  owner_name: string | null
  houses: number
  hotel: boolean
}

type GamePropertiesResponse = {
  game_id: number
  status: string
  properties: GameProperty[]
}

type BuyPropertyResponse = {
  message: string
  property: {
    game_property_id: number | string | null
    property_name: string
    owner_user_id: number
    owner_name: string | null
    remaining_credits: number
  }
}

type PayRentResponse = {
  message: string
  rent_paid: number
  payer_credits: number
  owner_credits: number
}

type BuyHouseResponse = {
  message: string
  property_id: number
  houses: number
  has_hotel: boolean
  remaining_credits: number
  total_credits: number
}

type BuyHotelResponse = {
  message: string
  property_id: number
  houses: number
  has_hotel: boolean
  remaining_credits: number
  total_credits: number
}

const endingGame = ref(false)

const route = useRoute()
const router = useRouter()
const gameId = Number(route.params.id)

const loadingLeaderboard = ref(false)
const loadingTurn = ref(false)
const rollingDice = ref(false)

let gameChannel: ReturnType<typeof echo.private> | null = null

const gameName = ref(`Game #${gameId}`)
const currentTurnText = ref('Waiting...')
const currentTurnName = ref<string | null>(null)
const currentTurnUserId = ref<number | null>(null)
const turnNumber = ref<number | null>(null)
const elapsedTime = ref('Live session')
const gameCode = ref('')
const gameStatus = ref('')
const hostId = ref<number | null>(null)
const currentPosition = ref<number | null>(null)
const currentTile = ref('')
const lastDiceRoll = ref<number | null>(null)

const diceOne = ref<number | null>(null)
const diceTwo = ref<number | null>(null)
const endingTurn = ref(false)

const executionCost = ref('—')
const runtimeYield = ref('—')
const tileDescription = ref('Tile details will appear once the related backend endpoint is connected.')

const rankedPlayers = ref<RankedPlayer[]>([])
const authStore = useAuthStore()
const hasRolledThisTurn = ref(false)

const loadingProperties = ref(false)
const gameProperties = ref<GameProperty[]>([])
const buyingProperty = ref(false)
const payingRent = ref(false)
const buyingHouse = ref(false)
const buyingHotel = ref(false)
const rentPaidThisTurn = ref(false)
const houseBoughtThisTurn = ref(false)

const scanningTile = ref(false)
const qrInputValue = ref('')
const questionModalOpen = ref(false)
const activeTile = ref<ScanTileResponse['tile'] | null>(null)
const activeQuestion = ref<QuestionData | null>(null)
const selectedAnswer = ref('')
const submittingAnswer = ref(false)
const answerResult = ref<SubmitAnswerResponse | null>(null)
const difficultyModalOpen = ref(false)
const availableDifficulties = ref<string[]>([])
const selectedDifficulty = ref('')

const isCurrentUserTurn = computed(() => {
  return currentTurnUserId.value !== null && currentTurnUserId.value === authStore.user?.id
})

const isCurrentUserHost = computed(() => {
  return hostId.value !== null && hostId.value === authStore.user?.id
})

const currentProperty = computed(() => {
  if (currentPosition.value === null) return null

  return (
    gameProperties.value.find(
      (property) => property.tile_number === currentPosition.value
    ) || null
  )
})

const resolvedCurrentTile = computed(() => {
  if (currentProperty.value) return currentProperty.value.tile_name
  return currentTile.value || ''
})

const canBuyCurrentProperty = computed(() => {
  return (
    !!currentProperty.value &&
    isCurrentUserTurn.value &&
    currentProperty.value.owner_user_id === null
  )
})

const canPayRentForCurrentProperty = computed(() => {
  return (
    !!currentProperty.value &&
    isCurrentUserTurn.value &&
    !rentPaidThisTurn.value &&
    currentProperty.value.owner_user_id !== null &&
    currentProperty.value.owner_user_id !== authStore.user?.id
  )
})

const canBuyHouseForCurrentProperty = computed(() => {
  return (
    !!currentProperty.value &&
    isCurrentUserTurn.value &&
    !houseBoughtThisTurn.value &&
    currentProperty.value.owner_user_id === authStore.user?.id &&
    !currentProperty.value.hotel &&
    currentProperty.value.houses < 4
  )
})

const canBuyHotelForCurrentProperty = computed(() => {
  return (
    !!currentProperty.value &&
    isCurrentUserTurn.value &&
    currentProperty.value.owner_user_id === authStore.user?.id &&
    !currentProperty.value.hotel &&
    currentProperty.value.houses === 4
  )
})

const currentPositionLabel = computed(() => {
  return currentPosition.value !== null ? `Index [${currentPosition.value}]` : '—'
})

const diceOneDisplay = computed(() => (diceOne.value !== null ? diceOne.value : '—'))
const diceTwoDisplay = computed(() => (diceTwo.value !== null ? diceTwo.value : '—'))

const diceTotalDisplay = computed(() => {
  if (diceOne.value !== null && diceTwo.value !== null) {
    return diceOne.value + diceTwo.value
  }
  if (lastDiceRoll.value !== null) {
    return lastDiceRoll.value
  }
  return '—'
})

const currentRentAmount = computed(() => {
  if (!currentProperty.value) return 0

  if (currentProperty.value.hotel) return currentProperty.value.rent_hotel
  if (currentProperty.value.houses === 4) return currentProperty.value.rent_4_houses
  if (currentProperty.value.houses === 3) return currentProperty.value.rent_3_houses
  if (currentProperty.value.houses === 2) return currentProperty.value.rent_2_houses
  if (currentProperty.value.houses === 1) return currentProperty.value.rent_1_house

  return currentProperty.value.rent
})

const refreshBoard = async () => {
  await fetchGame()
  await fetchCurrentTurn()
  await fetchProperties()
  await fetchLeaderboard()
}

const fetchProperties = async () => {
  loadingProperties.value = true
  try {
    const response = await api.get<GamePropertiesResponse>(`/api/games/${gameId}/properties`)
    gameProperties.value = response.data.properties || []
  } finally {
    loadingProperties.value = false
  }
}

const fetchGame = async () => {
  const response = await api.get<GameShowResponse>(`/api/games/${gameId}`)
  const foundGame = response.data.game

  hostId.value = foundGame.host_id
  gameCode.value = foundGame.game_code || gameCode.value
  gameStatus.value = foundGame.status || gameStatus.value
  gameName.value = `Game #${foundGame.id}`
}

const applyLeaderboard = (leaderboard: LeaderboardPlayer[]) => {
  const maxCredits =
    leaderboard.length > 0
      ? Math.max(...leaderboard.map((player) => player.total_credits || 0), 1)
      : 1

  rankedPlayers.value = leaderboard.map((player, index) => {
    const progressWidth = Math.max(
      10,
      Math.round(((player.total_credits || 0) / maxCredits) * 100)
    )

    const isCurrentTurn = player.user_id === currentTurnUserId.value

    return {
      id: player.user_id,
      name: player.user_name,
      credits: player.credits,
      totalCredits: player.total_credits,
      position: typeof player.position === 'number' ? player.position : null,
      rank: index + 1,
      isCurrentTurn,
      isDimmed: !isCurrentTurn && index > 2,
      rankColor:
        index === 0 ? 'text-yellow-500' :
        index === 1 ? 'text-slate-400' :
        index === 2 ? 'text-amber-700' :
        isCurrentTurn ? 'text-primary' :
        'text-slate-600',
      progressColor:
        index === 0 ? 'bg-yellow-400' :
        index === 1 ? 'bg-slate-400' :
        index === 2 ? 'bg-amber-600' :
        isCurrentTurn ? 'bg-primary' :
        'bg-slate-400',
      progressWidth,
    }
  })
}

const fetchCurrentTurn = async () => {
  loadingTurn.value = true
  try {
    const response = await api.get<CurrentTurnResponse>(`/api/games/${gameId}/turn`)
    const data = response.data

    turnNumber.value = data.turn_number ?? null
    lastDiceRoll.value = data.last_dice_roll ?? null
    currentTurnUserId.value = data.current_turn_user_id ?? null
    currentTurnName.value = data.current_turn_user_name ?? null
    currentTurnText.value = data.current_turn_user_name || 'Waiting...'
    gameStatus.value = data.status || ''

    hasRolledThisTurn.value = data.last_dice_roll !== null
  } finally {
    loadingTurn.value = false
  }
}

const fetchLeaderboard = async () => {
  loadingLeaderboard.value = true
  try {
    const response = await api.get<LeaderboardResponse>(`/api/games/${gameId}/leaderboard`)
    const data = response.data

    gameCode.value = data.game_code || ''
    gameStatus.value = data.status || gameStatus.value
    gameName.value = `Game #${data.game_id}`

    applyLeaderboard(data.leaderboard)

    const currentPlayer = data.leaderboard.find(
      (player) => player.user_id === authStore.user?.id
    )

    if (currentPlayer && typeof currentPlayer.position === 'number') {
      currentPosition.value = currentPlayer.position

      const matchedProperty = gameProperties.value.find(
        (property) => property.tile_number === currentPlayer.position
      )

      if (matchedProperty) {
        currentTile.value = matchedProperty.tile_name
      }
    }
  } finally {
    loadingLeaderboard.value = false
  }
}

const handleRollDice = async () => {
  try {
    rollingDice.value = true

    const response = await api.post<RollDiceResponse>(`/api/games/${gameId}/roll-dice`)
    const data = response.data

    if (typeof data.dice_one === 'number') diceOne.value = data.dice_one
    if (typeof data.dice_two === 'number') diceTwo.value = data.dice_two

    if (
      diceOne.value === null &&
      diceTwo.value === null &&
      typeof data.last_dice_roll === 'number'
    ) {
      lastDiceRoll.value = data.last_dice_roll
    }

    if (typeof data.current_position === 'number') currentPosition.value = data.current_position
    if (typeof data.tile_name === 'string') currentTile.value = data.tile_name
    if (typeof data.current_tile === 'string') currentTile.value = data.current_tile

    console.log('currentPosition', currentPosition.value)
    console.log('currentTile', currentTile.value)
    console.log('gameProperties', gameProperties.value)
    console.log('currentProperty', currentProperty.value)

    hasRolledThisTurn.value = true
    rentPaidThisTurn.value = false
    houseBoughtThisTurn.value = false

  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data?.message || 'Failed to roll dice.')
    } else {
      console.error('Failed to roll dice.')
    }
  } finally {
    rollingDice.value = false
  }
}

const handleScanTile = async () => {
  if (!qrInputValue.value.trim()) {
    console.error('Please enter a QR value.')
    return
  }

  try {
    scanningTile.value = true
    answerResult.value = null
    selectedAnswer.value = ''

    const response = await api.post<ScanTileResponse>(`/api/games/${gameId}/scan-tile`, {
      nfc_value: qrInputValue.value.trim(),
    })

    activeTile.value = response.data.tile
    availableDifficulties.value = response.data.available_difficulties
    selectedDifficulty.value = ''
    answerResult.value = null
    questionModalOpen.value = false
    difficultyModalOpen.value = true

    currentTile.value = response.data.tile.tile_name
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data?.message || 'Failed to scan tile.')
    } else {
      console.error('Failed to scan tile.')
    }
  } finally {
    scanningTile.value = false
  }
}

const handleChooseDifficulty = async () => {
  if (!activeTile.value || !selectedDifficulty.value) {
    console.error('Please choose a difficulty.')
    return
  }

  try {
    scanningTile.value = true

    const response = await api.post<GetQuestionResponse>(
      `/api/games/${gameId}/tiles/${activeTile.value.id}/question`,
      {
        difficulty: selectedDifficulty.value,
      }
    )

    activeQuestion.value = response.data.question
    executionCost.value = `${response.data.question.credits} Cr`
    runtimeYield.value = response.data.question.difficulty
    tileDescription.value = response.data.question.question_text

    difficultyModalOpen.value = false
    questionModalOpen.value = true
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data?.message || 'Failed to get question.')
    } else {
      console.error('Failed to get question.')
    }
  } finally {
    scanningTile.value = false
  }
}

const handleSubmitAnswer = async () => {
  if (!activeQuestion.value) {
    console.error('No active question found.')
    return
  }

  if (!selectedAnswer.value) {
    console.error('Please select an answer.')
    return
  }

  try {
    submittingAnswer.value = true

    const response = await api.post<SubmitAnswerResponse>(
      `/api/games/${gameId}/questions/${activeQuestion.value.id}/submit`,
      {
        selected_answer: selectedAnswer.value,
      }
    )

    answerResult.value = response.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data?.message || 'Failed to submit answer.')
    } else {
      console.error('Failed to submit answer.')
    }
  } finally {
    submittingAnswer.value = false
  }
}

const closeQuestionModal = () => {
  questionModalOpen.value = false
  difficultyModalOpen.value = false
  activeTile.value = null
  activeQuestion.value = null
  selectedAnswer.value = ''
  selectedDifficulty.value = ''
  availableDifficulties.value = []
  answerResult.value = null
  qrInputValue.value = ''
}

const handleBuyProperty = async () => {
  if (!currentProperty.value) {
    console.error('No property available on this tile.')
    return
  }

  try {
    buyingProperty.value = true

    await api.post<BuyPropertyResponse>(`/api/properties/buy`, {
      game_id: gameId,
      property_id: currentProperty.value.property_id,
    })

    await fetchProperties()
    await fetchLeaderboard()
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data?.message || 'Failed to buy property.')
    } else {
      console.error('Failed to buy property.')
    }
  } finally {
    buyingProperty.value = false
  }
}

const handlePayRent = async () => {
  if (!currentProperty.value) {
    console.error('No property available on this tile.')
    return
  }

  try {
    payingRent.value = true

    await api.post<PayRentResponse>(`/api/properties/pay-rent`, {
      game_id: gameId,
      property_id: currentProperty.value.property_id,
    })

    rentPaidThisTurn.value = true

    await fetchProperties()
    await fetchLeaderboard()
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data?.message || 'Failed to pay rent.')
    } else {
      console.error('Failed to pay rent.')
    }
  } finally {
    payingRent.value = false
  }
}

const handleBuyHouse = async () => {
  if (!currentProperty.value) {
    console.error('No property available on this tile.')
    return
  }

  try {
    buyingHouse.value = true

    await api.post<BuyHouseResponse>(`/api/properties/buy-house`, {
      game_id: gameId,
      property_id: currentProperty.value.property_id,
    })

    houseBoughtThisTurn.value = true

    await fetchProperties()
    await fetchLeaderboard()
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data?.message || 'Failed to buy house.')
    } else {
      console.error('Failed to buy house.')
    }
  } finally {
    buyingHouse.value = false
  }
}

const handleBuyHotel = async () => {
  if (!currentProperty.value) {
    console.error('No property available on this tile.')
    return
  }

  try {
    buyingHotel.value = true

    await api.post<BuyHotelResponse>(`/api/properties/buy-hotel`, {
      game_id: gameId,
      property_id: currentProperty.value.property_id,
    })

    await fetchProperties()
    await fetchLeaderboard()
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data?.message || 'Failed to buy hotel.')
    } else {
      console.error('Failed to buy hotel.')
    }
  } finally {
    buyingHotel.value = false
  }
}

const handleEndGame = async () => {
  try {
    endingGame.value = true

    await api.post(`/api/games/${gameId}/end-game`)
    router.push(`/games/${gameId}/final-leaderboard`)
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data?.message || 'Failed to end game.')
    } else {
      console.error('Failed to end game.')
    }
  } finally {
    endingGame.value = false
  }
}

const handleEndTurn = async () => {
  try {
    endingTurn.value = true

    await api.post<EndTurnResponse>(`/api/games/${gameId}/end-turn`)

    diceOne.value = null
    diceTwo.value = null
    lastDiceRoll.value = null
    hasRolledThisTurn.value = false

  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data?.message || 'Failed to end turn.')
    } else {
      console.error('Failed to end turn.')
    }
  } finally {
    endingTurn.value = false
  }
}

onMounted(async () => {
  try {
    await refreshBoard()

    gameChannel = echo.private(`game.${gameId}`)

    gameChannel.listen('.turn.changed', (event: TurnChangedEvent) => {
      rentPaidThisTurn.value = false
      turnNumber.value = event.turn_number
      currentTurnUserId.value = event.current_turn_user_id
      currentTurnName.value = event.current_turn_user_name
      currentTurnText.value = event.current_turn_user_name || 'Waiting...'
      gameStatus.value = 'started'

      diceOne.value = null
      diceTwo.value = null
      lastDiceRoll.value = null
      hasRolledThisTurn.value = false
      rentPaidThisTurn.value = false
      houseBoughtThisTurn.value = false

      rankedPlayers.value = rankedPlayers.value.map((player, index) => {
        const isCurrentTurn = player.id === event.current_turn_user_id

        return {
          ...player,
          isCurrentTurn,
          isDimmed: !isCurrentTurn && index > 2,
          rankColor:
            index === 0 ? 'text-yellow-500' :
            index === 1 ? 'text-slate-400' :
            index === 2 ? 'text-amber-700' :
            isCurrentTurn ? 'text-primary' :
            'text-slate-600',
          progressColor:
            index === 0 ? 'bg-yellow-400' :
            index === 1 ? 'bg-slate-400' :
            index === 2 ? 'bg-amber-600' :
            isCurrentTurn ? 'bg-primary' :
            'bg-slate-400',
        }
      })
    })

    gameChannel.listen('.dice.rolled', (event: DiceRolledEvent) => {
      lastDiceRoll.value = event.dice_value
      currentPosition.value = event.new_position

      diceOne.value = null
      diceTwo.value = null

      if (currentTurnUserId.value === authStore.user?.id) {
        hasRolledThisTurn.value = true
      }
    })

    gameChannel.listen('.leaderboard.updated', (event: LeaderboardUpdatedEvent) => {
      applyLeaderboard(event.leaderboard)

      const currentPlayer = event.leaderboard.find(
        (player) => player.user_id === authStore.user?.id
      )

      if (currentPlayer && typeof currentPlayer.position === 'number') {
        currentPosition.value = currentPlayer.position
      }
    })

    gameChannel.listen('.game.ended', (event: GameEndedEvent) => {
      gameStatus.value = event.status
      router.push(`/games/${gameId}/final-leaderboard`)
    })
  } catch (error) {
    console.error('Failed to load game board data:', error)
  }
})

onUnmounted(() => {
  if (gameChannel) {
    echo.leave(`private-game.${gameId}`)
    gameChannel = null
  }
})
</script>

<style scoped>
.dice-shadow {
  box-shadow: 0 12px 40px rgba(42, 51, 60, 0.06);
}
</style>