import React, { useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { router, useLocalSearchParams } from 'expo-router'
import api from '../../src/services/api'
import { popup } from '../../src/services/popup'

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
  const [nfcModalVisible, setNfcModalVisible] = useState(false)
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
          popup.alert('Card Not Found', 'No card was returned for this code.')
          scanLockRef.current = false
          setHasScanned(false)
          return
        }

        setQrMode(false)
        setNfcModalVisible(false)

        popup.alert(
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
        popup.alert('Tile Not Found', 'No tile was returned for this code.')
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
        popup.alert(
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
        setNfcModalVisible(false)
        } catch (error: any) {
          if (error.response?.status === 429) {
            popup.alert(
              'Too Many Requests',
              'Please wait around 1 minute before trying again.'
            )
          } else {
            const message =
              error.response?.data?.message || 'Failed to check this code.'

            popup.alert('Scan Failed', message)
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
      popup.alert(
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
        popup.alert('No Question', 'No question was returned for this difficulty.')
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
        popup.alert(
          'Too Many Requests',
          'Please wait around 1 minute before trying again.'
        )
      } else {
        const message =
          error.response?.data?.message || 'Failed to load question.'

        popup.alert('Question Failed', message)
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
    popup.alert(
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
      popup.alert('NFC Not Supported', 'This Android phone does not support NFC.')
      return
    }

    const enabled = await NfcManager.isEnabled()

    if (!enabled) {
      popup.alert('NFC Disabled', 'Please turn on NFC in your Android settings.')
      return
    }

    setQrMode(false)
    await NfcManager.requestTechnology(NfcTech.Ndef)

    const tag = await NfcManager.getTag()

    console.log('NFC TAG:', tag)

    const record = tag?.ndefMessage?.[0]

    if (!record?.payload) {
      popup.alert('No NFC Data', 'This NFC tag does not contain a text record.')
      return
    }

    const rawPayload = record.payload as unknown as number[]
    const payload = new Uint8Array(rawPayload)
    const value = Ndef.text.decodePayload(payload).trim().toUpperCase()

    if (!value) {
      popup.alert('Empty NFC Tag', 'No tile or card code was found.')
      return
    }

    setQrMode(false)
    scanTile(value)
  } catch (error: any) {
    console.log('NFC READ ERROR:', error)

    popup.alert(
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
        popup.alert(
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
      popup.alert('Invalid QR Code', 'The QR code does not contain a valid value.')
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

    <View className="mb-6 rounded-[2rem] bg-primary-container p-5">
      <Text className="text-xs font-black uppercase tracking-[3px] text-on-primary-container">
        When To Scan
      </Text>

      <Text className="mt-3 text-base font-black leading-7 text-on-primary-container">
        Scan only after you roll the dice and move to your current board tile.
      </Text>

      <Text className="mt-3 text-sm leading-6 text-on-primary-container/80">
        1. Roll dice on the game board.
      </Text>
      <Text className="text-sm leading-6 text-on-primary-container/80">
        2. Find the tile you landed on.
      </Text>
      <Text className="text-sm leading-6 text-on-primary-container/80">
        3. Tap NFC or open the QR scanner to verify that tile.
      </Text>
    </View>

    {/* NFC Scan Mode */}
    {isAndroid && (
      <View className="mb-6 rounded-[2rem] bg-surface-container-lowest p-5">
        <Text className="mb-3 text-xs font-black uppercase tracking-widest text-on-surface-variant">
          NFC Scan Mode
        </Text>

        <Text className="mb-4 text-sm leading-6 text-on-surface-variant">
          Use this only when you are standing on the real board tile and ready to verify it.
        </Text>

        <Pressable
          onPress={() => setNfcModalVisible(true)}
          disabled={scanning || hasScanned || !!pendingTile}
          className={`h-14 items-center justify-center rounded-full bg-tertiary ${
            scanning || hasScanned || pendingTile ? 'opacity-60' : ''
          }`}
        >
          <Text className="font-black text-white">
            Verify Tile With NFC
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

      <Text className="mb-4 text-sm leading-6 text-on-surface-variant">
        Use this when the tile has a QR code and you are ready to scan the tile you landed on.
      </Text>

      <Pressable
        onPress={startQrScanner}
        disabled={scanning || hasScanned || !!pendingTile}
        className={`h-14 items-center justify-center rounded-full bg-primary ${
          scanning || hasScanned || pendingTile ? 'opacity-60' : ''
        }`}
      >
        <Text className="font-black text-white">
          Open QR Scanner
        </Text>
      </Pressable>
    </View>

    {/* Difficulty Selection */}
    {pendingTile && (
      <View className="mb-6 rounded-[2rem] bg-surface-container-lowest p-5">
        <Text className="mb-2 text-xs font-black uppercase tracking-widest text-on-surface-variant">
          Tile Verified
        </Text>

        <Text className="mb-5 text-xl font-black text-on-surface">
          {pendingTile.tile_name || pendingTile.name || 'Selected Tile'}
        </Text>

        <Text className="mb-5 text-sm leading-6 text-on-surface-variant">
          Your tile has been confirmed. Choose a difficulty to continue to the question.
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
            ? 'Need a reminder? Roll first, then scan the exact tile you landed on. Valid codes can look like NFC_TILE_19, CC_007, or CH_001.'
            : 'Roll first, then scan the exact tile you landed on. Valid QR codes can look like NFC_TILE_19, CC_007, or CH_001.'}
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

    <Modal
      visible={nfcModalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        if (!scanning) {
          setNfcModalVisible(false)
        }
      }}
    >
      <View className="flex-1 items-center justify-center bg-black/55 px-6">
        <View className="w-full max-w-sm rounded-[2rem] bg-surface-container-lowest p-6">
          <Text className="text-xs font-black uppercase tracking-[3px] text-tertiary">
            NFC Ready
          </Text>

          <Text className="mt-3 text-3xl font-black tracking-tight text-on-surface">
            Verify your current tile
          </Text>

          <Text className="mt-3 text-sm leading-6 text-on-surface-variant">
            Hold your phone close to the NFC tag on the tile you landed on, then keep it still until the scan completes.
          </Text>

          <View className="mt-6 rounded-[2rem] bg-tertiary-container px-6 py-8">
            <View className="items-center justify-center">
              <View className="absolute h-40 w-40 rounded-full bg-white/25" />
              <View className="absolute h-28 w-28 rounded-full border border-white/40" />

              <View className="w-28 rounded-[1.75rem] bg-slate-950 px-2 py-3 shadow-lg">
                <View className="mb-3 h-1.5 w-10 self-center rounded-full bg-slate-700" />
                <View className="h-40 rounded-[1.25rem] bg-white items-center justify-center">
                  <Text className="text-5xl">📶</Text>
                </View>
              </View>

              <View className="mt-5 h-14 w-24 items-center justify-center rounded-2xl border-2 border-dashed border-on-tertiary-container/45 bg-white/45">
                <Text className="text-2xl">🏷️</Text>
              </View>

              <Text className="mt-4 text-center text-xs font-black uppercase tracking-[3px] text-on-tertiary-container/70">
                Phone to tag
              </Text>
            </View>

            <Text className="mt-5 text-center text-lg font-black text-on-tertiary-container">
              Tap Now
            </Text>
            <Text className="mt-2 text-center text-sm font-bold text-on-tertiary-container/75">
              Bring the top of your phone close to the NFC sticker
            </Text>
          </View>

          <View className="mt-6 gap-3">
            <Pressable
              onPress={readNfcTag}
              disabled={scanning}
              className={`h-14 items-center justify-center rounded-full bg-tertiary ${
                scanning ? 'opacity-60' : ''
              }`}
            >
              {scanning ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="font-black text-white">
                  Scan This Tile
                </Text>
              )}
            </Pressable>

            <Pressable
              onPress={() => setNfcModalVisible(false)}
              disabled={scanning}
              className={`h-12 items-center justify-center rounded-full bg-surface-container-high ${
                scanning ? 'opacity-60' : ''
              }`}
            >
              <Text className="font-black text-on-surface">
                Cancel
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>

    <Modal
      visible={qrMode}
      transparent
      animationType="slide"
      onRequestClose={() => setQrMode(false)}
    >
      <View className="flex-1 bg-black/70 px-4 py-8">
        <View className="flex-1 overflow-hidden rounded-[2rem] bg-surface-container-lowest">
          <View className="flex-row items-center justify-between px-5 py-4">
            <View>
              <Text className="text-xs font-black uppercase tracking-[3px] text-primary">
                QR Scanner
              </Text>
              <Text className="mt-1 text-2xl font-black text-on-surface">
                Verify your current tile
              </Text>
            </View>

            <Pressable
              onPress={() => setQrMode(false)}
              className="h-10 w-10 items-center justify-center rounded-full bg-surface-container-high"
            >
              <Text className="text-xl font-black text-on-surface">X</Text>
            </Pressable>
          </View>

          <View className="mx-5 mb-5 flex-1 overflow-hidden rounded-[2rem] bg-black">
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

            <View className="absolute inset-x-0 top-6 items-center">
              <Text className="rounded-full bg-black/55 px-4 py-2 text-xs font-black uppercase tracking-[3px] text-white">
                Align the tile QR inside the frame
              </Text>
            </View>

            <View className="absolute inset-0 items-center justify-center">
              <View className="h-64 w-64 rounded-[2rem] border-2 border-white/90 bg-transparent" />
            </View>

            {scanning && (
              <View className="absolute inset-0 items-center justify-center bg-black/40">
                <ActivityIndicator color="#FFFFFF" size="large" />
                <Text className="mt-3 font-black text-white">
                  Checking code...
                </Text>
              </View>
            )}
          </View>

          <View className="px-5 pb-5">
            <Pressable
              onPress={() => setQrMode(false)}
              className="h-12 items-center justify-center rounded-full bg-surface-container-high"
            >
              <Text className="font-black text-on-surface">
                Cancel QR Scan
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  </ScrollView>
)
}
