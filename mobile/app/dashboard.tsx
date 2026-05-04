import React from 'react'
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native'
import { router } from 'expo-router'
import { useAuth } from '../src/context/AuthContext'

export default function DashboardScreen() {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      router.replace('/login')
    } catch {
      Alert.alert('Logout Failed', 'Unable to logout. Please try again.')
    }
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="min-h-screen px-6 py-12"
    >
      {/* Background glow elements */}
      <View className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-primary-container opacity-20" />
      <View className="absolute top-80 -right-32 h-80 w-80 rounded-full bg-secondary-container opacity-30" />
      <View className="absolute bottom-16 left-10 h-56 w-56 rounded-full bg-tertiary-container opacity-20" />

      {/* Header */}
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

      {/* Main Join Game Card */}
      <View className="mb-10">
        <Pressable
          onPress={() => router.push('/join-game')}
          className="group relative h-80 overflow-hidden rounded-2xl bg-surface-container-lowest shadow-lg active:scale-[0.98]"
        >
          {/* Top secondary gradient style */}
          <View className="h-2 w-full bg-secondary" />

          <View className="flex-1 p-8">
            <View className="mb-auto">
              <View className="mb-5 h-16 w-16 items-center justify-center rounded-2xl bg-secondary-container">
                <Text className="text-4xl font-black text-secondary">⌘</Text>
              </View>

              <Text className="mb-3 text-3xl font-black text-on-surface">
                Join Game
              </Text>

              <Text className="text-sm leading-6 text-on-surface-variant">
                Connect to an active Pythonopoly session using a Room ID or game
                code provided by your host.
              </Text>
            </View>

            <View className="mt-8 flex-row items-center justify-between rounded-2xl bg-surface-container-low px-5 py-4">
              <View>
                <Text className="text-[11px] font-black uppercase tracking-widest text-outline">
                  Next Action
                </Text>

                <Text className="mt-1 text-lg font-black text-secondary">
                  Scan Qr Code to join the game!
                </Text>
              </View>

              <View className="h-12 w-12 items-center justify-center rounded-full bg-secondary">
                <Text className="text-2xl font-black text-on-secondary">→</Text>
              </View>
            </View>
          </View>
        </Pressable>
      </View>

      {/* Mobile companion info */}
      <View className="mb-8 rounded-3xl bg-surface-container-lowest p-6 shadow-sm">
        <View className="mb-4 h-12 w-12 items-center justify-center rounded-xl bg-tertiary-container">
          <Text className="text-2xl font-black text-tertiary">✓</Text>
        </View>

        <Text className="text-xl font-black text-on-surface">
          Mobile Companion
        </Text>

        <Text className="mt-2 text-sm leading-6 text-on-surface-variant">
          Use this app to join a game, scan physical board QR tiles, choose a
          challenge difficulty, and answer questions.
        </Text>
      </View>

      {/* Logout card styled closer to web action cards, but smaller */}
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