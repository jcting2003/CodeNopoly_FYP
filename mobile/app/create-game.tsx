import React, { useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from 'react-native'
import { router } from 'expo-router'
import api from '../src/services/api'
import { popup } from '../src/services/popup'

type CreateGameResponse = {
  message: string
  game: {
    id: number
    game_code: string
    status: string
    host_id: number
    host_joined_as_player?: boolean
    started_at: string | null
    ended_at: string | null
  }
}

export default function CreateGameScreen() {
  const [loading, setLoading] = useState(false)
  const [joinAsPlayer, setJoinAsPlayer] = useState(false)

  const handleCreateGame = async () => {
    try {
      setLoading(true)

      const response = await api.post<CreateGameResponse>('/games', {
        join_as_player: joinAsPlayer,
      })

      popup.alert(
        'Game Created',
        response.data.message || 'Game created successfully.',
        [
          {
            text: 'Open Lobby',
            onPress: () => {
              router.replace({
                pathname: '/game-lobby/[id]',
                params: {
                  id: String(response.data.game.id),
                  code: response.data.game.game_code,
                },
              })
            },
          },
        ]
      )
    } catch (error: any) {
      popup.alert(
        'Create Game Failed',
        error.response?.data?.message || 'Failed to create game.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 32,
      }}
    >
      <View className="mb-6">
        <Pressable
          onPress={() => router.back()}
          className="self-start rounded-full bg-surface-container-low px-5 py-3 active:scale-[0.98]"
        >
          <Text className="text-sm font-black text-on-surface">Back</Text>
        </Pressable>
      </View>

      <View className="rounded-[32px] bg-surface-container-lowest px-8 py-10 shadow-lg">
        <View className="items-center">
          <View className="mb-8 h-24 w-24 items-center justify-center rounded-[24px] bg-primary-container">
            <View className="h-11 w-11 items-center justify-center rounded-full bg-primary">
              <Text className="text-2xl font-black text-white">+</Text>
            </View>
          </View>

          <Text className="text-xs font-black uppercase tracking-[3px] text-primary">
            Initialize Instance
          </Text>
          <Text className="mt-3 text-center text-4xl font-black text-on-surface">
            Ready to play?
          </Text>
          <Text className="mt-4 text-center text-base leading-7 text-on-surface-variant">
            Generate a unique session code to invite your fellow developers.
          </Text>
        </View>

        <View className="mt-10 rounded-[24px] bg-surface-container-low p-5">
          <View className="flex-row items-start justify-between gap-4">
            <View className="flex-1">
              <Text className="text-base font-black text-on-surface">
                Join as player
              </Text>
              <Text className="mt-2 text-sm leading-6 text-on-surface-variant">
                Turn this on only if the host also wants to participate in the match.
              </Text>
            </View>

            <Switch
              value={joinAsPlayer}
              onValueChange={setJoinAsPlayer}
            />
          </View>
        </View>

        <Pressable
          onPress={handleCreateGame}
          disabled={loading}
          className="mt-8 h-16 items-center justify-center rounded-full bg-primary active:scale-[0.98]"
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-lg font-black text-white">Create Game</Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  )
}
