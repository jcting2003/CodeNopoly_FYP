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
import { getEcho } from '../../src/services/echo'

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

type LeaderboardPlayer = {
  rank: number
  user_id: number
  user_name: string
  credits: number
  total_credits: number
  position?: number | null
  last_property_bought_turn?: number | null
  last_question_answered_turn?: number | null
  last_card_scanned_turn?: number | null
}

type LeaderboardResponse = {
  game_id: number
  game_code: string
  status: string
  leaderboard: LeaderboardPlayer[]
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

type RollDiceResponse = {
  message?: string
  dice_one?: number
  dice_two?: number
  total?: number
  roll_total?: number
  dice_total?: number
  dice_roll?: number
  last_dice_roll?: number
  current_position?: number
  tile_name?: string
  current_tile?: string
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

export default function GameSessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { user } = useAuth()

  const gameId = Number(id)

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [rollingDice, setRollingDice] = useState(false)
  const [endingTurn, setEndingTurn] = useState(false)
  const [endingGame, setEndingGame] = useState(false)

  const [buyingProperty, setBuyingProperty] = useState(false)
  const [payingRent, setPayingRent] = useState(false)
  const [buyingHouse, setBuyingHouse] = useState(false)
  const [buyingHotel, setBuyingHotel] = useState(false)

  const [rentPaidThisTurn, setRentPaidThisTurn] = useState(false)
  const [houseBoughtThisTurn, setHouseBoughtThisTurn] = useState(false)
  const [propertyBoughtThisTurn, setPropertyBoughtThisTurn] = useState(false)

  const [gameCode, setGameCode] = useState('')
  const [gameStatus, setGameStatus] = useState('')
  const [hostId, setHostId] = useState<number | null>(null)

  const [turnNumber, setTurnNumber] = useState<number | null>(null)
  const [currentTurnUserId, setCurrentTurnUserId] = useState<number | null>(null)
  const [currentTurnName, setCurrentTurnName] = useState<string | null>(null)

  const [lastDiceRoll, setLastDiceRoll] = useState<number | null>(null)
  const [diceOne, setDiceOne] = useState<number | null>(null)
  const [diceTwo, setDiceTwo] = useState<number | null>(null)
  const [hasRolledThisTurn, setHasRolledThisTurn] = useState(false)

  const [currentPosition, setCurrentPosition] = useState<number | null>(null)
  const [currentTile, setCurrentTile] = useState('')
  const [leaderboard, setLeaderboard] = useState<LeaderboardPlayer[]>([])
  const [properties, setProperties] = useState<GameProperty[]>([])

  const isCurrentUserTurn = useMemo(() => {
    return currentTurnUserId !== null && Number(currentTurnUserId) === Number(user?.id)
  }, [currentTurnUserId, user?.id])

  const isCurrentUserHost = useMemo(() => {
    return hostId !== null && Number(hostId) === Number(user?.id)
  }, [hostId, user?.id])

  const diceTotal = useMemo(() => {
    if (diceOne !== null && diceTwo !== null) return diceOne + diceTwo
    if (lastDiceRoll !== null) return lastDiceRoll
    return null
  }, [diceOne, diceTwo, lastDiceRoll])

  const currentPlayer = useMemo(() => {
    return leaderboard.find((player) => Number(player.user_id) === Number(user?.id))
  }, [leaderboard, user?.id])

  const hasAnsweredQuestionThisTurn = useMemo(() => {
  return (
    currentPlayer?.last_question_answered_turn !== null &&
    currentPlayer?.last_question_answered_turn !== undefined &&
    Number(currentPlayer.last_question_answered_turn) === Number(turnNumber)
  )
}, [currentPlayer, turnNumber])

  const currentProperty = useMemo(() => {
    if (currentPosition === null) return null

    return (
      properties.find((property) => property.tile_number === currentPosition) || null
    )
  }, [properties, currentPosition])

  const currentRentAmount = useMemo(() => {
  if (!currentProperty) return 0

  if (currentProperty.hotel) return currentProperty.rent_hotel
  if (currentProperty.houses === 4) return currentProperty.rent_4_houses
  if (currentProperty.houses === 3) return currentProperty.rent_3_houses
  if (currentProperty.houses === 2) return currentProperty.rent_2_houses
  if (currentProperty.houses === 1) return currentProperty.rent_1_house

  return currentProperty.rent
}, [currentProperty])

const canBuyCurrentProperty = useMemo(() => {
  return (
    !!currentProperty &&
    isCurrentUserTurn &&
    hasRolledThisTurn &&
    !hasAnsweredQuestionThisTurn &&
    currentProperty.owner_user_id === null
  )
}, [
  currentProperty,
  isCurrentUserTurn,
  hasRolledThisTurn,
  hasAnsweredQuestionThisTurn,
])

const canPayRentForCurrentProperty = useMemo(() => {
  return (
    !!currentProperty &&
    isCurrentUserTurn &&
    hasRolledThisTurn &&
    !rentPaidThisTurn &&
    currentProperty.owner_user_id !== null &&
    Number(currentProperty.owner_user_id) !== Number(user?.id)
  )
}, [currentProperty, isCurrentUserTurn, hasRolledThisTurn, rentPaidThisTurn, user?.id])

const canBuyHouseForCurrentProperty = useMemo(() => {
  return (
    !!currentProperty &&
    isCurrentUserTurn &&
    hasRolledThisTurn &&
    !houseBoughtThisTurn &&
    !propertyBoughtThisTurn &&
    Number(currentProperty.owner_user_id) === Number(user?.id) &&
    !currentProperty.hotel &&
    currentProperty.houses < 4
  )
}, [
  currentProperty,
  isCurrentUserTurn,
  hasRolledThisTurn,
  houseBoughtThisTurn,
  propertyBoughtThisTurn,
  user?.id,
])

const canBuyHotelForCurrentProperty = useMemo(() => {
  return (
    !!currentProperty &&
    isCurrentUserTurn &&
    hasRolledThisTurn &&
    Number(currentProperty.owner_user_id) === Number(user?.id) &&
    !currentProperty.hotel &&
    currentProperty.houses === 4
  )
}, [currentProperty, isCurrentUserTurn, hasRolledThisTurn, user?.id])

  const statusLabel = useMemo(() => {
    if (gameStatus === 'waiting') return 'Waiting'
    if (gameStatus === 'started') return 'In Progress'
    if (gameStatus === 'ended') return 'Ended'
    return 'Unknown'
  }, [gameStatus])

  const pressableFeedback = (disabled = false) => {
    return ({ pressed }: { pressed: boolean }) => ({
      opacity: disabled ? 0.6 : 1,
      transform: [{ scale: pressed && !disabled ? 0.98 : 1 }],
    })
  }

  const fetchGame = async () => {
    const response = await api.get<GameShowResponse>(`/games/${gameId}`)
    const foundGame = response.data.game

    setGameCode(foundGame.game_code || '')
    setGameStatus(foundGame.status || '')
    setHostId(foundGame.host_id)

    if (foundGame.status === 'waiting') {
      router.replace({
        pathname: '/game-lobby/[id]',
        params: { id: String(gameId) },
      })
      return
    }

    if (foundGame.status === 'ended') {
      router.replace({
        pathname: '/final-leaderboard/[id]',
        params: {
          id: String(gameId),
        },
      })
    }
  }

  const fetchTurn = async () => {
    const response = await api.get<CurrentTurnResponse>(`/games/${gameId}/turn`)
    const data = response.data

    const nextTurnUserId = data.current_turn_user_id ?? null
    const nextLastDiceRoll = data.last_dice_roll ?? null

    setTurnNumber(data.turn_number ?? null)
    setLastDiceRoll(nextLastDiceRoll)
    setCurrentTurnUserId(nextTurnUserId)
    setCurrentTurnName(data.current_turn_user_name ?? null)
    setGameStatus(data.status || '')

    const isMyTurn =
      nextTurnUserId !== null &&
      Number(nextTurnUserId) === Number(user?.id)

    setHasRolledThisTurn(isMyTurn && nextLastDiceRoll !== null)
  }

  const fetchLeaderboard = async () => {
    const response = await api.get<LeaderboardResponse>(`/games/${gameId}/leaderboard`)
    const data = response.data

    setGameCode(data.game_code || '')
    setGameStatus(data.status || '')
    setLeaderboard(data.leaderboard || [])

    const me = data.leaderboard.find(
      (player) => Number(player.user_id) === Number(user?.id)
    )

    if (me) {
      if (typeof me.position === 'number') {
        setCurrentPosition(me.position)
      }
    }
  }

  const fetchProperties = async () => {
    const response = await api.get<GamePropertiesResponse>(`/games/${gameId}/properties`)
    setProperties(response.data.properties || [])
  }

  const refreshBoard = async (showLoader = false) => {
    if (!gameId || Number.isNaN(gameId)) {
      Alert.alert('Invalid Game', 'Game ID is invalid.')
      router.replace('/dashboard')
      return
    }

    try {
      if (showLoader) setLoading(true)
      else setRefreshing(true)

      await Promise.all([
        fetchGame(),
        fetchProperties(),
        fetchTurn(),
        fetchLeaderboard(),
      ])
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Failed to load game session.'

      Alert.alert('Game Session Error', message)

      // Do not force user back to dashboard on temporary API/realtime errors.
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRollDice = async () => {
    if (!isCurrentUserTurn) {
      Alert.alert('Not Your Turn', 'Please wait for your turn.')
      return
    }

    if (hasRolledThisTurn) {
      Alert.alert('Already Rolled', 'You already rolled this turn.')
      return
    }

    try {
      setRollingDice(true)

      const response = await api.post<RollDiceResponse>(
        `/games/${gameId}/roll-dice`
      )

      const data = response.data

      if (typeof data.dice_one === 'number') setDiceOne(data.dice_one)
      if (typeof data.dice_two === 'number') setDiceTwo(data.dice_two)

      const rollValue =
        data.total ||
        data.roll_total ||
        data.dice_total ||
        data.dice_roll ||
        data.last_dice_roll ||
        null

      if (typeof rollValue === 'number') {
        setLastDiceRoll(rollValue)
      }

      if (typeof data.current_position === 'number') {
        setCurrentPosition(data.current_position)
      }

      if (typeof data.tile_name === 'string') {
        setCurrentTile(data.tile_name)
      }

      if (typeof data.current_tile === 'string') {
        setCurrentTile(data.current_tile)
      }

      setHasRolledThisTurn(true)
      setRentPaidThisTurn(false)
      setHouseBoughtThisTurn(false)
      setPropertyBoughtThisTurn(false)

      await fetchLeaderboard()

      Alert.alert('Dice Rolled', `You rolled ${rollValue || '—'}.`)
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Failed to roll dice.'

      Alert.alert('Roll Failed', message)
    } finally {
      setRollingDice(false)
    }
  }

  const handleOpenScanner = () => {
    if (!isCurrentUserTurn) {
      Alert.alert('Not Your Turn', 'You can only scan a tile during your turn.')
      return
    }

    if (!hasRolledThisTurn) {
      Alert.alert('Roll First', 'Please roll the dice before scanning a tile.')
      return
    }

    router.push({
      pathname: '/scanner/[id]',
      params: {
        id: String(gameId),
      },
    })
  }

  const handleEndTurn = async () => {
    if (!isCurrentUserTurn) {
      Alert.alert('Not Your Turn', 'You can only end your own turn.')
      return
    }

    try {
      setEndingTurn(true)

      await api.post(`/games/${gameId}/end-turn`)

      setDiceOne(null)
      setDiceTwo(null)
      setLastDiceRoll(null)
      setHasRolledThisTurn(false)
      setRentPaidThisTurn(false)
      setHouseBoughtThisTurn(false)
      setPropertyBoughtThisTurn(false)

      await Promise.all([
        fetchTurn(),
        fetchLeaderboard(),
      ])

      Alert.alert('Turn Ended', 'Your turn has ended.')
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Failed to end turn.'

      Alert.alert('End Turn Failed', message)
    } finally {
      setEndingTurn(false)
    }
  }

  const handleEndGame = () => {
    if (!isCurrentUserHost) {
      Alert.alert('Host Only', 'Only the host can end this game.')
      return
    }

    Alert.alert(
      'End Game',
      'Are you sure you want to end this game? This will finalize the session.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'End Game',
          style: 'destructive',
          onPress: async () => {
            try {
              setEndingGame(true)

              await api.post(`/games/${gameId}/end-game`)

              await Promise.all([
                fetchGame(),
                fetchTurn(),
                fetchLeaderboard(),
                fetchProperties(),
              ])

              Alert.alert('Game Ended', 'The game session has been ended.')
            } catch (error: any) {
              const message =
                error.response?.data?.message || 'Unable to end the game.'

              Alert.alert('End Game Failed', message)
            } finally {
              setEndingGame(false)
            }
          },
        },
      ]
    )
  }

  const handleBuyProperty = async () => {
    if (!currentProperty) {
      Alert.alert('No Property', 'No property is available on this tile.')
      return
    }

    try {
      setBuyingProperty(true)

      const response = await api.post<BuyPropertyResponse>('/properties/buy', {
        game_id: gameId,
        property_id: currentProperty.property_id,
      })

      setPropertyBoughtThisTurn(true)

      await Promise.all([
        fetchProperties(),
        fetchLeaderboard(),
      ])

      Alert.alert(
        'Property Bought',
        response.data.message || 'Property bought successfully.'
      )
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Failed to buy property.'

      Alert.alert('Buy Failed', message)
    } finally {
      setBuyingProperty(false)
    }
  }

  const handlePayRent = async () => {
    if (!currentProperty) {
      Alert.alert('No Property', 'No property is available on this tile.')
      return
    }

    try {
      setPayingRent(true)

      const response = await api.post<PayRentResponse>('/properties/pay-rent', {
        game_id: gameId,
        property_id: currentProperty.property_id,
      })

      setRentPaidThisTurn(true)

      await Promise.all([
        fetchProperties(),
        fetchLeaderboard(),
      ])

      Alert.alert(
        'Rent Paid',
        response.data.message || `You paid ${response.data.rent_paid} Cr rent.`
      )
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Failed to pay rent.'

      Alert.alert('Rent Failed', message)
    } finally {
      setPayingRent(false)
    }
  }

  const handleBuyHouse = async () => {
    if (!currentProperty) {
      Alert.alert('No Property', 'No property is available on this tile.')
      return
    }

    try {
      setBuyingHouse(true)

      const response = await api.post<BuyHouseResponse>('/properties/buy-house', {
        game_id: gameId,
        property_id: currentProperty.property_id,
      })

      setHouseBoughtThisTurn(true)

      await Promise.all([
        fetchProperties(),
        fetchLeaderboard(),
      ])

      Alert.alert(
        'House Bought',
        response.data.message || 'House bought successfully.'
      )
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Failed to buy house.'

      if (message === 'You cannot buy a house in the same turn you bought a property') {
        setPropertyBoughtThisTurn(true)
      }

      Alert.alert('House Failed', message)
    } finally {
      setBuyingHouse(false)
    }
  }

  const handleBuyHotel = async () => {
    if (!currentProperty) {
      Alert.alert('No Property', 'No property is available on this tile.')
      return
    }

    try {
      setBuyingHotel(true)

      const response = await api.post<BuyHotelResponse>('/properties/buy-hotel', {
        game_id: gameId,
        property_id: currentProperty.property_id,
      })

      await Promise.all([
        fetchProperties(),
        fetchLeaderboard(),
      ])

      Alert.alert(
        'Hotel Bought',
        response.data.message || 'Hotel bought successfully.'
      )
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Failed to buy hotel.'

      Alert.alert('Hotel Failed', message)
    } finally {
      setBuyingHotel(false)
    }
  }

  useEffect(() => {
    let mounted = true
    let channel: any = null

    const setupRealtime = async () => {
      await refreshBoard(true)

      const echo = await getEcho()

      if (!echo || !mounted) return

      channel = echo.private(`game.${gameId}`)
      console.log('Subscribed to mobile game channel:', `game.${gameId}`)

      channel.listen('.turn.changed', async (event: any) => {
        console.log('Mobile received turn.changed:', event)

        setTurnNumber(event.turn_number)
        setCurrentTurnUserId(event.current_turn_user_id)
        setCurrentTurnName(event.current_turn_user_name)
        setGameStatus('started')

        setDiceOne(null)
        setDiceTwo(null)
        setLastDiceRoll(null)
        setHasRolledThisTurn(false)
        setRentPaidThisTurn(false)
        setHouseBoughtThisTurn(false)
        setPropertyBoughtThisTurn(false)

        await Promise.all([
          fetchLeaderboard(),
          fetchProperties(),
        ])
      })

      channel.listen('.dice.rolled', async (event: any) => {
        console.log('Mobile received dice.rolled:', event)
        setLastDiceRoll(event.dice_value)
        setCurrentPosition(event.new_position)

        if (Number(event.user_id) === Number(user?.id)) {
          setHasRolledThisTurn(true)
        } else {
          setHasRolledThisTurn(false)
        }

        await fetchLeaderboard()
      })

      channel.listen('.leaderboard.updated', async (event: any) => {
        setLeaderboard(event.leaderboard || [])

        const me = event.leaderboard?.find(
          (player: any) => Number(player.user_id) === Number(user?.id)
        )

        if (me && typeof me.position === 'number') {
          setCurrentPosition(me.position)
        }

        await Promise.all([
          fetchTurn(),
          fetchProperties(),
        ])
      })

      channel.listen('.game.ended', (event: any) => {
        Alert.alert('Game Ended', 'This game has ended.')

        router.replace({
          pathname: '/final-leaderboard/[id]',
          params: {
            id: String(event.game_id || gameId),
          },
        })
      })
    }

    setupRealtime()

    return () => {
      mounted = false

      if (channel) {
        channel.stopListening('.turn.changed')
        channel.stopListening('.dice.rolled')
        channel.stopListening('.leaderboard.updated')
        channel.stopListening('.game.ended')
      }
    }
  }, [gameId, user?.id])

  useEffect(() => {
    if (currentProperty) {
      setCurrentTile(currentProperty.tile_name)
    }
  }, [currentProperty])

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-sm font-bold text-on-surface-variant">
          Loading game board...
        </Text>
      </View>
    )
  }

  return (
    <ScrollView
      className="flex-1 bg-surface"
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 48,
        paddingBottom: 112,
      }}
      // refreshControl={
      //   <RefreshControl
      //     refreshing={refreshing}
      //     onRefresh={() => refreshBoard(false)}
      //   />
      // }
    >
      <View className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-primary-container opacity-20" />
      <View className="absolute top-80 -right-32 h-80 w-80 rounded-full bg-secondary-container opacity-30" />
      <View className="absolute bottom-16 left-10 h-56 w-56 rounded-full bg-tertiary-container opacity-20" />

      {/* Header */}
      <View className="mb-8">
        <View className="mb-3 flex-row flex-wrap items-center gap-2">
          <View className="rounded-full bg-primary-container px-3 py-1">
            <Text className="text-xs font-black uppercase tracking-widest text-on-primary-container">
              Turn {turnNumber || '—'}
            </Text>
          </View>

          <View className="rounded-full bg-green-100 px-3 py-1">
            <Text className="text-xs font-black uppercase tracking-widest text-green-700">
              {statusLabel}
            </Text>
          </View>

          <Text className="text-sm font-bold text-on-surface-variant">
            Live session
          </Text>
        </View>

        <Text className="text-5xl font-black tracking-tighter text-on-surface">
          Code:{' '}
          <Text className="text-primary">
            {gameCode || '—'}
          </Text>
        </Text>
        <Pressable
          onPress={() => refreshBoard(false)}
          disabled={refreshing}
          style={pressableFeedback(refreshing)}
          className="mt-5 self-start rounded-full bg-surface-container-low px-5 py-3"
        >
          <Text className="text-sm font-black text-primary">
            {refreshing ? 'Refreshing...' : 'Refresh Board'}
          </Text>
        </Pressable>
      </View>

      {/* Player Status */}
      <View className="mb-6 flex-row gap-4">
        <View className="flex-1 rounded-2xl bg-surface-container-low p-5">
          <Text className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant">
            Position
          </Text>
          <Text className="mt-1 text-2xl font-black text-on-surface">
            {currentPosition !== null ? `Index [${currentPosition}]` : '—'}
          </Text>
        </View>

        <View className="flex-1 rounded-2xl bg-surface-container-low p-5">
          <Text className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant">
            Current Tile
          </Text>
          <Text className="mt-1 text-2xl font-black text-secondary">
            {currentProperty?.tile_name || currentTile || '—'}
          </Text>
        </View>
      </View>

      {/* Leaderboard */}
      <View className="mb-6 rounded-[2rem] bg-white p-6 shadow-sm">
        <View className="mb-5 flex-row items-center justify-between">
          <Text className="text-2xl font-black text-on-surface">
            Leaderboard
          </Text>
          <Text className="text-2xl">👥</Text>
        </View>

        <View className="gap-3">
          {leaderboard.map((player, index) => {
            const isTurn = Number(player.user_id) === Number(currentTurnUserId)
            const isMe = Number(player.user_id) === Number(user?.id)

            return (
              <View
                key={player.user_id}
                className={`rounded-2xl p-4 ${
                  isTurn
                    ? 'border-l-4 border-primary bg-surface-container-lowest'
                    : 'bg-surface-container-low'
                }`}
              >
                <View className="flex-row items-center justify-between gap-3">
                  <View className="flex-row items-center gap-3">
                    <View
                      className={`h-9 w-9 items-center justify-center rounded-full ${
                        index === 0
                          ? 'bg-yellow-100'
                          : index === 1
                            ? 'bg-slate-200'
                            : index === 2
                              ? 'bg-amber-100'
                              : 'bg-slate-100'
                      }`}
                    >
                      <Text className="text-xs font-black text-slate-700">
                        {index + 1}
                      </Text>
                    </View>

                    <View>
                      <Text
                        className={`font-black ${
                          isTurn ? 'text-primary' : 'text-on-surface'
                        }`}
                      >
                        {player.user_name} {isMe ? '(You)' : ''}
                      </Text>
                      <Text className="mt-1 text-xs text-on-surface-variant">
                        Position: {player.position ?? '—'}
                      </Text>
                    </View>
                  </View>

                  <View className="items-end">
                    <Text className="text-sm font-black text-primary">
                      {player.credits} Cr
                    </Text>
                    <Text className="text-xs text-on-surface-variant">
                      Total: {player.total_credits}
                    </Text>
                  </View>
                </View>

                {isTurn && (
                  <Text className="mt-2 text-[10px] font-black uppercase tracking-widest text-primary">
                    Current Turn
                  </Text>
                )}
              </View>
            )
          })}
        </View>
      </View>

      {/* Dice Engine */}
      <View className="mb-6 overflow-hidden rounded-[2rem] bg-surface-container-lowest p-8 shadow-sm">
        <Text className="mb-8 text-2xl font-black text-on-surface">
          Dice Engine
        </Text>

        <View className="mb-8 flex-row items-center gap-5">
          <View className="h-24 w-24 items-center justify-center rounded-3xl bg-primary shadow-lg">
            <Text className="text-5xl font-black text-white">
              {diceOne ?? '—'}
            </Text>
          </View>

          <View className="h-24 w-24 items-center justify-center rounded-3xl bg-primary-dim shadow-lg">
            <Text className="text-5xl font-black text-white">
              {diceTwo ?? '—'}
            </Text>
          </View>

          <View className="flex-1">
            <Text className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
              Total Result
            </Text>
            <Text className="text-5xl font-black text-primary">
              {diceTotal ?? '—'}
            </Text>
            <Text className="mt-1 text-xs font-black text-tertiary">
              {lastDiceRoll !== null ? 'Valid Move' : 'Awaiting Roll'}
            </Text>
          </View>
        </View>

        <Pressable
          onPress={handleRollDice}
          disabled={rollingDice || !isCurrentUserTurn || hasRolledThisTurn}
          style={pressableFeedback(
            rollingDice || !isCurrentUserTurn || hasRolledThisTurn
          )}
          className="h-14 items-center justify-center rounded-full bg-primary"
        >
          {rollingDice ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-base font-black text-white">
              Roll Dice
            </Text>
          )}
        </Pressable>

        {!isCurrentUserTurn && (
          <Text className="mt-4 text-center text-sm font-bold text-on-surface-variant">
            Waiting for {currentTurnName || 'another player'}.
          </Text>
        )}
      </View>

      {/* Sync Portal */}
      <View className="mb-6 rounded-[2rem] bg-tertiary-container p-8">
        <View className="mb-6 flex-row items-center justify-between">
          <Text className="text-2xl font-black text-on-tertiary-container">
            Sync Portal
          </Text>
          <View className="h-12 w-12 items-center justify-center rounded-full bg-white/40">
            <Text className="text-xl">▣</Text>
          </View>
        </View>

        <View className="mb-6 rounded-2xl border-2 border-white/50 bg-white/60 p-5">
          <Text className="mb-4 font-semibold text-on-tertiary-container">
            Awaiting tile verification...
          </Text>

          <Pressable
            onPress={handleOpenScanner}
            disabled={!isCurrentUserTurn || !hasRolledThisTurn}
            style={pressableFeedback(!isCurrentUserTurn || !hasRolledThisTurn)}
            className="h-14 items-center justify-center rounded-xl bg-tertiary"
          >
            <Text className="font-black text-white">
              Scan Physical Tile QR
            </Text>
          </Pressable>
        </View>

        <View className="flex-row items-center gap-4 rounded-2xl bg-white p-4">
          <View className="h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
            <Text className="text-xl">📡</Text>
          </View>
          <Text className="flex-1 text-sm font-semibold leading-5 text-on-surface">
            Scan tile on physical board to confirm your position.
          </Text>
        </View>
      </View>

      {/* Syntax State */}
      <View className="mb-6 rounded-[2rem] bg-surface-container-high p-6">
        <Text className="mb-5 text-xl font-black text-on-surface">
          Syntax State
        </Text>

        <View className="gap-4">
          <View className="flex-row items-center justify-between rounded-xl bg-white/50 p-4">
            <Text className="text-sm font-semibold text-on-surface-variant">
              Current Turn Player
            </Text>
            <Text className="rounded bg-secondary-container px-2 py-1 text-[10px] font-black text-on-secondary-container">
              {currentTurnName || '—'}
            </Text>
          </View>

          <View className="flex-row items-center justify-between rounded-xl bg-white/50 p-4">
            <Text className="text-sm font-semibold text-on-surface-variant">
              Last Dice Roll
            </Text>
            <Text className="font-black text-on-surface">
              {lastDiceRoll ?? '—'}
            </Text>
          </View>

          <View className="flex-row items-center justify-between rounded-xl bg-white/50 p-4">
            <Text className="text-sm font-semibold text-on-surface-variant">
              Game Status
            </Text>
            <Text className="rounded-full bg-green-100 px-3 py-1 text-xs font-black uppercase text-green-700">
              {statusLabel}
            </Text>
          </View>
        </View>
      </View>

      {/* Tile Details */}
      <View className="mb-6 overflow-hidden rounded-[2rem] bg-surface-container-low">
        <View className="bg-secondary p-8">
          <Text className="text-xs font-black uppercase tracking-widest text-white/80">
            Library
          </Text>
          <Text className="mt-1 text-3xl font-black leading-tight text-white">
            {currentProperty?.tile_name || currentTile || 'Unknown Tile'}
          </Text>
          <Text className="mt-6 text-5xl opacity-30">⌘</Text>
        </View>

        <View className="bg-surface-container-lowest p-8">
          <View className="mb-6 flex-row gap-8">
            <View className="flex-1">
              <Text className="mb-1 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                Execution Cost
              </Text>
              <Text className="text-2xl font-black text-on-surface">
                {currentProperty ? `${currentProperty.cost} Cr` : '—'}
              </Text>
            </View>

            <View className="flex-1">
              <Text className="mb-1 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                Runtime Yield
              </Text>
              <Text className="text-2xl font-black text-tertiary">
                {currentProperty?.color_group || '—'}
              </Text>
            </View>
          </View>

          <Text className="mb-2 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
            Description
          </Text>

          <Text className="text-sm leading-6 text-on-surface-variant">
            {currentProperty
              ? `${currentProperty.property_name} • Owner: ${
                  currentProperty.owner_name || 'Unowned'
                } • Houses: ${currentProperty.houses} • Hotel: ${
                  currentProperty.hotel ? 'Yes' : 'No'
                } • Rent Due: ${currentRentAmount} Cr`
              : 'Tile details will appear once you roll and scan the board tile.'}
          </Text>
        </View>
      </View>

      {/* Action Bar */}
      {isCurrentUserTurn && (
        <View className="gap-4">
          {canBuyCurrentProperty && (
            <Pressable
              onPress={handleBuyProperty}
              disabled={buyingProperty}
              style={pressableFeedback(buyingProperty)}
              className="h-16 items-center justify-center rounded-full bg-primary"
            >
              {buyingProperty ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-lg font-black text-white">
                  Buy Property ({currentProperty?.cost ?? 0} Cr)
                </Text>
              )}
            </Pressable>
          )}

          {canPayRentForCurrentProperty && (
            <Pressable
              onPress={handlePayRent}
              disabled={payingRent}
              style={pressableFeedback(payingRent)}
              className="h-16 items-center justify-center rounded-full bg-amber-500"
            >
              {payingRent ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-lg font-black text-white">
                  Pay Rent ({currentRentAmount} Cr)
                </Text>
              )}
            </Pressable>
          )}

          {canBuyHouseForCurrentProperty && (
            <Pressable
              onPress={handleBuyHouse}
              disabled={buyingHouse}
              style={pressableFeedback(buyingHouse)}
              className="h-16 items-center justify-center rounded-full bg-emerald-600"
            >
              {buyingHouse ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-lg font-black text-white">
                  Buy House ({currentProperty?.house_cost ?? 0} Cr)
                </Text>
              )}
            </Pressable>
          )}

          {canBuyHotelForCurrentProperty && (
            <Pressable
              onPress={handleBuyHotel}
              disabled={buyingHotel}
              style={pressableFeedback(buyingHotel)}
              className="h-16 items-center justify-center rounded-full bg-fuchsia-600"
            >
              {buyingHotel ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-lg font-black text-white">
                  Buy Hotel ({currentProperty?.hotel_cost ?? 0} Cr)
                </Text>
              )}
            </Pressable>
          )}

          <Pressable
            onPress={handleEndTurn}
            disabled={endingTurn}
            style={pressableFeedback(endingTurn)}
            className="h-16 items-center justify-center rounded-full bg-secondary"
          >
            {endingTurn ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-xl font-black text-white">
                End Turn
              </Text>
            )}
          </Pressable>

        </View>
      )}

      {isCurrentUserHost && (
        <View className="mt-4">
          <Pressable
            disabled={endingGame}
            onPress={handleEndGame}
            style={pressableFeedback(endingGame)}
            className="h-16 items-center justify-center rounded-full bg-red-500"
          >
            {endingGame ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-xl font-black text-white">
                End Game
              </Text>
            )}
          </Pressable>
        </View>
      )}
    </ScrollView>
  )
}
