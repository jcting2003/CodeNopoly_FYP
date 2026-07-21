import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native'
import { router } from 'expo-router'
import api from '../src/services/api'
import { useAuth } from '../src/context/AuthContext'
import { popup } from '../src/services/popup'

type MyGame = {
  id: number
  game_code: string
  status: string
  host_id: number
  host_name: string | null
  is_host: boolean
  credits: number
  total_credits: number
  position: number | null
  started_at: string | null
  ended_at: string | null
  created_at: string
}

type MyGamesResponse = {
  games: MyGame[]
}

const getStatusLabel = (status: string) => {
  if (status === 'waiting') return 'Waiting'
  if (status === 'started') return 'In Progress'
  if (status === 'ended') return 'Ended'
  return 'Unknown'
}

const getStatusClassName = (status: string) => {
  if (status === 'waiting') return 'bg-yellow-100 text-yellow-700'
  if (status === 'started') return 'bg-green-100 text-green-700'
  if (status === 'ended') return 'bg-red-100 text-red-700'
  return 'bg-slate-100 text-slate-600'
}

const getActionLabel = (status: string) => {
  if (status === 'waiting') return 'Go to Lobby'
  if (status === 'started') return 'Continue Game'
  if (status === 'ended') return 'View Results'
  return 'Open'
}

