import React, { useEffect, useMemo, useState } from 'react'
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
import { useAuth } from '../../src/context/AuthContext'

type GameResponse = {
  game: {
    id: number
    host_id: number
    game_code?: string
    status: string
    started_at?: string | null
    ended_at?: string | null
  }
}

type RawPlayer = {
  user_id?: number
  id?: number
  user?: {
    id: number
    name: string
  }
  name?: string
  username?: string
}

type PlayersResponse =
  | RawPlayer[]
  | {
      players?: RawPlayer[]
    }

type LobbyPlayer = {
  id: number
  name: string
  status: string
  is_host: boolean
}

export default function GameLobbyScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { user } = useAuth()

  const gameId = Number(id)
  const maxPlayers = 6

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [startingGame, setStartingGame] = useState(false)

  const [gameCode, setGameCode] = useState('')
  const [gameStatus, setGameStatus] = useState('')
  const [hostId, setHostId] = useState<number | null>(null)
  const [players, setPlayers] = useState<LobbyPlayer[]>([])

  const emptySlots = useMemo(() => {
    return Math.max(maxPlayers - players.length, 0)
  }, [players.length])

  const isCurrentUserHost = useMemo(() => {
    return hostId !== null && user?.id === hostId
  }, [hostId, user?.id])

  const gameTitle = useMemo(() => {
    if (!gameId || Number.isNaN(gameId)) return 'Game Lobby'
    return `Game #${gameId}`
  }, [gameId])

  const gameStatusText = useMemo(() => {
    if (!gameStatus) return 'Waiting for players...'
    if (gameStatus === 'waiting') return 'Waiting for players...'
    if (gameStatus === 'started') return 'Game started'
    if (gameStatus === 'ended') return 'Game ended'
    return gameStatus
  }, [gameStatus])

  const fetchGame = async () => {
    const response = await api.get<GameResponse>(`/api/games/${gameId}`)
    const foundGame = response.data.game

    setGameCode(foundGame.game_code || '')
    setGameStatus(foundGame.status || '')
    setHostId(foundGame.host_id)

    if (foundGame.status === 'started') {
      router.replace({
        pathname: '/game-session/[id]',
        params: {
          id: String(gameId),
        },
      })
    }

    if (foundGame.status === 'ended') {
      Alert.alert('Game Ended', 'This game has already ended.')
      router.replace('/dashboard')
    }
  }

  const fetchPlayers = async () => {
    const response = await api.get<PlayersResponse>(`/api/games/${gameId}/players`)

    const rawPlayers = Array.isArray(response.data)
      ? response.data
      : response.data.players || []

    const mappedPlayers = rawPlayers.map((player) => {
      const playerId = player.user?.id || player.user_id || player.id || 0
      const playerName =
        player.user?.name ||
        player.name ||
        player.username ||
        `Player ${playerId}`

      return {
        id: playerId,
        name: playerName,
        status: 'CONNECTED',
        is_host: playerId === hostId,
      }
    })

    setPlayers(mappedPlayers)
  }

  const refreshLobby = async (showLoader = false) => {
    if (!gameId || Number.isNaN(gameId)) {
      Alert.alert('Invalid Game', 'Game ID is invalid.')
      router.replace('/dashboard')
      return
    }

    try {
      if (showLoader) setLoading(true)
      else setRefreshing(true)

      await fetchGame()
      await fetchPlayers()
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Failed to load lobby.'

      Alert.alert('Lobby Error', message)
      router.replace('/dashboard')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleStartGame = async () => {
    if (players.length < 2) {
      Alert.alert('Not Enough Players', 'Minimum 2 players are required to start.')
      return
    }

    try {
      setStartingGame(true)

      await api.post(`/api/games/${gameId}/start`)

      router.replace({
        pathname: '/game-session/[id]',
        params: {
          id: String(gameId),
        },
      })
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Failed to start game.'

      Alert.alert('Start Failed', message)
    } finally {
      setStartingGame(false)
    }
  }

  useEffect(() => {
    refreshLobby(true)

    const interval = setInterval(() => {
      refreshLobby(false)
    }, 3000)

    return () => clearInterval(interval)
  }, [gameId, hostId])

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-sm font-bold text-on-surface-variant">
          Loading lobby...
        </Text>
      </View>
    )
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="min-h-screen px-6 py-12"
    >
      <View className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-primary-container opacity-20" />
      <View className="absolute top-80 -right-32 h-80 w-80 rounded-full bg-secondary-container opacity-30" />
      <View className="absolute bottom-16 left-10 h-56 w-56 rounded-full bg-tertiary-container opacity-20" />

      {/* Hero session card */}
      <View className="mb-8 overflow-hidden rounded-[2rem] bg-surface-container-low p-8">
        <View className="mb-4 self-start flex-row items-center gap-2 rounded-full bg-tertiary-container px-3 py-1">
          <View className="h-2 w-2 rounded-full bg-tertiary" />
          <Text className="text-xs font-black text-on-tertiary-container">
            LIVE SESSION
          </Text>
        </View>

        <Text className="mb-2 text-5xl font-black tracking-tighter text-on-surface">
          {gameTitle}
        </Text>

        <Text className="text-lg font-semibold text-on-surface-variant">
          {gameStatusText}
        </Text>

        <View className="mt-10 flex-row gap-4">
          <View className="flex-1 rounded-2xl bg-surface-container-lowest p-5 shadow-sm">
            <Text className="mb-1 text-[11px] font-black uppercase tracking-widest text-outline">
              Game Code
            </Text>

            <Text className="text-3xl font-black tracking-tight text-primary">
              {gameCode || '------'}
            </Text>
          </View>

          <View className="flex-1 rounded-2xl bg-surface-container-lowest p-5 shadow-sm">
            <Text className="mb-1 text-[11px] font-black uppercase tracking-widest text-outline">
              Players
            </Text>

            <Text className="text-3xl font-black tracking-tight text-secondary">
              {players.length} / {maxPlayers}
            </Text>
          </View>
        </View>

        <View className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-primary opacity-5" />
        <Text className="absolute bottom-8 right-8 rotate-12 text-[90px] font-black text-primary opacity-10">
          ▦
        </Text>
      </View>

      {/* Host-only start section */}
      {isCurrentUserHost && (
        <View className="mb-8 rounded-[2rem] bg-surface-container-high p-6">
          <Text className="text-xl font-black text-on-surface">
            Ready to Execute?
          </Text>

          <Text className="mt-1 text-sm text-on-surface-variant">
            Minimum 2 players required to initialize.
          </Text>

          <Pressable
            onPress={handleStartGame}
            disabled={players.length < 2 || startingGame}
            className={`mt-5 h-14 items-center justify-center rounded-full bg-primary shadow-lg ${
              players.length < 2 || startingGame ? 'opacity-60' : 'active:scale-[0.98]'
            }`}
          >
            {startingGame ? (
              <ActivityIndicator color="#F7F9FF" />
            ) : (
              <Text className="text-base font-black text-on-primary">
                Start Game
              </Text>
            )}
          </Pressable>
        </View>
      )}

      {/* Joined players panel */}
      <View className="rounded-[2.5rem] bg-surface-container-lowest p-6 shadow-sm">
        <View className="mb-8 flex-row items-center justify-between px-2">
          <Text className="text-2xl font-black text-on-surface">
            Joined Players
          </Text>

          <Text className="text-2xl text-outline">👥</Text>
        </View>

        <View className="gap-4">
          {players.map((player) => (
            <View
              key={player.id}
              className={`flex-row items-center gap-4 rounded-3xl p-4 ${
                player.is_host
                  ? 'border-2 border-primary/10 bg-primary-container/20'
                  : 'bg-surface-container-low'
              }`}
            >
              <View className="relative">
                <View className="h-14 w-14 items-center justify-center rounded-2xl bg-white p-1">
                  <View className="h-full w-full items-center justify-center rounded-2xl bg-surface-container-highest">
                    <Text className="text-xl text-outline">👤</Text>
                  </View>
                </View>

                {player.is_host && (
                  <View className="absolute -left-2 -top-2 rounded-full bg-primary px-2 py-0.5">
                    <Text className="text-[10px] font-black uppercase text-on-primary">
                      Host
                    </Text>
                  </View>
                )}
              </View>

              <View className="flex-1">
                <Text className="text-base font-black text-on-surface">
                  {player.name}
                </Text>

                <Text
                  className={`mt-1 text-xs font-bold ${
                    player.is_host ? 'text-primary' : 'text-on-surface-variant'
                  }`}
                >
                  STATUS: {player.status}
                </Text>
              </View>

              {player.is_host && (
                <Text className="text-xl text-primary">✓</Text>
              )}
            </View>
          ))}

          {Array.from({ length: emptySlots }).map((_, index) => (
            <View
              key={`slot-${index}`}
              className="flex-row items-center gap-4 rounded-3xl border-2 border-dashed border-outline-variant/30 p-4 opacity-60"
            >
              <View className="h-14 w-14 items-center justify-center rounded-2xl bg-surface-container">
                <Text className="text-xl text-outline">＋</Text>
              </View>

              <View className="flex-1">
                <Text className="font-semibold italic text-outline">
                  Waiting for connection...
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View className="mt-10 rounded-2xl bg-surface-container p-4">
          <Text className="text-xs font-semibold leading-5 text-on-surface-variant">
            ℹ Players can join using the game code.
          </Text>
        </View>
      </View>

      <Pressable
        onPress={() => router.replace('/dashboard')}
        className="mt-8 rounded-full border border-outline-variant bg-white px-6 py-4 active:opacity-80"
      >
        <Text className="text-center text-sm font-black text-on-surface-variant">
          Back to Dashboard
        </Text>
      </Pressable>

      {refreshing && (
        <Text className="mt-4 text-center text-xs font-bold uppercase tracking-widest text-outline">
          Syncing lobby...
        </Text>
      )}
    </ScrollView>
  )
}