import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import api from '../../src/services/api'
import PropertyCard from '../../src/components/PropertyCard'
import { useAuth } from '../../src/context/AuthContext'
import { getEcho } from '../../src/services/echo'
import { popup } from '../../src/services/popup'

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
  pending_rent?: {
    amount: number
    property_id: number | null
    owner_user_id: number | null
  } | null
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
  is_bankrupt?: boolean
  pending_rent_amount?: number | null
  pending_rent_property_id?: number | null
  pending_rent_owner_id?: number | null
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
  can_upgrade: boolean
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

type MyProperty = {
  property_id: number
  property_name: string
  tile_number: number | null
  color_group: string
  owner_name: string | null
  purchase_price: number
  base_rent: number
  rent_1_house: number
  rent_2_houses: number
  rent_3_houses: number
  rent_4_houses: number
  rent_hotel: number
  house_purchase_cost: number
  hotel_purchase_cost: number
  can_upgrade: boolean
  houses: number
  has_hotel: boolean
  house_resale_value: number
  hotel_resale_value: number
  property_resale_value: number
  current_expected_rent: number
  can_sell_house: boolean
  can_sell_hotel: boolean
  can_sell_property: boolean
}

type MyPropertiesResponse = {
  game_id: number
  player: {
    user_id: number
    credits: number
    total_credits: number
    is_bankrupt: boolean
    pending_rent_amount: number | null
    pending_rent_property_id: number | null
    pending_rent_owner_id: number | null
  }
  properties: MyProperty[]
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
  tax_effect?: {
    title: string
    amount: number
    message: string
    current_credits: number
    total_credits: number
    tile_number: number
    tile_name: string
  } | null
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

type SellAssetResponse = {
  message: string
  asset_type: 'house' | 'hotel' | 'property'
  credits_gained: number
  current_credits: number
  pending_rent_amount: number | null
  can_pay_pending_rent: boolean
  leaderboard?: LeaderboardPlayer[]
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
  const [myProperties, setMyProperties] = useState<MyProperty[]>([])
  const lastRentAlertKeyRef = useRef<string | null>(null)
  const [pendingRent, setPendingRent] = useState<CurrentTurnResponse['pending_rent'] | null>(null)
  const [sellingPropertyIds, setSellingPropertyIds] = useState<number[]>([])
  const [declaringBankruptcy, setDeclaringBankruptcy] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerTab, setDrawerTab] = useState<'leaderboard' | 'properties' | 'players'>('leaderboard')

  const sortedMyProperties = useMemo(() => {
    return [...myProperties].sort((a, b) => {
      const tileA = a.tile_number ?? Number.MAX_SAFE_INTEGER
      const tileB = b.tile_number ?? Number.MAX_SAFE_INTEGER
      return tileA - tileB
    })
  }, [myProperties])

  const drawerTabButtonClassName = (active: boolean) =>
    `rounded-full px-4 py-2 ${active ? 'bg-primary' : 'bg-surface-container-low'}`

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
    !pendingRent &&
    currentProperty.owner_user_id === null
  )
}, [
  currentProperty,
  isCurrentUserTurn,
  hasRolledThisTurn,
  hasAnsweredQuestionThisTurn,
  pendingRent,
])

const canPayRentForCurrentProperty = useMemo(() => {
  return (
    !!currentProperty &&
    isCurrentUserTurn &&
    hasRolledThisTurn &&
    !rentPaidThisTurn &&
    !pendingRent &&
    currentProperty.owner_user_id !== null &&
    Number(currentProperty.owner_user_id) !== Number(user?.id)
  )
}, [currentProperty, isCurrentUserTurn, hasRolledThisTurn, rentPaidThisTurn, user?.id, pendingRent])

