import React, { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native'
import { router } from 'expo-router'
import { useAuth } from '../src/context/AuthContext'

type AuthTab = 'login' | 'register'

export default function LoginScreen() {
  const { login, register } = useAuth()
  const { width } = useWindowDimensions()

  const isWideScreen = width >= 768

  const [activeTab, setActiveTab] = useState<AuthTab>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [registerName, setRegisterName] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('')

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Details', 'Please enter your email and password.')
      return
    }

    try {
      setSubmitting(true)
      await login(email.trim(), password)
      router.replace('/dashboard')
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Failed to login. Please try again.'

      Alert.alert('Login Failed', message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleRegister = async () => {
    if (
      !registerName.trim() ||
      !registerEmail.trim() ||
      !registerPassword.trim() ||
      !registerConfirmPassword.trim()
    ) {
      Alert.alert('Missing Details', 'Please complete all registration fields.')
      return
    }

    if (registerPassword !== registerConfirmPassword) {
      Alert.alert('Password Error', 'Passwords do not match.')
      return
    }

    if (registerPassword.length < 8) {
      Alert.alert('Password Error', 'Password must be at least 8 characters.')
      return
    }

    try {
      setSubmitting(true)

      await register({
        name: registerName.trim(),
        email: registerEmail.trim(),
        password: registerPassword,
        password_confirmation: registerConfirmPassword,
      })

      Alert.alert(
        'Registration Successful',
        'Your account has been created. Please login with your new account.'
      )

      setActiveTab('login')
      setEmail(registerEmail.trim())
      setPassword('')

      setRegisterName('')
      setRegisterEmail('')
      setRegisterPassword('')
      setRegisterConfirmPassword('')
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.email?.[0] ||
        error.response?.data?.errors?.password?.[0] ||
        error.response?.data?.errors?.name?.[0] ||
        'Failed to register. Please try again.'

      Alert.alert('Register Failed', message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
        }}
      >
        <View
          className={`w-full max-w-6xl overflow-hidden rounded-[2rem] bg-surface-container-low shadow-2xl ${
            isWideScreen ? 'flex-row' : 'flex-col'
          }`}
        >
          {isWideScreen && (
            <View className="relative flex-1 overflow-hidden bg-inverse-surface p-10">
              <View className="absolute inset-0 bg-black/50" />

              <View className="relative z-10 flex-1 items-center justify-center">
                <View className="items-center">
                  <View className="relative h-64 w-64 rotate-3 items-center justify-center overflow-hidden rounded-3xl bg-primary shadow-2xl">
                    <View className="absolute inset-0 bg-white/10" />

                    <View className="-rotate-3 items-center">
                      <Text className="text-[120px] font-black text-on-primary">
                        ◈
                      </Text>

                      <View className="absolute -bottom-1 -right-2 h-12 w-12 items-center justify-center rounded-full border-4 border-primary bg-tertiary">
                        <Text className="text-lg font-black text-white">
                          {'>_'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View className="mt-12 items-center">
                    <Text className="text-5xl font-black tracking-tighter text-on-primary">
                      CodeNopoly
                      <Text className="text-tertiary-container">_</Text>
                    </Text>

                    <Text className="mt-2 text-lg font-semibold uppercase tracking-[4px] text-outline-variant">
                      The Logic of Wealth
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          <View className="flex-1 justify-center bg-surface-container-lowest p-8 md:p-12">
            {!isWideScreen && (
              <View className="mb-10 items-center">
                <View className="mb-5 h-24 w-24 rotate-3 items-center justify-center rounded-3xl bg-primary shadow-lg">
                  <Text className="-rotate-3 text-5xl font-black text-on-primary">
                    ◈
                  </Text>
                </View>

                <Text className="text-4xl font-black tracking-tighter text-on-surface">
                  CodeNopoly
                  <Text className="text-tertiary">_</Text>
                </Text>

                <Text className="mt-1 text-xs font-bold uppercase tracking-[3px] text-on-surface-variant">
                  The Logic of Wealth
                </Text>
              </View>
            )}

            <View className="mb-10 flex-row items-end justify-between">
              <View>
                <Text className="text-4xl font-black tracking-tighter text-on-surface">
                  CodeNopoly
                </Text>
                <Text className="mt-1 text-base text-on-surface-variant">
                  Access the main frame
                </Text>
              </View>

              <View className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-surface-container-low sm:flex">
                <Text className="text-base font-black text-primary-dim">
                  {'>_'}
                </Text>
              </View>
            </View>

            <View className="mx-auto mb-10 w-full max-w-xs flex-row rounded-full bg-surface-container-low p-1.5">
              <Pressable
                onPress={() => setActiveTab('login')}
                className={`flex-1 rounded-full py-2 ${
                  activeTab === 'login'
                    ? 'bg-primary-container shadow-sm'
                    : ''
                }`}
              >
                <Text
                  className={`text-center text-sm font-bold ${
                    activeTab === 'login'
                      ? 'text-on-primary-container'
                      : 'text-on-surface-variant'
                  }`}
                >
                  Login
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setActiveTab('register')}
                className={`flex-1 rounded-full py-2 ${
                  activeTab === 'register'
                    ? 'bg-primary-container shadow-sm'
                    : ''
                }`}
              >
                <Text
                  className={`text-center text-sm font-bold ${
                    activeTab === 'register'
                      ? 'text-on-primary-container'
                      : 'text-on-surface-variant'
                  }`}
                >
                  Register
                </Text>
              </Pressable>
            </View>

            {activeTab === 'login' ? (
              <View className="gap-6">
                <View className="gap-4">
                  <View>
                    <Text className="mb-1 ml-1 text-xs font-black uppercase tracking-wider text-on-surface-variant">
                      Email Endpoint
                    </Text>

                    <TextInput
                      value={email}
                      onChangeText={setEmail}
                      placeholder="dev@pythonopoly.io"
                      placeholderTextColor="#727C86"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      className="h-14 rounded-xl bg-surface-container-highest px-6 text-on-surface"
                    />
                  </View>

                  <View>
                    <View className="mb-1 flex-row items-center justify-between px-1">
                      <Text className="text-xs font-black uppercase tracking-wider text-on-surface-variant">
                        Access Secret
                      </Text>

                      <Text className="text-xs font-bold text-primary">
                        Forgot Secret?
                      </Text>
                    </View>

                    <TextInput
                      value={password}
                      onChangeText={setPassword}
                      placeholder="••••••••"
                      placeholderTextColor="#727C86"
                      secureTextEntry
                      className="h-14 rounded-xl bg-surface-container-highest px-6 text-on-surface"
                    />
                  </View>
                </View>

                <Pressable
                  onPress={handleLogin}
                  disabled={submitting}
                  className={`h-14 flex-row items-center justify-center gap-2 rounded-full bg-primary shadow-lg ${
                    submitting ? 'opacity-60' : 'active:scale-[0.98]'
                  }`}
                >
                  {submitting ? (
                    <ActivityIndicator color="#F7F9FF" />
                  ) : (
                    <>
                      <Text className="text-lg font-black text-on-primary">
                        Execute Login
                      </Text>
                      <Text className="text-xl font-black text-on-primary">
                        ↪
                      </Text>
                    </>
                  )}
                </Pressable>
              </View>
            ) : (
              <View className="gap-5">
                <View className={`${isWideScreen ? 'flex-row' : 'flex-col'} gap-4`}>
                  <View className="flex-1">
                    <Text className="mb-1 ml-1 text-xs font-black uppercase tracking-wider text-on-surface-variant">
                      Handle
                    </Text>

                    <TextInput
                      value={registerName}
                      onChangeText={setRegisterName}
                      placeholder="py_coder"
                      placeholderTextColor="#727C86"
                      autoCapitalize="none"
                      className="h-14 rounded-xl bg-surface-container-highest px-6 text-on-surface"
                    />
                  </View>

                  <View className="flex-1">
                    <Text className="mb-1 ml-1 text-xs font-black uppercase tracking-wider text-on-surface-variant">
                      Email
                    </Text>

                    <TextInput
                      value={registerEmail}
                      onChangeText={setRegisterEmail}
                      placeholder="dev@mail.com"
                      placeholderTextColor="#727C86"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      className="h-14 rounded-xl bg-surface-container-highest px-6 text-on-surface"
                    />
                  </View>
                </View>

                <View>
                  <Text className="mb-1 ml-1 text-xs font-black uppercase tracking-wider text-on-surface-variant">
                    Access Secret
                  </Text>

                  <TextInput
                    value={registerPassword}
                    onChangeText={setRegisterPassword}
                    placeholder="••••••••"
                    placeholderTextColor="#727C86"
                    secureTextEntry
                    className="h-14 rounded-xl bg-surface-container-highest px-6 text-on-surface"
                  />
                </View>

                <View>
                  <Text className="mb-1 ml-1 text-xs font-black uppercase tracking-wider text-on-surface-variant">
                    Confirm Secret
                  </Text>

                  <TextInput
                    value={registerConfirmPassword}
                    onChangeText={setRegisterConfirmPassword}
                    placeholder="••••••••"
                    placeholderTextColor="#727C86"
                    secureTextEntry
                    className="h-14 rounded-xl bg-surface-container-highest px-6 text-on-surface"
                  />
                </View>

                <Pressable
                  onPress={handleRegister}
                  disabled={submitting}
                  className={`h-14 flex-row items-center justify-center gap-2 rounded-full bg-secondary shadow-lg ${
                    submitting ? 'opacity-60' : 'active:scale-[0.98]'
                  }`}
                >
                  {submitting ? (
                    <ActivityIndicator color="#FFF7FC" />
                  ) : (
                    <>
                      <Text className="text-lg font-black text-white">
                        Initialize Profile
                      </Text>
                      <Text className="text-xl font-black text-white">＋</Text>
                    </>
                  )}
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
