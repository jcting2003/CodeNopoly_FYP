import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import api from '../../src/services/api'

type LeaderboardPlayer = {
  rank: number
  user_id: number
  user_name: string
  email: string | null
  credits: number
  total_credits: number
  position?: number | null
}

type LeaderboardResponse = {
  game_id: number
  game_code: string
  status: string
  leaderboard: LeaderboardPlayer[]
}

export default function FinalLeaderboardScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const gameId = Number(id)

  const [loading, setLoading] = useState(true)
  const [gameCode, setGameCode] = useState('')
  const [gameStatus, setGameStatus] = useState('')
  const [leaderboard, setLeaderboard] = useState<LeaderboardPlayer[]>([])

  const getInitials = (name?: string | null) => {
    if (!name) return '--'

    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || '')
      .join('')
  }

  const fetchFinalLeaderboard = async () => {
    if (!gameId || Number.isNaN(gameId)) {
      Alert.alert('Invalid Game', 'Game ID is invalid.')
      router.replace('/dashboard')
      return
    }

    try {
      setLoading(true)

      const response = await api.get<LeaderboardResponse>(
        `/games/${gameId}/leaderboard`
      )

      setGameCode(response.data.game_code || '')
      setGameStatus(response.data.status || '')
      setLeaderboard(response.data.leaderboard || [])
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Failed to load final leaderboard.'

      Alert.alert('Leaderboard Error', message)
      router.replace('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFinalLeaderboard()
  }, [gameId])

  const winner = leaderboard[0]

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-sm font-bold text-on-surface-variant">
          Loading final results...
        </Text>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-surface">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingTop: 48,
          paddingBottom: 176,
        }}
      >
        <View className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-primary-container opacity-20" />
        <View className="absolute top-80 -right-32 h-80 w-80 rounded-full bg-secondary-container opacity-30" />
        <View className="absolute bottom-16 left-10 h-56 w-56 rounded-full bg-tertiary-container opacity-20" />

        {/* Header */}
        <View className="mb-10 items-center">
          <View className="mb-4 flex-row items-center gap-2 rounded-full bg-tertiary-container/40 px-4 py-2">
            <Text className="text-lg">🎉</Text>
            <Text className="text-sm font-black text-on-tertiary-container">
              Session Complete
            </Text>
          </View>

          <Text className="text-center text-5xl font-black tracking-tighter text-primary">
            Final Leaderboard
          </Text>

          <Text className="mt-4 text-center text-base font-semibold leading-6 text-on-surface-variant">
            Final ranking and results for this Pythonopoly session.
          </Text>
        </View>

        {/* Session Identity */}
        <View className="mb-8 items-center rounded-2xl bg-surface-container-low px-8 py-6 shadow-sm">
          <Text className="text-[11px] font-black uppercase tracking-[3px] text-on-surface-variant">
            Session Identity
          </Text>

          <Text className="mt-2 text-2xl font-black tracking-widest text-primary">
            {gameCode || '------'}
          </Text>

          <View className="mt-3 flex-row items-center gap-2 rounded-lg bg-surface-container-highest px-3 py-1">
            <Text className="text-sm text-primary">⚑</Text>
            <Text className="text-sm font-black capitalize text-on-surface">
              {gameStatus || 'ended'}
            </Text>
          </View>
        </View>

        {/* Rankings Card */}
        <View className="rounded-[2.5rem] border border-surface-container bg-surface-container-lowest p-6 shadow-lg">
          <View className="mb-10 items-center gap-5">
            <View className="h-14 w-14 items-center justify-center rounded-2xl bg-primary">
              <Text className="text-2xl text-on-primary">▥</Text>
            </View>

            <Text className="text-center text-3xl font-black tracking-tight text-on-surface">
              Session Rankings
            </Text>

            <View className="flex-row gap-3">
              <View className="rounded-full bg-surface-container-high px-5 py-2">
                <Text className="text-sm font-black text-on-surface-variant">
                  {leaderboard.length} Players
                </Text>
              </View>

              <View className="rounded-full bg-primary-container/30 px-5 py-2">
                <Text className="text-sm font-black text-on-primary-container">
                  Game Ended
                </Text>
              </View>
            </View>
          </View>

          <View className="gap-4">
            {leaderboard.map((player, index) => {
              const isWinner = index === 0

              return (
                <View
                  key={player.user_id}
                  className={`rounded-3xl p-5 ${
                    isWinner
                      ? 'bg-yellow-50'
                      : 'bg-white'
                  }`}
                >
                  <View className="flex-row items-center gap-4">
                    <View
                      className={`h-12 w-12 items-center justify-center rounded-full ${
                        index === 0
                          ? 'bg-yellow-400'
                          : index === 1
                            ? 'bg-slate-300'
                            : index === 2
                              ? 'bg-orange-200'
                              : 'bg-surface-container-highest'
                      }`}
                    >
                      <Text className="text-xl font-black text-on-surface">
                        {index + 1}
                      </Text>
                    </View>

                    <View className="h-14 w-14 items-center justify-center rounded-2xl bg-surface-container">
                      <Text className="font-black text-on-surface">
                        {getInitials(player.user_name)}
                      </Text>
                    </View>

                    <View className="flex-1">
                      <Text className="text-lg font-black text-on-surface">
                        {player.user_name}
                      </Text>

                      {isWinner && (
                        <Text className="mt-1 text-xs font-bold text-yellow-700">
                          Winner
                        </Text>
                      )}
                    </View>
                  </View>

                  <View className="mt-5 rounded-2xl bg-surface-container-low p-4">
                    <View className="mb-3 flex-row justify-between">
                      <Text className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
                        Current Credits
                      </Text>
                      <Text className="font-mono font-black text-on-surface">
                        {player.credits}
                      </Text>
                    </View>

                    <View className="mb-3 flex-row justify-between">
                      <Text className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
                        Total Credits
                      </Text>
                      <Text className="font-mono font-black text-primary">
                        {player.total_credits}
                      </Text>
                    </View>

                    <View className="flex-row justify-between">
                      <Text className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
                        Board Position
                      </Text>
                      <Text className="font-bold text-on-surface-variant">
                        {player.position ?? '—'}
                      </Text>
                    </View>
                  </View>
                </View>
              )
            })}

            {leaderboard.length === 0 && (
              <View className="rounded-3xl bg-surface-container-low p-8">
                <Text className="text-center font-bold text-on-surface-variant">
                  No final results found.
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View className="absolute bottom-0 left-0 right-0 border-t border-outline-variant/10 bg-surface/95 px-6 py-5 shadow-lg">
        <View className="mb-5 flex-row items-center gap-4">
          <View className="h-14 w-14 items-center justify-center rounded-2xl bg-secondary-container">
            <Text className="text-3xl">🏅</Text>
          </View>

          <View className="flex-1">
            <Text className="text-lg font-black leading-tight text-on-surface">
              Winner: {winner?.user_name || '—'}
            </Text>
            <Text className="text-sm text-on-surface-variant">
              Top total credits: {winner?.total_credits ?? '—'}
            </Text>
          </View>
        </View>

        <View className="flex-row gap-3">
          <Pressable
            onPress={() => router.replace('/dashboard')}
            className="flex-1 items-center justify-center rounded-2xl border-2 border-surface-container-highest bg-white px-4 py-4 active:scale-[0.98]"
          >
            <Text className="text-center text-sm font-black text-on-surface-variant">
              Dashboard
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.replace('/join-game')}
            className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-4 shadow-lg active:scale-[0.98]"
          >
            <Text className="text-xl text-on-primary">↻</Text>
            <Text className="text-center text-sm font-black text-on-primary">
              Join New Game
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}