const canBuyHouseForCurrentProperty = useMemo(() => {
  return (
    !!currentProperty &&
    isCurrentUserTurn &&
    hasRolledThisTurn &&
    !houseBoughtThisTurn &&
    !propertyBoughtThisTurn &&
    !pendingRent &&
    currentProperty.can_upgrade &&
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
  pendingRent,
])

const canBuyHotelForCurrentProperty = useMemo(() => {
  return (
    !!currentProperty &&
    isCurrentUserTurn &&
    hasRolledThisTurn &&
    !pendingRent &&
    currentProperty.can_upgrade &&
    Number(currentProperty.owner_user_id) === Number(user?.id) &&
    !currentProperty.hotel &&
    currentProperty.houses === 4
  )
}, [currentProperty, isCurrentUserTurn, hasRolledThisTurn, user?.id, pendingRent])

const visiblePropertyActionCount = useMemo(() => {
  return [
    canBuyCurrentProperty,
    canPayRentForCurrentProperty,
    canBuyHouseForCurrentProperty,
    canBuyHotelForCurrentProperty,
  ].filter(Boolean).length
}, [
  canBuyCurrentProperty,
  canPayRentForCurrentProperty,
  canBuyHouseForCurrentProperty,
  canBuyHotelForCurrentProperty,
])

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

  const propertyActionClassName = (
    backgroundClassName: string,
    count: number
  ) =>
    `h-16 items-center justify-center rounded-full ${backgroundClassName} ${
      count <= 1 ? 'w-full' : 'min-w-[48%] flex-1'
    }`

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
    setPendingRent(data.pending_rent ?? null)

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

      if (me.pending_rent_amount) {
        setPendingRent({
          amount: me.pending_rent_amount,
          property_id: me.pending_rent_property_id ?? null,
          owner_user_id: me.pending_rent_owner_id ?? null,
        })
      } else {
        setPendingRent(null)
      }
    }
  }

  const fetchProperties = async () => {
    const response = await api.get<GamePropertiesResponse>(`/games/${gameId}/properties`)
    setProperties(response.data.properties || [])
  }

  const fetchMyProperties = async () => {
    const response = await api.get<MyPropertiesResponse>(`/games/${gameId}/my-properties`)
    setMyProperties(response.data.properties || [])
  }

  const refreshBoard = async (showLoader = false) => {
    if (!gameId || Number.isNaN(gameId)) {
      popup.alert('Invalid Game', 'Game ID is invalid.')
      router.replace('/dashboard')
      return
    }

    try {
      if (showLoader) setLoading(true)
      else setRefreshing(true)

      await Promise.all([
        fetchGame(),
        fetchProperties(),
        fetchMyProperties(),
        fetchTurn(),
        fetchLeaderboard(),
      ])
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Failed to load game session.'

      popup.alert('Game Session Error', message)

      // Do not force user back to dashboard on temporary API/realtime errors.
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRollDice = async () => {
    if (!isCurrentUserTurn) {
      popup.alert('Not Your Turn', 'Please wait for your turn.')
      return
    }

    if (hasRolledThisTurn) {
      popup.alert('Already Rolled', 'You already rolled this turn.')
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

      await Promise.all([fetchLeaderboard(), fetchMyProperties()])

      if (data.tax_effect) {
        popup.alert(
          data.tax_effect.title,
          `${data.tax_effect.message}\n\nCurrent Credits: ${data.tax_effect.current_credits}\nTotal Credits: ${data.tax_effect.total_credits}`
        )
      } else {
        popup.alert('Dice Rolled', `You rolled ${rollValue || '—'}.`)
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Failed to roll dice.'

      popup.alert('Roll Failed', message)
    } finally {
      setRollingDice(false)
    }
  }

  const handleOpenScanner = () => {
    if (!isCurrentUserTurn) {
      popup.alert('Not Your Turn', 'You can only scan a tile during your turn.')
      return
    }

    if (!hasRolledThisTurn) {
      popup.alert('Roll First', 'Please roll the dice before scanning a tile.')
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
      popup.alert('Not Your Turn', 'You can only end your own turn.')
      return
    }

    try {
      setEndingTurn(true)

      const response = await api.post(`/games/${gameId}/end-turn`)
      const data = response.data

      setDiceOne(null)
      setDiceTwo(null)
      setLastDiceRoll(null)
      setHasRolledThisTurn(false)
      setRentPaidThisTurn(false)
      setHouseBoughtThisTurn(false)
      setPropertyBoughtThisTurn(false)
      setPendingRent(null)
      setTurnNumber(data.turn_number ?? turnNumber)
      setCurrentTurnUserId(data.current_turn_user_id ?? data.next_turn_user_id ?? null)
      setCurrentTurnName(data.current_turn_user_name ?? data.next_turn_user_name ?? null)

      if (Array.isArray(data.leaderboard)) {
        setLeaderboard(data.leaderboard)

        const me = data.leaderboard.find(
          (player: LeaderboardPlayer) => Number(player.user_id) === Number(user?.id)
        )

        if (me && typeof me.position === 'number') {
          setCurrentPosition(me.position)
        }
      }

      popup.alert('Turn Ended', 'Your turn has ended.')
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Failed to end turn.'

      popup.alert('End Turn Failed', message)
    } finally {
      setEndingTurn(false)
    }
  }

  const handleEndGame = () => {
    if (!isCurrentUserHost) {
      popup.alert('Host Only', 'Only the host can end this game.')
      return
    }

    popup.alert(
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

              popup.alert('Game Ended', 'The game session has been ended.')
            } catch (error: any) {
              const message =
                error.response?.data?.message || 'Unable to end the game.'

              popup.alert('End Game Failed', message)
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
      popup.alert('No Property', 'No property is available on this tile.')
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
        fetchMyProperties(),
      ])

      popup.alert(
        'Property Bought',
        response.data.message || 'Property bought successfully.'
      )
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Failed to buy property.'

      popup.alert('Buy Failed', message)
    } finally {
      setBuyingProperty(false)
    }
  }

  const handlePayRent = async () => {
    if (!currentProperty) {
      popup.alert('No Property', 'No property is available on this tile.')
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
        fetchMyProperties(),
      ])

    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Failed to pay rent.'

      if (error.response?.status === 409) {
        popup.alert('Pending Rent', message)
        await Promise.all([fetchTurn(), fetchLeaderboard(), fetchMyProperties()])
      } else {
        popup.alert('Rent Failed', message)
      }
    } finally {
      setPayingRent(false)
    }
  }

  const handleBuyHouse = async () => {
    if (!currentProperty) {
      popup.alert('No Property', 'No property is available on this tile.')
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
        fetchMyProperties(),
      ])

      popup.alert(
        'House Bought',
        response.data.message || 'House bought successfully.'
      )
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Failed to buy house.'

      if (message === 'You cannot buy a house in the same turn you bought a property') {
        setPropertyBoughtThisTurn(true)
      }

      popup.alert('House Failed', message)
    } finally {
      setBuyingHouse(false)
    }
  }

  const handleBuyHotel = async () => {
    if (!currentProperty) {
      popup.alert('No Property', 'No property is available on this tile.')
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
        fetchMyProperties(),
      ])

      popup.alert(
        'Hotel Bought',
        response.data.message || 'Hotel bought successfully.'
      )
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Failed to buy hotel.'

      popup.alert('Hotel Failed', message)
    } finally {
      setBuyingHotel(false)
    }
  }

  const handleSellAsset = (property: MyProperty, assetType: 'house' | 'hotel' | 'property') => {
    const resaleValue =
      assetType === 'house'
        ? property.house_resale_value
        : assetType === 'hotel'
          ? property.hotel_resale_value
          : property.property_resale_value

    popup.alert(
      'Confirm Sale',
      `Sell ${assetType === 'property' ? 'property' : `one ${assetType}`} from ${property.property_name} for ${resaleValue} credits?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sell',
          style: 'destructive',
          onPress: async () => {
            try {
              setSellingPropertyIds((current) => [...current, property.property_id])

              const routeSuffix =
                assetType === 'house'
                  ? 'sell-house'
                  : assetType === 'hotel'
                    ? 'sell-hotel'
                    : 'sell'

              await api.post<SellAssetResponse>(
                `/games/${gameId}/properties/${property.property_id}/${routeSuffix}`
              )

              await Promise.all([
                fetchProperties(),
                fetchLeaderboard(),
                fetchMyProperties(),
                fetchTurn(),
              ])

              popup.alert('Sale Complete', `${property.property_name} updated successfully.`)
            } catch (error: any) {
              popup.alert(
                'Sale Failed',
                error.response?.data?.message || `Failed to sell ${assetType}.`
              )
            } finally {
              setSellingPropertyIds((current) =>
                current.filter((id) => id !== property.property_id)
              )
            }
          },
        },
      ]
    )
  }

  const handleDeclareBankruptcy = () => {
    popup.alert(
      'Declare Bankruptcy',
      'This will set your credits to zero, release all owned properties, and remove you from future turns. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Declare',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeclaringBankruptcy(true)
              const response = await api.post(`/games/${gameId}/declare-bankruptcy`)

              await Promise.all([
                fetchProperties(),
                fetchLeaderboard(),
                fetchMyProperties(),
                fetchTurn(),
              ])

              if (response.data?.game_status === 'ended') {
                router.replace({
                  pathname: '/final-leaderboard/[id]',
                  params: { id: String(gameId) },
                })
                return
              }

              popup.alert('Bankruptcy Declared', 'You have been removed from active play.')
            } catch (error: any) {
              popup.alert(
                'Bankruptcy Failed',
                error.response?.data?.message || 'Failed to declare bankruptcy.'
              )
            } finally {
              setDeclaringBankruptcy(false)
            }
          },
        },
      ]
    )
  }

  useEffect(() => {
    let mounted = true
    let echoInstance: Awaited<ReturnType<typeof getEcho>> = null
    let channel: any = null
    const channelName = `game.${gameId}`

    const setupRealtime = async () => {
      await refreshBoard(true)

      const echo = await getEcho()
      echoInstance = echo

      if (!echo || !mounted) return

      channel = echo.private(channelName)
      console.log('Subscribed to mobile game channel:', channelName)

      channel.listen('.turn.changed', async (event: any) => {
        try {
          console.log('Mobile received turn.changed:', event)
          lastRentAlertKeyRef.current = null

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
          setPendingRent(null)
        } catch (error) {
          console.error('Failed to handle mobile turn.changed event:', error)
        }
      })

      channel.listen('.dice.rolled', async (event: any) => {
        try {
          console.log('Mobile received dice.rolled:', event)
          setLastDiceRoll(event.dice_value)
          setCurrentPosition(event.new_position)

          if (Number(event.user_id) === Number(user?.id)) {
            setHasRolledThisTurn(true)
          } else {
            setHasRolledThisTurn(false)
          }
        } catch (error) {
          console.error('Failed to handle mobile dice.rolled event:', error)
        }
      })

      channel.listen('.leaderboard.updated', async (event: any) => {
        try {
          setLeaderboard(event.leaderboard || [])

          const me = event.leaderboard?.find(
            (player: any) => Number(player.user_id) === Number(user?.id)
          )

          if (me && typeof me.position === 'number') {
            setCurrentPosition(me.position)
          }

          if (me?.pending_rent_amount) {
            setPendingRent({
              amount: me.pending_rent_amount,
              property_id: me.pending_rent_property_id ?? null,
              owner_user_id: me.pending_rent_owner_id ?? null,
            })
          } else {
            setPendingRent(null)
          }
        } catch (error) {
          console.error('Failed to handle mobile leaderboard.updated event:', error)
        }
      })

      channel.listen('.rent.paid', (event: any) => {
        try {
          const rentAlertKey = [
            event.game_id ?? gameId,
            event.tenant_user_id,
            event.owner_user_id,
            event.property_name,
            event.rent_amount,
            event.tenant_credits,
            event.owner_credits,
          ].join(':')

          if (lastRentAlertKeyRef.current === rentAlertKey) {
            return
          }

          lastRentAlertKeyRef.current = rentAlertKey

          if (Number(event.tenant_user_id) === Number(user?.id)) {
            popup.alert(
              'Rent Paid',
              `${event.rent_amount} Cr has been paid to ${event.owner_user_name} for ${event.property_name}.\n\nRemaining Credits: ${event.tenant_credits}`
            )
          } else if (Number(event.owner_user_id) === Number(user?.id)) {
            popup.alert(
              'Rent Received',
              `${event.tenant_user_name} paid you ${event.rent_amount} Cr for ${event.property_name}.\n\nCurrent Credits: ${event.owner_credits}`
            )
          }
        } catch (error) {
          console.error('Failed to handle mobile rent.paid event:', error)
        }
      })

      channel.listen('.game.ended', (event: any) => {
        popup.alert('Game Ended', 'This game has ended.')

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
        channel.stopListening('.rent.paid')
        channel.stopListening('.game.ended')
      }

      echoInstance?.leave(channelName)
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
    <View className="flex-1 bg-surface">
      <ScrollView
        className="flex-1 bg-surface"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingTop: 48,
          paddingBottom: 112,
        }}
      >
        <View className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-primary-container opacity-20" />
        <View className="absolute top-80 -right-32 h-80 w-80 rounded-full bg-secondary-container opacity-30" />
        <View className="absolute bottom-16 left-10 h-56 w-56 rounded-full bg-tertiary-container opacity-20" />

        <View className="mb-8">
          <View className="mb-4 flex-row items-start justify-between gap-4">
            <View className="flex-1">
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
            </View>

            <Pressable
              onPress={() => setDrawerOpen(true)}
              style={pressableFeedback(false)}
              className="h-14 w-14 items-center justify-center rounded-2xl bg-surface-container-low"
            >
              <Text className="text-2xl font-black text-primary">≡</Text>
            </Pressable>
          </View>

          <Pressable
            onPress={() => refreshBoard(false)}
            disabled={refreshing}
            style={pressableFeedback(refreshing)}
            className="self-start rounded-full bg-surface-container-low px-5 py-3"
          >
            <Text className="text-sm font-black text-primary">
              {refreshing ? 'Refreshing...' : 'Refresh Board'}
            </Text>
          </Pressable>
        </View>

        <View className="mb-6 overflow-hidden rounded-[2rem] bg-surface-container-lowest p-8 shadow-sm">
          <Text className="mb-8 text-2xl font-black text-on-surface">
            Dice Engine
          </Text>

          <View className="mb-6 flex-row items-center justify-center gap-5">
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
          </View>

          <View className="mb-8 items-center rounded-3xl bg-surface-container-low p-5">
            <Text className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
              Total Result
            </Text>
            <Text className="mt-2 text-5xl font-black text-primary">
              {diceTotal ?? '—'}
            </Text>
            <Text className="mt-2 text-sm font-black text-tertiary">
              {lastDiceRoll !== null ? 'Valid Move' : 'Awaiting Roll'}
            </Text>
          </View>

          {isCurrentUserTurn ? (
            <View className="flex-row gap-3">
              <Pressable
                onPress={handleRollDice}
                disabled={rollingDice || hasRolledThisTurn}
                style={pressableFeedback(rollingDice || hasRolledThisTurn)}
                className="h-14 flex-1 items-center justify-center rounded-full bg-primary"
              >
                {rollingDice ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="text-base font-black text-white">
                    Roll Dice
                  </Text>
                )}
              </Pressable>

              <Pressable
                onPress={handleEndTurn}
                disabled={endingTurn || !!pendingRent}
                style={pressableFeedback(endingTurn || !!pendingRent)}
                className="h-14 flex-1 items-center justify-center rounded-full bg-secondary"
              >
                {endingTurn ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="text-base font-black text-white">
                    End Turn
                  </Text>
                )}
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={handleRollDice}
              disabled
              style={pressableFeedback(true)}
              className="h-14 items-center justify-center rounded-full bg-primary"
            >
              <Text className="text-base font-black text-white">
                Roll Dice
              </Text>
            </Pressable>
          )}

          {isCurrentUserTurn && visiblePropertyActionCount > 0 && (
            <View className="mt-4 flex-row flex-wrap gap-3">
              {canBuyCurrentProperty && (
                <Pressable
                  onPress={handleBuyProperty}
                  disabled={buyingProperty}
                  style={pressableFeedback(buyingProperty)}
                  className={propertyActionClassName(
                    'bg-primary',
                    visiblePropertyActionCount
                  )}
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
                  className={propertyActionClassName(
                    'bg-amber-500',
                    visiblePropertyActionCount
                  )}
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
                  className={propertyActionClassName(
                    'bg-emerald-600',
                    visiblePropertyActionCount
                  )}
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
                  className={propertyActionClassName(
                    'bg-fuchsia-600',
                    visiblePropertyActionCount
                  )}
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
            </View>
          )}

          {!isCurrentUserTurn && (
            <Text className="mt-4 text-center text-sm font-bold text-on-surface-variant">
              Waiting for {currentTurnName || 'another player'}.
            </Text>
          )}
        </View>

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
            <Text className="mt-1 text-xl font-black text-secondary">
              {currentProperty?.tile_name || currentTile || '—'}
            </Text>
          </View>
        </View>

        {!!pendingRent && (
          <View className="mb-6 rounded-[2rem] border border-amber-200 bg-amber-50 p-6">
            <Text className="text-xs font-black uppercase tracking-widest text-amber-700">
              Pending Rent
            </Text>
            <Text className="mt-2 text-lg font-black text-amber-900">
              Resolve {pendingRent.amount} Cr before ending your turn.
            </Text>
            <Pressable
              onPress={handleDeclareBankruptcy}
              disabled={declaringBankruptcy}
              style={pressableFeedback(declaringBankruptcy)}
              className="mt-4 h-14 items-center justify-center rounded-full bg-red-600"
            >
              {declaringBankruptcy ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-base font-black text-white">
                  Declare Bankruptcy
                </Text>
              )}
            </Pressable>
          </View>
        )}

        <View className="mb-6 rounded-[2rem] bg-tertiary-container p-8">
          <View className="mb-6 flex-row items-center justify-between">
            <Text className="text-2xl font-black text-on-tertiary-container">
              Sync Portal
            </Text>
            <View className="h-12 w-12 items-center justify-center rounded-full bg-white/40">
              <Text className="text-xl">▣</Text>
            </View>
          </View>

          <View className="mb-1 rounded-2xl border-2 border-white/50 bg-white/60 p-5">
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
        </View>

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

      {drawerOpen && (
        <View className="absolute inset-0 z-50 flex-row">
          <Pressable
            onPress={() => setDrawerOpen(false)}
            style={pressableFeedback(false)}
            className="flex-1 bg-black/35"
          />

          <View className="h-full w-[86%] max-w-[360px] bg-background px-5 pb-8 pt-14 shadow-2xl">
            <View className="mb-6 flex-row items-start justify-between gap-4">
              <View className="flex-1">
                <Text className="text-xs font-black uppercase tracking-[3px] text-on-surface-variant">
                  Session Menu
                </Text>
                <Text className="mt-2 text-3xl font-black text-on-surface">
                  Game Drawer
                </Text>
              </View>

              <Pressable
                onPress={() => setDrawerOpen(false)}
                style={pressableFeedback(false)}
                className="h-12 w-12 items-center justify-center rounded-2xl bg-surface-container-low"
              >
                <Text className="text-xl font-black text-on-surface">×</Text>
              </Pressable>
            </View>

            <View className="mb-6 flex-row flex-wrap gap-2">
              <Pressable
                onPress={() => setDrawerTab('leaderboard')}
                style={pressableFeedback(false)}
                className={drawerTabButtonClassName(drawerTab === 'leaderboard')}
              >
                <Text className={`font-black ${drawerTab === 'leaderboard' ? 'text-white' : 'text-on-surface'}`}>
                  Leaderboard
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setDrawerTab('properties')}
                style={pressableFeedback(false)}
                className={drawerTabButtonClassName(drawerTab === 'properties')}
              >
                <Text className={`font-black ${drawerTab === 'properties' ? 'text-white' : 'text-on-surface'}`}>
                  My Properties
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setDrawerTab('players')}
                style={pressableFeedback(false)}
                className={drawerTabButtonClassName(drawerTab === 'players')}
              >
                <Text className={`font-black ${drawerTab === 'players' ? 'text-white' : 'text-on-surface'}`}>
                  Players
                </Text>
              </Pressable>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              {drawerTab === 'leaderboard' && (
                <View className="gap-3 pb-8">
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
                      </View>
                    )
                  })}
                </View>
              )}

              {drawerTab === 'properties' && (
                <View className="gap-4 pb-8">
                  {sortedMyProperties.map((property) => (
                    <PropertyCard
                      key={property.property_id}
                      property={property}
                      selling={sellingPropertyIds.includes(property.property_id)}
                      onSell={(assetType) => handleSellAsset(property, assetType)}
                      pressableFeedback={pressableFeedback}
                    />
                  ))}

                  {sortedMyProperties.length === 0 && (
                    <Text className="text-sm text-on-surface-variant">
                      You do not currently own any properties.
                    </Text>
                  )}
                </View>
              )}

              {drawerTab === 'players' && (
                <View className="gap-3 pb-8">
                  {leaderboard.map((player) => {
                    const isMe = Number(player.user_id) === Number(user?.id)
                    const isTurn = Number(player.user_id) === Number(currentTurnUserId)

                    return (
                      <View
                        key={`player-${player.user_id}`}
                        className={`rounded-2xl px-4 py-4 ${
                          isTurn ? 'border border-primary/25 bg-primary/10' : 'bg-surface-container-low'
                        }`}
                      >
                        <View className="flex-row items-center justify-between gap-3">
                          <View>
                            <Text className="font-black text-on-surface">
                              {player.user_name} {isMe ? '(You)' : ''}
                            </Text>
                            <Text className="mt-1 text-xs text-on-surface-variant">
                              Position: {player.position ?? '—'}
                            </Text>
                          </View>

                          <View className="items-end">
                            <Text className="text-sm font-black text-primary">
                              {player.credits} Cr
                            </Text>
                            {isTurn && (
                              <Text className="mt-1 text-[10px] font-black uppercase tracking-widest text-primary">
                                Current Turn
                              </Text>
                            )}
                          </View>
                        </View>
                      </View>
                    )
                  })}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  )
}
