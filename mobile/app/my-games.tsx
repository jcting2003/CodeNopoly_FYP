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

export default function MyGamesScreen() {
  const [games, setGames] = useState<MyGame[]>([])
  const [loading, setLoading] = useState(false)

  const fetchMyGames = async () => {
    try {
      setLoading(true)
      const response = await api.get<MyGamesResponse>('/my-games')
      setGames(response.data.games || [])
    } catch (error: any) {
      popup.alert(
        'My Games Failed',
        error.response?.data?.message || 'Failed to load your games.'
      )
    } finally {
      setLoading(false)
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

  useEffect(() => {
    fetchMyGames()
  }, [])

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 32 }}
    >
      <View className="mb-8 flex-row items-end justify-between gap-4">
        <View className="flex-1">
          <Text className="text-xs font-black uppercase tracking-[3px] text-primary">
            Game History
          </Text>
          <Text className="mt-2 text-4xl font-black text-on-surface">
            My Past Games
          </Text>
          <Text className="mt-3 text-sm leading-6 text-on-surface-variant">
            View games you hosted or joined.
          </Text>
        </View>

        <Pressable
          onPress={() => router.push('/create-game')}
          className="rounded-full bg-primary px-4 py-3 active:scale-[0.98]"
        >
          <Text className="text-xs font-black text-white">Create New Game</Text>
        </Pressable>
      </View>

      {loading ? (
        <View className="rounded-[28px] bg-surface-container-lowest p-8">
          <ActivityIndicator color="#1e63b8" />
          <Text className="mt-3 text-center text-sm text-on-surface-variant">
            Loading your games...
          </Text>
        </View>
      ) : games.length === 0 ? (
        <View className="rounded-[28px] bg-surface-container-lowest p-8">
          <Text className="text-2xl font-black text-on-surface">No games found</Text>
          <Text className="mt-2 text-sm leading-6 text-on-surface-variant">
            Create or join a game to see your history here.
          </Text>
        </View>
      ) : (
        <View className="gap-4">
          {games.map((game) => (
            <View
              key={game.id}
              className="rounded-[28px] border border-slate-100 bg-surface-container-lowest p-6 shadow-sm"
            >
              <View className="mb-5 flex-row items-start justify-between gap-4">
                <View className="flex-1">
                  <Text className="text-[10px] font-black uppercase tracking-[2px] text-on-surface-variant">
                    Game Code
                  </Text>
                  <Text className="mt-1 text-3xl font-black text-primary">
                    {game.game_code}
                  </Text>
                </View>

                <View className={`rounded-full px-3 py-1 ${getStatusClassName(game.status)}`}>
                  <Text className="text-[10px] font-black uppercase">
                    {getStatusLabel(game.status)}
                  </Text>
                </View>
              </View>

              <View className="mb-6 gap-2">
                <Text className="text-sm text-on-surface-variant">
                  Role: <Text className="font-black text-on-surface">{game.is_host ? 'Host' : 'Player'}</Text>
                </Text>
                <Text className="text-sm text-on-surface-variant">
                  Host: <Text className="font-black text-on-surface">{game.host_name || '—'}</Text>
                </Text>
                <Text className="text-sm text-on-surface-variant">
                  Current Credits: <Text className="font-black text-on-surface">{game.credits} Cr</Text>
                </Text>
                <Text className="text-sm text-on-surface-variant">
                  Total Credits: <Text className="font-black text-tertiary">{game.total_credits} Cr</Text>
                </Text>
                <Text className="text-sm text-on-surface-variant">
                  Created: <Text className="font-black text-on-surface">{formatDate(game.created_at)}</Text>
                </Text>
              </View>

              <Pressable
                onPress={() => handleOpenGame(game)}
                className="rounded-full bg-primary px-4 py-3 active:scale-[0.98]"
              >
                <Text className="text-center text-sm font-black text-white">
                  {getActionLabel(game.status)}
                </Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  )
}
