import React, { useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { router, useLocalSearchParams } from 'expo-router'
import api from '../../src/services/api'

type TileData = {
  id?: number
  tile_id?: number
  tile_number?: number
  tile_name?: string
  name?: string
  nfc_value?: string
  tile_type?: string
  difficulty?: string
}

type CardData = {
  id: number
  card_code: string
  card_type: 'community_chest' | 'chance'
  title: string
  description: string
  effect_type: string
  effect_value: number | null
  target_tile_number: number | null
}

type CardResultData = {
  message: string
  current_credits: number
  total_credits: number
  new_position: number
}

type QuestionData = {
  id: number
  question_text: string
  question_type?: 'mcq' | 'structured'
  option_a?: string | null
  option_b?: string | null
  option_c?: string | null
  option_d?: string | null
  options?: string[] | Record<string, string> | null
  difficulty?: string
  credits?: number
}

type ScanResponse = {
  message?: string

  // Normal tile scan response
  tile?: TileData
  available_difficulties?: string[]

  // Some backend response shapes may wrap tile inside data
  data?: {
    tile?: TileData
  }

  // Fallback top-level tile fields
  id?: number
  tile_id?: number
  tile_number?: number
  tile_name?: string
  name?: string

  // Card scan response
  card?: CardData
  result?: CardResultData

  // Optional question response
  question?: QuestionData
}

type Difficulty = 'easy' | 'intermediate' | 'hard'

export default function TileScannerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const gameId = Number(id)
  const isAndroid = Platform.OS === 'android'

  const [scanning, setScanning] = useState(false)
  const [hasScanned, setHasScanned] = useState(false)
  const [qrMode, setQrMode] = useState(false)
  const [permission, requestPermission] = useCameraPermissions()

  const scanLockRef = useRef(false)
  const questionLockRef = useRef(false)

  const [pendingTile, setPendingTile] = useState<{
    id?: number
    tile_id?: number
    tile_name?: string
    name?: string
    available_difficulties: Difficulty[]
  } | null>(null)

  useEffect(() => {
  if (!isAndroid) return

  const startNfc = async () => {
    try {
      const NfcManagerModule = await import('react-native-nfc-manager')
      const NfcManager = NfcManagerModule.default

      const supported = await NfcManager.isSupported()

      if (supported) {
        await NfcManager.start()
        console.log('NFC Manager started')
      } else {
        console.log('NFC is not supported on this device')
      }
    } catch (error) {
      console.log('NFC start error:', error)
    }
  }

  startNfc()
}, [isAndroid])

  const scanTile = async (rawValue: string) => {
    if (scanLockRef.current || hasScanned || scanning) return

    scanLockRef.current = true
    setHasScanned(true)
    setScanning(true)

    try {
      const scannedValue = rawValue.trim().toUpperCase()

      const isCardCode =
        scannedValue.startsWith('CC_') ||
        scannedValue.startsWith('CH_')

      const endpoint = isCardCode
        ? `/games/${gameId}/scan-card`
        : `/games/${gameId}/scan-tile`

      const payload = isCardCode
        ? { card_code: scannedValue }
        : { nfc_value: scannedValue }

      const scanResponse = await api.post<ScanResponse>(endpoint, payload)

      console.log('SCAN RESPONSE:', scanResponse.data)

      if (isCardCode) {
        const card = scanResponse.data.card
        const result = scanResponse.data.result

        if (!card) {
          Alert.alert('Card Not Found', 'No card was returned for this code.')
          scanLockRef.current = false
          setHasScanned(false)
          return
        }

        setQrMode(false)

        Alert.alert(
          card.title || 'Card Scanned',
          `${card.description || ''}\n\n${result?.message || ''}\nCurrent Credits: ${
            result?.current_credits ?? '-'
          }`,
          [
            {
              text: 'Back to Game',
              onPress: () => {
                router.replace({
                  pathname: '/game-session/[id]',
                  params: {
                    id: String(gameId),
                  },
                })
              },
            },
          ]
        )

        return
      }

      const tile =
        scanResponse.data.tile ||
        scanResponse.data.data?.tile ||
        scanResponse.data

      const tileId =
        tile?.id ||
        tile?.tile_id ||
        scanResponse.data.tile_id ||
        scanResponse.data.id

      const tileName =
        tile?.tile_name ||
        tile?.name ||
        scanResponse.data.tile_name ||
        scanResponse.data.name

      if (!tileId) {
        Alert.alert('Tile Not Found', 'No tile was returned for this code.')
        scanLockRef.current = false
        setHasScanned(false)
        return
      }

      const availableDifficulties = (
        scanResponse.data.available_difficulties || []
      )
        .map((difficulty) => {
          const normalized = difficulty.toLowerCase()

          return normalized === 'medium' ? 'intermediate' : normalized
        })
        .filter((difficulty): difficulty is Difficulty =>
          ['easy', 'intermediate', 'hard'].includes(difficulty)
        )

      if (availableDifficulties.length === 0) {
        Alert.alert(
          'No Questions Available',
          'This tile does not have any available questions yet.'
        )

        scanLockRef.current = false
        setHasScanned(false)
        return
      }

      setPendingTile({
        id: tileId,
        tile_name: tileName || 'Selected Tile',
        available_difficulties: availableDifficulties,
      })

        setQrMode(false)
        } catch (error: any) {
          if (error.response?.status === 429) {
            Alert.alert(
              'Too Many Requests',
              'Please wait around 1 minute before trying again.'
            )
          } else {
            const message =
              error.response?.data?.message || 'Failed to check this code.'

            Alert.alert('Scan Failed', message)
          }

          scanLockRef.current = false
          setHasScanned(false)
        } finally {
          setScanning(false)
        }
      }

  const loadQuestionByDifficulty = async (difficulty: Difficulty) => {
    if (!pendingTile || scanning || questionLockRef.current) return
    if (!pendingTile.available_difficulties.includes(difficulty)) {
      Alert.alert(
        'Difficulty Not Available',
        'This difficulty is not available for the selected tile.'
      )
      return
    }

    questionLockRef.current = true

    try {
      setScanning(true)

      const tileId = pendingTile.id || pendingTile.tile_id

      const questionResponse = await api.post<{
        question: {
          id: number
          question_text: string
          question_type?: 'mcq' | 'structured'
          option_a?: string | null
          option_b?: string | null
          option_c?: string | null
          option_d?: string | null
          difficulty?: string
          credits?: number
        }
      }>(`/games/${gameId}/tiles/${tileId}/question`, {
        difficulty,
      })

      const question = questionResponse.data.question

      if (!question?.id) {
        Alert.alert('No Question', 'No question was returned for this difficulty.')
        questionLockRef.current = false
        scanLockRef.current = false
        setHasScanned(false)
        setPendingTile(null)
        return
      }

      router.replace({
        pathname: '/question',
        params: {
          gameId: String(gameId),
          questionId: String(question.id),
          questionText: question.question_text,
          questionType: question.question_type || 'mcq',
          difficulty: question.difficulty || difficulty,
          credits: String(question.credits || 0),
          optionA: question.option_a || '',
          optionB: question.option_b || '',
          optionC: question.option_c || '',
          optionD: question.option_d || '',
          tileName: pendingTile.tile_name || pendingTile.name || '',
        },
      })
    } catch (error: any) {
      if (error.response?.status === 429) {
        Alert.alert(
          'Too Many Requests',
          'Please wait around 1 minute before trying again.'
        )
      } else {
        const message =
          error.response?.data?.message || 'Failed to load question.'

        Alert.alert('Question Failed', message)
      }

      questionLockRef.current = false
      scanLockRef.current = false
      setHasScanned(false)
      setPendingTile(null)
    } finally {
      setScanning(false)
    }
  }

  const readNfcTag = async () => {
  if (!isAndroid) {
    Alert.alert(
      'NFC Not Available',
      'NFC scanning is only available on Android in this build. Please use QR scanning on iPhone.'
    )
    return
  }

  if (scanning || hasScanned || scanLockRef.current || pendingTile) {
    return
  }

  try {
    const NfcManagerModule = await import('react-native-nfc-manager')
    const NfcManager = NfcManagerModule.default
    const { Ndef, NfcTech } = NfcManagerModule

    const supported = await NfcManager.isSupported()

    if (!supported) {
      Alert.alert('NFC Not Supported', 'This Android phone does not support NFC.')
      return
    }

    const enabled = await NfcManager.isEnabled()

    if (!enabled) {
      Alert.alert('NFC Disabled', 'Please turn on NFC in your Android settings.')
      return
    }

    setQrMode(false)
    await NfcManager.requestTechnology(NfcTech.Ndef)

    const tag = await NfcManager.getTag()

    console.log('NFC TAG:', tag)

    const record = tag?.ndefMessage?.[0]

    if (!record?.payload) {
      Alert.alert('No NFC Data', 'This NFC tag does not contain a text record.')
      return
    }

    const rawPayload = record.payload as unknown as number[]
    const payload = new Uint8Array(rawPayload)
    const value = Ndef.text.decodePayload(payload).trim().toUpperCase()

    if (!value) {
      Alert.alert('Empty NFC Tag', 'No tile or card code was found.')
      return
    }

    setQrMode(false)
    scanTile(value)
  } catch (error: any) {
    console.log('NFC READ ERROR:', error)

    Alert.alert(
      'NFC Scan Failed',
      error?.message || 'Unable to read NFC tag.'
    )
  } finally {
    try {
      const NfcManagerModule = await import('react-native-nfc-manager')
      const NfcManager = NfcManagerModule.default
      await NfcManager.cancelTechnologyRequest()
    } catch {
      // Ignore cancel error
    }
  }
}

  const startQrScanner = async () => {
    if (!permission?.granted) {
      const result = await requestPermission()

      if (!result.granted) {
        Alert.alert(
          'Camera Permission Required',
          'Please allow camera access to scan QR codes.'
        )
        return
      }
    }

    setQrMode(true)
  }

  const handleQrScanned = ({ data }: { data: string }) => {
    if (scanning || hasScanned || scanLockRef.current || pendingTile) {
      return
    }

    const value = data.trim().toUpperCase()

    if (!value) {
      Alert.alert('Invalid QR Code', 'The QR code does not contain a valid value.')
      return
    }

    setQrMode(false)
    scanTile(value)
  }
    
return (
  <ScrollView
    className="flex-1 bg-background"
    contentContainerStyle={{
      paddingHorizontal: 24,
      paddingVertical: 48,
    }}
    keyboardShouldPersistTaps="handled"
  >
    {/* Header */}
    <View className="mb-8">
      <Text className="text-xs font-black uppercase tracking-[3px] text-tertiary">
        Tile.Scan()
      </Text>

      <Text className="mt-3 text-5xl font-black tracking-tighter text-on-surface">
        Scan Tile
      </Text>

      <Text className="mt-4 text-base leading-7 text-on-surface-variant">
        {isAndroid
          ? 'Tap an NFC tag or scan the QR code on the physical board tile or card.'
          : 'Scan the QR code on the physical board tile or card to continue.'}
      </Text>
    </View>

    {/* NFC Scan Mode */}
    {isAndroid && (
      <View className="mb-6 rounded-[2rem] bg-surface-container-lowest p-5">
        <Text className="mb-3 text-xs font-black uppercase tracking-widest text-on-surface-variant">
          NFC Scan Mode
        </Text>

        <Pressable
          onPress={readNfcTag}
          disabled={scanning || hasScanned || !!pendingTile}
          className={`h-14 items-center justify-center rounded-full bg-tertiary ${
            scanning || hasScanned || pendingTile ? 'opacity-60' : ''
          }`}
        >
          <Text className="font-black text-white">
            Tap NFC Tag
          </Text>
        </Pressable>

        <Text className="mt-3 text-center text-xs font-bold text-on-surface-variant">
          Android only. iPhone users should use QR scan.
        </Text>
      </View>
    )}

    {/* QR Scan Mode */}
    <View className="mb-6 rounded-[2rem] bg-surface-container-lowest p-5">
      <Text className="mb-3 text-xs font-black uppercase tracking-widest text-on-surface-variant">
        QR Scan Mode
      </Text>

      {!qrMode ? (
        <Pressable
          onPress={startQrScanner}
          disabled={scanning || hasScanned || !!pendingTile}
          className={`h-14 items-center justify-center rounded-full bg-primary ${
            scanning || hasScanned || pendingTile ? 'opacity-60' : ''
          }`}
        >
          <Text className="font-black text-white">
            Scan QR Code
          </Text>
        </Pressable>
      ) : (
        <View>
          <View className="h-[420px] overflow-hidden rounded-3xl bg-black">
            <CameraView
              style={{ flex: 1 }}
              barcodeScannerSettings={{
                barcodeTypes: ['qr'],
              }}
              onBarcodeScanned={
                scanning || hasScanned || pendingTile
                  ? undefined
                  : handleQrScanned
              }
            />
          </View>

          <Pressable
            onPress={() => setQrMode(false)}
            className="mt-4 h-12 items-center justify-center rounded-full bg-surface-container-high"
          >
            <Text className="font-black text-on-surface">
              Cancel QR Scan
            </Text>
          </Pressable>
        </View>
      )}
    </View>

    {/* Difficulty Selection */}
    {pendingTile && (
      <View className="mb-6 rounded-[2rem] bg-surface-container-lowest p-5">
        <Text className="mb-2 text-xs font-black uppercase tracking-widest text-on-surface-variant">
          Choose Difficulty
        </Text>

        <Text className="mb-5 text-xl font-black text-on-surface">
          {pendingTile.tile_name || pendingTile.name || 'Selected Tile'}
        </Text>

        <View className="gap-3">
          {pendingTile.available_difficulties.map((difficulty) => {
            const difficultyLabel =
              difficulty === 'easy'
                ? 'Easy'
                : difficulty === 'intermediate'
                  ? 'Intermediate'
                  : 'Hard'

            const difficultyColor =
              difficulty === 'easy'
                ? 'bg-green-600'
                : difficulty === 'intermediate'
                  ? 'bg-yellow-600'
                  : 'bg-red-600'

            return (
              <Pressable
                key={difficulty}
                onPress={() => loadQuestionByDifficulty(difficulty)}
                disabled={scanning || questionLockRef.current}
                className={`h-14 items-center justify-center rounded-full ${difficultyColor} ${
                  scanning || questionLockRef.current ? 'opacity-60' : ''
                }`}
              >
                <Text className="font-black text-white">{difficultyLabel}</Text>
              </Pressable>
            )
          })}
        </View>

        <Pressable
          onPress={() => {
            setPendingTile(null)
            setHasScanned(false)
            scanLockRef.current = false
            questionLockRef.current = false
          }}
          disabled={scanning}
          className="mt-4 h-12 items-center justify-center rounded-full bg-surface-container-high"
        >
          <Text className="font-black text-on-surface">
            Scan Another Code
          </Text>
        </Pressable>
      </View>
    )}

    {/* Status Box */}
    <View className="mt-2 rounded-3xl bg-surface-container-low p-6">
      {scanning ? (
        <View className="flex-row items-center gap-3">
          <ActivityIndicator />
          <Text className="font-bold text-on-surface">
            Checking code...
          </Text>
        </View>
      ) : (
        <Text className="text-center text-sm font-bold text-on-surface-variant">
          {isAndroid
            ? 'NFC tag or QR code should contain values like NFC_TILE_19, CC_007, or CH_001.'
            : 'QR code should contain values like NFC_TILE_19, CC_007, or CH_001.'}
        </Text>
      )}
    </View>

    {/* Cancel */}
    <Pressable
      onPress={() => router.back()}
      className="mt-6 h-14 items-center justify-center rounded-full bg-surface-container-high"
    >
      <Text className="font-black text-on-surface">
        Cancel
      </Text>
    </Pressable>
  </ScrollView>
)
}
