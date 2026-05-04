import '../global.css'
import { Stack } from 'expo-router'
import { AuthProvider } from '../src/context/AuthContext'

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="login"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="dashboard"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="join-game"
          options={{ title: 'Join Game' }}
        />

        <Stack.Screen
          name="game-lobby/[id]"
          options={{ title: 'Game Lobby' }}
        />

        <Stack.Screen
          name="my-games"
          options={{ title: 'My Games' }}
        />

        <Stack.Screen
          name="profile"
          options={{ title: 'Profile' }}
        />

        <Stack.Screen
          name="game-session/[id]"
          options={{ title: 'Game Session' }}
        />

        <Stack.Screen
          name="scanner/[id]"
          options={{ title: 'QR Scanner' }}
        />

        <Stack.Screen
          name="question"
          options={{ title: 'Question' }}
        />
      </Stack>
    </AuthProvider>
  )
}