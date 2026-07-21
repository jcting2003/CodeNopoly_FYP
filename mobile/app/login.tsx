import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  Linking,
  useWindowDimensions,
  View,
} from 'react-native'
import { router, useRootNavigationState } from 'expo-router'
import { useAuth } from '../src/context/AuthContext'
import { popup } from '../src/services/popup'

type AuthTab = 'login' | 'register'

export default function LoginScreen() {
  const { user, loading, login, register, forgotPassword } = useAuth()
  const rootNavigationState = useRootNavigationState()
  const { width } = useWindowDimensions()

  const isWideScreen = width >= 900

  const [activeTab, setActiveTab] = useState<AuthTab>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [registerName, setRegisterName] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  const [forgotPasswordSubmitting, setForgotPasswordSubmitting] = useState(false)
  const [forgotPasswordLink, setForgotPasswordLink] = useState('')

  useEffect(() => {
    if (!loading && user && rootNavigationState?.key) {
      router.replace('/dashboard')
    }
  }, [loading, rootNavigationState?.key, user])

  const switchTab = (tab: AuthTab) => {
    setActiveTab(tab)
    setSuccessMessage('')
  }

  const handleLogin = async () => {
    setSuccessMessage('')

    if (!email.trim() || !password.trim()) {
      popup.alert('Missing Details', 'Please enter your email and password.')
      return
    }

    try {
      setSubmitting(true)
      await login(email.trim(), password)
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Failed to login. Please try again.'

      popup.alert('Login Failed', message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleRegister = async () => {
    setSuccessMessage('')

    if (
      !registerName.trim() ||
      !registerEmail.trim() ||
      !registerPassword.trim() ||
      !registerConfirmPassword.trim()
    ) {
      popup.alert('Missing Details', 'Please complete all registration fields.')
      return
    }

    if (registerPassword !== registerConfirmPassword) {
      popup.alert('Password Error', 'Passwords do not match.')
      return
    }

    if (registerPassword.length < 8) {
      popup.alert('Password Error', 'Password must be at least 8 characters.')
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

      setSuccessMessage('Registration successful. Please log in.')
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

      popup.alert('Register Failed', message)
    } finally {
      setSubmitting(false)
    }
  }

  const openForgotPasswordModal = () => {
    setSuccessMessage('')
    setForgotPasswordEmail(email.trim())
    setForgotPasswordLink('')
    setForgotPasswordVisible(true)
  }

  const closeForgotPasswordModal = () => {
    if (forgotPasswordSubmitting) {
      return
    }

    setForgotPasswordVisible(false)
  }

  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail.trim()) {
      popup.alert('Missing Email', 'Please enter the email address for your account.')
      return
    }

    try {
      setForgotPasswordSubmitting(true)
      const response = await forgotPassword(forgotPasswordEmail.trim())
      setSuccessMessage(response.message)
      setForgotPasswordLink(response.reset_url || '')

      if (!response.reset_url) {
        setForgotPasswordVisible(false)
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Unable to send a password reset link right now.'

      popup.alert('Reset Link Failed', message)
    } finally {
      setForgotPasswordSubmitting(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F7F9FF]">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="flex-grow items-center justify-center p-4"
        >
          <View
            className={`w-full max-w-[1100px] overflow-hidden rounded-[32px] bg-[#EEF4FC] shadow-lg ${
              isWideScreen ? 'flex-row' : 'max-w-[560px]'
            }`}
          >
            {isWideScreen ? (
              <View className="min-h-[620px] flex-1 overflow-hidden rounded-l-[32px] bg-[#0A0F13]">
                <View className="absolute inset-0 bg-black/35" />

                <View className="flex-1 items-center justify-center p-9">
                  <View className="relative h-[250px] w-[250px] rotate-3 items-center justify-center rounded-[28px] bg-[#1E6397]">
                    <View className="absolute inset-0 rounded-[28px] bg-white/10" />

                    <Text className="text-[110px] font-black text-[#F7F9FF]">
                      ◈
                    </Text>

                    <View className="absolute -bottom-2 -right-2 h-12 w-12 items-center justify-center rounded-full border-4 border-[#1E6397] bg-[#006E37]">
                      <Text className="text-base font-black text-white">
                        {'>_'}
                      </Text>
                    </View>
                  </View>

                  <View className="mt-9">
                    <Text className="text-center text-5xl font-black tracking-[-1.5px] text-[#F7F9FF]">
                      CodeNopoly<Text className="text-[#6BFE9C]">_</Text>
                    </Text>

                    <Text className="mt-3 text-center text-base font-bold uppercase tracking-[3px] text-[#A9B3BE]">
                      The Logic of Wealth
                    </Text>
                  </View>
                </View>
              </View>
            ) : null}

            <View
              className={`min-h-[620px] flex-1 justify-center bg-white px-7 py-10 ${
                isWideScreen ? 'rounded-r-[32px]' : 'rounded-[32px]'
              }`}
            >
              {!isWideScreen ? (
                <View className="mb-7 items-center">
                  <View className="mb-4 h-24 w-24 rotate-3 items-center justify-center rounded-3xl bg-[#1E6397]">
                    <Text className="-rotate-3 text-[50px] font-black text-[#F7F9FF]">
                      ◈
                    </Text>
                  </View>

                  <Text className="text-[38px] font-black tracking-[-1.2px] text-[#2A333C]">
                    CodeNopoly<Text className="text-[#006E37]">_</Text>
                  </Text>

                  <Text className="mt-1 text-[11px] font-extrabold uppercase tracking-[3px] text-[#56606A]">
                    The Logic of Wealth
                  </Text>
                </View>
              ) : null}

              <View className="mb-7 flex-row items-end justify-between">
                <View>
                  <Text className="text-4xl font-extrabold tracking-[-1px] text-[#2A333C]">
                    CodeNopoly
                  </Text>

                  <Text className="mt-1 text-base text-[#56606A]">
                    Access the main frame
                  </Text>
                </View>

                <View className="h-12 w-12 items-center justify-center rounded-[18px] bg-[#EEF4FC]">
                  <Text className="text-base font-extrabold text-[#04578A]">
                    {'>_'}
                  </Text>
                </View>
              </View>

              <View className="mb-7 flex-row rounded-full bg-[#EEF4FC] p-1.5">
                <Pressable
                  onPress={() => switchTab('login')}
                  className={`flex-1 items-center rounded-full py-2.5 ${
                    activeTab === 'login' ? 'bg-[#8CC6FF]' : ''
                  }`}
                >
                  <Text
                    className={`text-sm font-extrabold ${
                      activeTab === 'login'
                        ? 'text-[#003F67]'
                        : 'text-[#56606A]'
                    }`}
                  >
                    Login
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => switchTab('register')}
                  className={`flex-1 items-center rounded-full py-2.5 ${
                    activeTab === 'register' ? 'bg-[#8CC6FF]' : ''
                  }`}
                >
                  <Text
                    className={`text-sm font-extrabold ${
                      activeTab === 'register'
                        ? 'text-[#003F67]'
                        : 'text-[#56606A]'
                    }`}
                  >
                    Register
                  </Text>
                </Pressable>
              </View>

              {activeTab === 'login' ? (
                <View className="gap-5 pb-2">
                  <View className="gap-2">
                    <Text className="text-xs font-extrabold uppercase tracking-[1.2px] text-[#56606A]">
                      Email Endpoint
                    </Text>

                    <TextInput
                      value={email}
                      onChangeText={setEmail}
                      placeholder="dev@codenopoly.io"
                      placeholderTextColor="#727C86"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      className="h-14 rounded-xl bg-[#D9E4EF] px-[18px] text-base text-[#2A333C]"
                    />
                  </View>

                  <View className="gap-2">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-xs font-extrabold uppercase tracking-[1.2px] text-[#56606A]">
                        Access Secret
                      </Text>

                      <Pressable onPress={openForgotPasswordModal}>
                        <Text className="text-xs font-bold text-[#1E6397]">
                          Forgot Secret?
                        </Text>
                      </Pressable>
                    </View>

                    <TextInput
                      value={password}
                      onChangeText={setPassword}
                      placeholder="••••••••"
                      placeholderTextColor="#727C86"
                      secureTextEntry
                      className="h-14 rounded-xl bg-[#D9E4EF] px-[18px] text-base text-[#2A333C]"
                    />
                  </View>

                  {successMessage ? (
                    <Text className="text-sm font-semibold text-green-700">
                      {successMessage}
                    </Text>
                  ) : null}

                  <Pressable
                    onPress={handleLogin}
                    disabled={submitting}
                    className={`mt-3 h-[60px] items-center justify-center rounded-full border border-[#185B8A] bg-[#1F6FA8] shadow-lg ${
                      submitting ? 'opacity-85' : 'opacity-100 active:scale-[0.98]'
                    }`}
                  >
                    {submitting ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <View className="w-full flex-row items-center justify-center">
                        <Text className="text-[17px] font-black text-white">
                          Execute Login
                        </Text>
                        <Text className="ml-2.5 text-lg font-extrabold text-white">
                          ↪
                        </Text>
                      </View>
                    )}
                  </Pressable>
                </View>
              ) : (
                <View className="gap-5 pb-2">
                  <View
                    className={`gap-3.5 ${
                      isWideScreen ? 'flex-row' : 'flex-col'
                    }`}
                  >
                    <View className="flex-1 gap-2">
                      <Text className="text-xs font-extrabold uppercase tracking-[1.2px] text-[#56606A]">
                        Handle
                      </Text>

                      <TextInput
                        value={registerName}
                        onChangeText={setRegisterName}
                        placeholder="py_coder"
                        placeholderTextColor="#727C86"
                        autoCapitalize="none"
                        className="h-14 rounded-xl bg-[#D9E4EF] px-[18px] text-base text-[#2A333C]"
                      />
                    </View>

                    <View className="flex-1 gap-2">
                      <Text className="text-xs font-extrabold uppercase tracking-[1.2px] text-[#56606A]">
                        Email
                      </Text>

                      <TextInput
                        value={registerEmail}
                        onChangeText={setRegisterEmail}
                        placeholder="dev@mail.com"
                        placeholderTextColor="#727C86"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        className="h-14 rounded-xl bg-[#D9E4EF] px-[18px] text-base text-[#2A333C]"
                      />
                    </View>
                  </View>

                  <View className="gap-2">
                    <Text className="text-xs font-extrabold uppercase tracking-[1.2px] text-[#56606A]">
                      Access Secret
                    </Text>

                    <TextInput
                      value={registerPassword}
                      onChangeText={setRegisterPassword}
                      placeholder="••••••••"
                      placeholderTextColor="#727C86"
                      secureTextEntry
                      className="h-14 rounded-xl bg-[#D9E4EF] px-[18px] text-base text-[#2A333C]"
                    />
                  </View>

                  <View className="gap-2">
                    <Text className="text-xs font-extrabold uppercase tracking-[1.2px] text-[#56606A]">
                      Confirm Secret
                    </Text>

                    <TextInput
                      value={registerConfirmPassword}
                      onChangeText={setRegisterConfirmPassword}
                      placeholder="••••••••"
                      placeholderTextColor="#727C86"
                      secureTextEntry
                      className="h-14 rounded-xl bg-[#D9E4EF] px-[18px] text-base text-[#2A333C]"
                    />
                  </View>

                  <Pressable
                    onPress={handleRegister}
                    disabled={submitting}
                    className={`mt-3 h-[60px] items-center justify-center rounded-full border border-[#0B5F59] bg-[#0F766E] shadow-lg ${
                      submitting ? 'opacity-85' : 'opacity-100 active:scale-[0.98]'
                    }`}
                  >
                    {submitting ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <View className="w-full flex-row items-center justify-center">
                        <Text className="text-[17px] font-black text-white">
                          Initialize Profile
                        </Text>
                        <Text className="ml-2.5 text-lg font-extrabold text-white">
                          👤+
                        </Text>
                      </View>
                    )}
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        transparent
        visible={forgotPasswordVisible}
        animationType="fade"
        onRequestClose={closeForgotPasswordModal}
      >
        <View className="flex-1 items-center justify-center bg-black/55 px-6">
          <View className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-lg">
            <Text className="text-2xl font-black tracking-[-0.8px] text-[#2A333C]">
              Reset Secret
            </Text>

            <Text className="mt-3 text-sm leading-6 text-[#56606A]">
              Enter your account email and we&apos;ll send you a password reset link.
            </Text>

            <View className="mt-5 gap-2">
              <Text className="text-xs font-extrabold uppercase tracking-[1.2px] text-[#56606A]">
                Email Endpoint
              </Text>

              <TextInput
                value={forgotPasswordEmail}
                onChangeText={setForgotPasswordEmail}
                placeholder="dev@codenopoly.io"
                placeholderTextColor="#727C86"
                keyboardType="email-address"
                autoCapitalize="none"
                className="h-14 rounded-xl bg-[#D9E4EF] px-[18px] text-base text-[#2A333C]"
              />
            </View>

            {forgotPasswordLink ? (
              <View className="mt-4 rounded-2xl bg-[#EEF4FC] p-4">
                <Text className="text-xs font-extrabold uppercase tracking-[1.2px] text-[#56606A]">
                  Development Reset Link
                </Text>

                <Text selectable className="mt-2 text-sm leading-6 text-[#1E6397]">
                  {forgotPasswordLink}
                </Text>

                <Pressable
                  onPress={() => {
                    void Linking.openURL(forgotPasswordLink)
                  }}
                  className="mt-4 h-12 items-center justify-center rounded-full bg-[#1F6FA8]"
                >
                  <Text className="text-sm font-black text-white">
                    Open Reset Page
                  </Text>
                </Pressable>
              </View>
            ) : null}

            <View className="mt-6 flex-row gap-3">
              <Pressable
                onPress={closeForgotPasswordModal}
                disabled={forgotPasswordSubmitting}
                className="h-14 flex-1 items-center justify-center rounded-full bg-[#D9E4EF]"
              >
                <Text className="text-base font-black text-[#2A333C]">
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                onPress={handleForgotPassword}
                disabled={forgotPasswordSubmitting}
                className={`h-14 flex-1 items-center justify-center rounded-full bg-[#1F6FA8] ${
                  forgotPasswordSubmitting ? 'opacity-85' : 'opacity-100'
                }`}
              >
                {forgotPasswordSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="text-base font-black text-white">
                    Send Link
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}