const formatDate = (value: string | null) => {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '—'

  return date.toLocaleDateString('en-MY', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function DashboardScreen() {
  const { user, logout } = useAuth()
  const [recentGames, setRecentGames] = useState<MyGame[]>([])
  const [loadingRecentGames, setLoadingRecentGames] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      router.replace('/login')
    } catch {
      popup.alert('Logout Failed', 'Unable to logout. Please try again.')
    }
  }

  const handleOpenGame = (game: MyGame) => {
    if (game.status === 'waiting') {
      router.push({
        pathname: '/game-lobby/[id]',
        params: { id: String(game.id) },
      })
      return
    }

    if (game.status === 'started') {
      router.push({
        pathname: '/game-session/[id]',
        params: { id: String(game.id) },
      })
      return
    }

    if (game.status === 'ended') {
      router.push({
        pathname: '/final-leaderboard/[id]',
        params: { id: String(game.id) },
      })
    }
  }

  const fetchRecentGames = async () => {
    try {
      setLoadingRecentGames(true)
      const response = await api.get<MyGamesResponse>('/my-games')
      setRecentGames((response.data.games || []).slice(0, 3))
    } catch (error: any) {
      popup.alert(
        'Recent Games Failed',
        error.response?.data?.message || 'Failed to load your recent games.'
      )
    } finally {
      setLoadingRecentGames(false)
    }
  }

  useEffect(() => {
    fetchRecentGames()
  }, [])

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingVertical: 48,
      }}
    >
      <View className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-primary-container opacity-20" />
      <View className="absolute top-80 -right-32 h-80 w-80 rounded-full bg-secondary-container opacity-30" />
      <View className="absolute bottom-16 left-10 h-56 w-56 rounded-full bg-tertiary-container opacity-20" />

      <View className="mb-12 mt-8">
        <Text className="mb-3 text-xs font-black uppercase tracking-[3px] text-primary">
          System.Initialized()
        </Text>

        <Text className="text-5xl font-black leading-tight tracking-tighter text-on-surface">
          Welcome back,
        </Text>

        <Text className="mt-1 text-5xl font-black leading-tight tracking-tighter text-primary">
          {user?.name || 'Player'}!
        </Text>

        <Text className="mt-5 max-w-xl text-base leading-7 text-on-surface-variant">
          The compiler is ready and the board is set.
        </Text>
      </View>

      <View className="mb-10 gap-5">
        <Pressable
          onPress={() => router.push('/create-game')}
          className="overflow-hidden rounded-[28px] bg-surface-container-lowest shadow-lg active:scale-[0.98]"
        >
          <View className="h-2 w-full bg-primary" />
          <View className="p-7">
            <View className="mb-5 h-16 w-16 items-center justify-center rounded-2xl bg-primary-container">
              <Text className="text-4xl font-black text-primary">+</Text>
            </View>

            <Text className="text-3xl font-black text-on-surface">Create Game</Text>
            <Text className="mt-3 text-sm leading-6 text-on-surface-variant">
              Initialize a new logic board and invite fellow developers.
            </Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => router.push('/join-game')}
          className="overflow-hidden rounded-[28px] bg-surface-container-lowest shadow-lg active:scale-[0.98]"
        >
          <View className="h-2 w-full bg-secondary" />
          <View className="p-7">
            <View className="mb-5 h-16 w-16 items-center justify-center rounded-2xl bg-secondary-container">
              <Text className="text-4xl font-black text-secondary">⌘</Text>
            </View>

            <Text className="text-3xl font-black text-on-surface">Join Game</Text>
            <Text className="mt-3 text-sm leading-6 text-on-surface-variant">
              Connect to an active CodeNopoly session using a Room ID or game code provided by your host.
            </Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => router.push('/my-games')}
          className="overflow-hidden rounded-[28px] bg-surface-container-lowest shadow-lg active:scale-[0.98]"
        >
          <View className="h-2 w-full bg-tertiary" />
          <View className="p-7">
            <View className="mb-5 h-16 w-16 items-center justify-center rounded-2xl bg-tertiary-container">
              <Text className="text-3xl font-black text-tertiary">#</Text>
            </View>

            <Text className="text-3xl font-black text-on-surface">My Games</Text>
            <Text className="mt-3 text-sm leading-6 text-on-surface-variant">
              Review games you hosted or joined and jump back into active sessions.
            </Text>
          </View>
        </Pressable>
      </View>

      <View className="mb-8 rounded-[28px] bg-surface-container-lowest p-6 shadow-sm">
        <View className="mb-3 flex-row items-center justify-between">
          <View>
            <Text className="text-xs font-black uppercase tracking-[3px] text-primary">
              Recent Sessions
            </Text>
            <Text className="mt-2 text-2xl font-black text-on-surface">
              Your latest 3 games
            </Text>
          </View>

          <Pressable
            onPress={() => router.push('/my-games')}
            className="rounded-full border border-slate-300 px-4 py-2 active:scale-[0.98]"
          >
            <Text className="text-xs font-black text-on-surface">View All</Text>
          </Pressable>
        </View>

        {loadingRecentGames ? (
          <View className="py-8">
            <ActivityIndicator color="#1e63b8" />
            <Text className="mt-3 text-center text-sm text-on-surface-variant">
              Loading your recent games...
            </Text>
          </View>
        ) : recentGames.length === 0 ? (
          <View className="rounded-3xl bg-surface-container-low p-6">
            <Text className="text-lg font-black text-on-surface">No recent games yet</Text>
            <Text className="mt-2 text-sm leading-6 text-on-surface-variant">
              Create or join a game and your latest sessions will show up here.
            </Text>
          </View>
        ) : (
          <View className="gap-3">
            {recentGames.map((game) => (
              <Pressable
                key={game.id}
                onPress={() => handleOpenGame(game)}
                className="rounded-3xl bg-surface-container-low p-5 active:scale-[0.99]"
              >
                <View className="flex-row items-start justify-between gap-3">
                  <View className="flex-1">
                    <Text className="text-[10px] font-black uppercase tracking-[2px] text-on-surface-variant">
                      Game Code
                    </Text>
                    <Text className="mt-1 text-2xl font-black text-primary">
                      {game.game_code}
                    </Text>
                  </View>

                  <View className={`rounded-full px-3 py-1 ${getStatusClassName(game.status)}`}>
                    <Text className="text-[10px] font-black uppercase">
                      {getStatusLabel(game.status)}
                    </Text>
                  </View>
                </View>

                <View className="mt-4 gap-1.5">
                  <Text className="text-sm text-on-surface-variant">
                    Host: <Text className="font-black text-on-surface">{game.host_name || '—'}</Text>
                  </Text>
                  <Text className="text-sm text-on-surface-variant">
                    Current: <Text className="font-black text-on-surface">{game.credits} Cr</Text>
                  </Text>
                  <Text className="text-sm text-on-surface-variant">
                    Total: <Text className="font-black text-tertiary">{game.total_credits} Cr</Text>
                  </Text>
                  <Text className="text-sm text-on-surface-variant">
                    Created: <Text className="font-black text-on-surface">{formatDate(game.created_at)}</Text>
                  </Text>
                </View>

                <View className="mt-4 rounded-full bg-primary px-4 py-3">
                  <Text className="text-center text-sm font-black text-white">
                    {getActionLabel(game.status)}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      <Pressable
        onPress={handleLogout}
        className="mb-6 overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm active:scale-[0.98]"
      >
        <View className="h-1.5 w-full bg-error" />

        <View className="flex-row items-center justify-between p-5">
          <View>
            <Text className="text-lg font-black text-on-surface">Logout</Text>
            <Text className="mt-1 text-xs text-on-surface-variant">
              Terminate current session.
            </Text>
          </View>

          <View className="h-10 w-10 items-center justify-center rounded-full bg-error-container">
            <Text className="text-lg font-black text-on-error-container">×</Text>
          </View>
        </View>
      </Pressable>
    </ScrollView>
  )
}
