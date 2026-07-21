import React, { useEffect, useMemo, useState } from 'react'
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native'
import {
  PopupButton,
  PopupConfig,
  setPopupHandler,
} from '../services/popup'

type PopupProviderProps = {
  children: React.ReactNode
}

const DEFAULT_BUTTON: PopupButton = {
  text: 'OK',
}

const getButtonClassName = (style?: PopupButton['style']) => {
  if (style === 'destructive') {
    return 'bg-error'
  }

  if (style === 'cancel') {
    return 'bg-surface-container-high text-on-surface'
  }

  return 'bg-primary'
}

const getButtonTextClassName = (style?: PopupButton['style']) => {
  if (style === 'cancel') {
    return 'text-on-surface'
  }

  return 'text-white'
}

export function PopupProvider({ children }: PopupProviderProps) {
  const [queue, setQueue] = useState<PopupConfig[]>([])

  useEffect(() => {
    setPopupHandler((config) => {
      setQueue((currentQueue) => [...currentQueue, config])
    })

    return () => {
      setPopupHandler(null)
    }
  }, [])

  const activePopup = queue[0] ?? null

  const buttons = useMemo(() => {
    if (!activePopup) return []
    return activePopup.buttons?.length
      ? activePopup.buttons
      : [DEFAULT_BUTTON]
  }, [activePopup])

  const dismissActivePopup = () => {
    setQueue((currentQueue) => currentQueue.slice(1))
  }

  const handleButtonPress = async (button: PopupButton) => {
    dismissActivePopup()
    await button.onPress?.()
  }

  return (
    <>
      {children}

      <Modal
        transparent
        visible={Boolean(activePopup)}
        animationType="fade"
        onRequestClose={() => {
          const cancelButton = buttons.find((button) => button.style === 'cancel')
          if (cancelButton) {
            void handleButtonPress(cancelButton)
            return
          }

          dismissActivePopup()
        }}
      >
        <View className="flex-1 items-center justify-center bg-black/55 px-6">
          <View className="w-full max-w-md overflow-hidden rounded-[2rem] bg-surface-container-lowest shadow-lg">
            <View className="h-2 w-full bg-primary" />

            <ScrollView
              contentContainerStyle={{ padding: 24 }}
              bounces={false}
            >
              <View className="items-center">
                <View className="mb-5 h-16 w-16 items-center justify-center rounded-2xl bg-primary-container">
                  <Text className="text-3xl font-black text-primary">
                    !
                  </Text>
                </View>

                <Text className="text-center text-3xl font-black tracking-tight text-on-surface">
                  {activePopup?.title}
                </Text>

                {activePopup?.message ? (
                  <Text className="mt-4 text-center text-base leading-7 text-on-surface-variant">
                    {activePopup.message}
                  </Text>
                ) : null}
              </View>

              <View className="mt-8 gap-3">
                {buttons.map((button, index) => (
                  <Pressable
                    key={`${button.text}-${index}`}
                    onPress={() => {
                      void handleButtonPress(button)
                    }}
                    className={`h-14 items-center justify-center rounded-full ${
                      getButtonClassName(button.style)
                    }`}
                  >
                    <Text
                      className={`text-base font-black ${
                        getButtonTextClassName(button.style)
                      }`}
                    >
                      {button.text}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  )
}
