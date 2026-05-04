import { Redirect } from 'expo-router'
import { ActivityIndicator, View } from 'react-native'
import { useAuth } from '../src/context/AuthContext'

export default function Index() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (user) {
    return <Redirect href="/dashboard" />
  }

  return <Redirect href="/login" />
}