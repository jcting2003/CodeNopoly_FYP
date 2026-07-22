import { useLocalSearchParams } from 'expo-router'
import { Text, View } from 'react-native'

export default function ScannerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()

  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <Text className="text-3xl font-black text-on-surface">
        Scanner for Game #{id}
      </Text>
    </View>
  )
}