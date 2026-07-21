import React, { useRef, useState } from 'react'
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { router } from 'expo-router'
import api from '../src/services/api'
import { popup } from '../src/services/popup'

type JoinGameResponse = {
  message?: string
  game?: {
    id: number
    game_code: string
    status: string
  }
  game_id?: number
  game_code?: string
  status?: string
}

export default function JoinGameScreen() {
  const [permission, requestPermission] = useCameraPermissions()

  const [gameCode, setGameCode] = useState('')
  const [joining, setJoining] = useState(false)
  const [scannerOpen, setScannerOpen] = useState(false)
  const [hasScanned, setHasScanned] = useState(false)
  const scanLockRef = useRef(false)

  const joinGame = async (code: string) => {
    const cleanedCode = code.trim().toUpperCase()

    if (!cleanedCode) {
      popup.alert('Missing Game Code', 'Please enter or scan a game code.')
      return
    }

    try {
      setJoining(true)

      const response = await api.post<JoinGameResponse>('/games/join', {
        game_code: cleanedCode,
      })

      const joinedGameId = response.data.game?.id || response.data.game_id
      const joinedGameCode =
        response.data.game?.game_code || response.data.game_code || cleanedCode

      if (joinedGameId) {
        popup.alert('Joined Game', `You joined game ${joinedGameCode}.`)

        router.replace({
          pathname: '/game-lobby/[id]',
          params: {
            id: String(joinedGameId),
          },
        })

        return
      }

      popup.alert('Joined Game', `You joined game ${joinedGameCode}.`)
      router.replace('/dashboard')
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Failed to join game. Please try again.'

      popup.alert('Join Failed', message)
      scanLockRef.current = false
      setHasScanned(false)
    } finally {
      setJoining(false)
      setScannerOpen(false)
    }
  }

  const handleScannedCode = async (data: string) => {
    if (scanLockRef.current || hasScanned || joining) return

    scanLockRef.current = false
    setHasScanned(true)
    setScannerOpen(false)

    const cleanedCode = data.trim().toUpperCase()
    setGameCode(cleanedCode)

    await joinGame(cleanedCode)
  }

  const openScanner = async () => {
    if (!permission?.granted) {
      const result = await requestPermission()

      if (!result.granted) {
        popup.alert(
          'Camera Permission Required',
          'Please allow camera access to scan the game QR code.'
        )
        return
      }
    }

    setHasScanned(false)
    setScannerOpen(true)
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingVertical: 48,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-primary-container opacity-20" />
        <View className="absolute top-80 -right-32 h-80 w-80 rounded-full bg-secondary-container opacity-30" />
        <View className="absolute bottom-16 left-10 h-56 w-56 rounded-full bg-tertiary-container opacity-20" />

        <View className="mb-10 mt-8">
          <Text className="mb-3 text-xs font-black uppercase tracking-[3px] text-secondary">
            Game.Connect()
          </Text>

          <Text className="text-5xl font-black leading-tight tracking-tighter text-on-surface">
            Join Game
          </Text>

          <Text className="mt-5 text-base leading-7 text-on-surface-variant">
            Scan the QR code shown by the host, or enter the game code manually.
          </Text>
        </View>

        <View className="mb-8 overflow-hidden rounded-3xl bg-surface-container-lowest shadow-lg">
          <View className="h-2 w-full bg-secondary" />

          <View className="p-7">
            <View className="mb-6 h-16 w-16 items-center justify-center rounded-2xl bg-secondary-container">
              <Text className="text-3xl font-black text-secondary">⌁</Text>
            </View>

            <Text className="mb-3 text-3xl font-black text-on-surface">
              Enter Room Code
            </Text>

            <Text className="mb-6 text-sm leading-6 text-on-surface-variant">
              Ask your host for the game code, or scan the QR code from the lobby.
            </Text>

            <Text className="mb-2 ml-1 text-xs font-black uppercase tracking-widest text-on-surface-variant">
              Game Code
            </Text>

            <TextInput
              value={gameCode}
              onChangeText={(value) => setGameCode(value.toUpperCase())}
              placeholder="Example: VISHIR"
              placeholderTextColor="#727C86"
              autoCapitalize="characters"
              className="mb-5 h-14 rounded-xl bg-surface-container-highest px-5 text-lg font-black tracking-[2px] text-on-surface"
            />

            <Pressable
              onPress={() => joinGame(gameCode)}
              disabled={joining}
              className={`mb-4 h-14 flex-row items-center justify-center gap-2 rounded-full bg-secondary shadow-lg ${
                joining ? 'opacity-60' : 'active:scale-[0.98]'
              }`}
            >
              {joining ? (
                <ActivityIndicator color="#FFF7FC" />
              ) : (
                <>
                  <Text className="text-lg font-black text-on-secondary">
                    Join Session
                  </Text>
                  <Text className="text-xl font-black text-on-secondary">→</Text>
                </>
              )}
            </Pressable>

            <Pressable
              onPress={openScanner}
              disabled={joining}
              className="h-14 flex-row items-center justify-center gap-2 rounded-full border border-outline-variant bg-white active:scale-[0.98]"
            >
              <Text className="text-lg font-black text-secondary">
                Scan QR Code
              </Text>
              <Text className="text-xl font-black text-secondary">▣</Text>
            </Pressable>
          </View>
        </View>

        <View className="rounded-3xl bg-surface-container-lowest p-6 shadow-sm">
          <View className="mb-4 h-12 w-12 items-center justify-center rounded-xl bg-tertiary-container">
            <Text className="text-2xl font-black text-tertiary">✓</Text>
          </View>

          <Text className="text-xl font-black text-on-surface">
            How it works
          </Text>

          <Text className="mt-2 text-sm leading-6 text-on-surface-variant">
            The QR code should contain the game code only. After joining, the game
            will appear in your active sessions.
          </Text>
        </View>
      </ScrollView>

      <Modal
        visible={scannerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setScannerOpen(false)}
      >
        <View className="flex-1 items-center justify-center bg-black/55 px-5">
          <View className="w-full max-w-md overflow-hidden rounded-3xl bg-surface-container-lowest shadow-lg">
            <View className="h-2 w-full bg-primary" />

            <View className="p-5">
              <View className="mb-4 flex-row items-center justify-between">
                <View>
                  <Text className="text-xl font-black text-on-surface">
                    QR Scanner
                  </Text>
                  <Text className="mt-1 text-sm text-on-surface-variant">
                    Point your camera at the game code QR.
                  </Text>
                </View>

                <Pressable
                  onPress={() => setScannerOpen(false)}
                  className="h-10 w-10 items-center justify-center rounded-full bg-surface-container-highest"
                >
                  <Text className="text-lg font-black text-on-surface">×</Text>
                </Pressable>
              </View>

              <View className="h-80 overflow-hidden rounded-3xl bg-black">
                <CameraView
                  style={{ flex: 1 }}
                  barcodeScannerSettings={{
                    barcodeTypes: ['qr'],
                  }}
                  onBarcodeScanned={({ data }) => handleScannedCode(data)}
                />
              </View>

              <Text className="mt-4 text-center text-xs font-bold uppercase tracking-widest text-outline">
                Waiting for QR code...
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}
