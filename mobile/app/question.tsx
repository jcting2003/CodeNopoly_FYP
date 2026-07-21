import React, { useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import api from '../src/services/api'
import { popup } from '../src/services/popup'

type SubmitAnswerResponse = {
  message?: string
  correct?: boolean
  is_correct?: boolean
  earned_credits?: number
  credits_awarded?: number
  feedback?: string
  explanation?: string
  ai_feedback?: string
}

type HintResponse = {
  hint: string
}

export default function QuestionScreen() {
  const params = useLocalSearchParams<{
    gameId: string
    questionId: string
    questionText: string
    questionType?: string
    difficulty?: string
    credits?: string
    optionA?: string
    optionB?: string
    optionC?: string
    optionD?: string
    tileName?: string
  }>()

  const gameId = Number(params.gameId)
  const questionId = Number(params.questionId)

  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [structuredAnswer, setStructuredAnswer] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loadingHint, setLoadingHint] = useState(false)
  const [questionHint, setQuestionHint] = useState('')
  const [result, setResult] = useState<SubmitAnswerResponse | null>(null)

  const questionType = params.questionType || 'mcq'
  const isCorrectAnswer = Boolean(result?.correct || result?.is_correct)

  const options = useMemo(() => {
    return [
      { key: 'A', value: params.optionA },
      { key: 'B', value: params.optionB },
      { key: 'C', value: params.optionC },
      { key: 'D', value: params.optionD },
    ].filter((option) => option.value && option.value.trim() !== '')
  }, [params.optionA, params.optionB, params.optionC, params.optionD])

  const submitAnswer = async () => {
    const answer =
      questionType === 'structured' ? structuredAnswer.trim() : selectedAnswer

    if (!answer) {
      popup.alert('Missing Answer', 'Please select or type your answer.')
      return
    }

    try {
      setSubmitting(true)

      const response = await api.post<SubmitAnswerResponse>(
        `/games/${gameId}/questions/${questionId}/submit`,
        {
          selected_answer: answer,
          answer,
        }
      )

      setResult(response.data)
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Failed to submit answer.'

      popup.alert('Submit Failed', message)
    } finally {
      setSubmitting(false)
    }
  }

  const getHint = async () => {
    try {
      setLoadingHint(true)
      setQuestionHint('')

      const response = await api.post<HintResponse>(
        `/games/${gameId}/questions/${questionId}/hint`
      )

      setQuestionHint(response.data.hint)
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to get hint.'

      popup.alert('Hint Failed', message)
    } finally {
      setLoadingHint(false)
    }
  }

  const goBackToGame = () => {
    router.replace({
      pathname: '/game-session/[id]',
      params: {
        id: String(gameId),
      },
    })
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingVertical: 48,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="mb-8">
        <Text className="text-xs font-black uppercase tracking-[3px] text-primary">
          Question.Execute()
        </Text>

        <Text className="mt-3 text-4xl font-black tracking-tighter text-on-surface">
          {params.tileName || 'Programming Challenge'}
        </Text>

        <View className="mt-5 flex-row gap-3">
          <View className="rounded-full bg-primary-container px-4 py-2">
            <Text className="text-xs font-black uppercase text-on-primary-container">
              {params.difficulty || 'normal'}
            </Text>
          </View>

          <View className="rounded-full bg-tertiary-container px-4 py-2">
            <Text className="text-xs font-black uppercase text-on-tertiary-container">
              {params.credits || 0} Cr
            </Text>
          </View>
        </View>
      </View>

      <View className="mb-6 rounded-[2rem] bg-surface-container-lowest p-7 shadow-sm">
        <Text className="mb-3 text-xs font-black uppercase tracking-widest text-on-surface-variant">
          Question
        </Text>

        <Text className="text-xl font-black leading-8 text-on-surface">
          {params.questionText}
        </Text>
      </View>

      {!result && questionType !== 'structured' && (
        <View className="mb-6 gap-4">
          {options.map((option) => {
            const selected = selectedAnswer === option.key

            return (
              <Pressable
                key={option.key}
                onPress={() => setSelectedAnswer(option.key)}
                className={`rounded-3xl border p-5 ${
                  selected
                    ? 'border-primary bg-primary-container'
                    : 'border-surface-container bg-white'
                }`}
              >
                <Text
                  className={`text-base font-black ${
                    selected ? 'text-on-primary-container' : 'text-on-surface'
                  }`}
                >
                  {option.key}. {option.value}
                </Text>
              </Pressable>
            )
          })}
        </View>
      )}

      {!result && questionType === 'structured' && (
        <View className="mb-6 rounded-3xl bg-white p-5">
          <Text className="mb-3 text-xs font-black uppercase tracking-widest text-on-surface-variant">
            Your Answer
          </Text>

          <TextInput
            value={structuredAnswer}
            onChangeText={setStructuredAnswer}
            placeholder="Type your answer here..."
            placeholderTextColor="#727C86"
            multiline
            textAlignVertical="top"
            className="min-h-40 rounded-2xl bg-surface-container-low p-4 text-base text-on-surface"
          />
        </View>
      )}

      {!result && questionType === 'structured' && (
        <Pressable
          onPress={getHint}
          disabled={loadingHint || submitting}
          className={`mb-4 h-14 items-center justify-center rounded-full border border-primary bg-white ${
            loadingHint || submitting ? 'opacity-60' : ''
          }`}
        >
          {loadingHint ? (
            <ActivityIndicator color="#205C90" />
          ) : (
            <Text className="text-base font-black text-primary">
              Use Hint
            </Text>
          )}
        </Pressable>
      )}

      {!result && questionHint ? (
        <View className="mb-6 rounded-3xl border border-yellow-200 bg-yellow-50 p-5">
          <Text className="mb-2 text-xs font-black uppercase tracking-widest text-yellow-800">
            Hint
          </Text>

          <Text className="text-base font-bold leading-7 text-yellow-900">
            {questionHint}
          </Text>
        </View>
      ) : null}

      {!result && (
        <Pressable
          onPress={submitAnswer}
          disabled={submitting || loadingHint}
          className={`h-16 items-center justify-center rounded-full bg-primary ${
            submitting || loadingHint ? 'opacity-60' : ''
          }`}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-lg font-black text-white">
              Submit Answer
            </Text>
          )}
        </Pressable>
      )}

      {result && (
        <View className="rounded-[2rem] bg-surface-container-lowest p-7 shadow-sm">
          <Text className="text-3xl font-black text-on-surface">
            {result.correct || result.is_correct ? 'Correct 🎉' : 'Submitted'}
          </Text>

          <Text className="mt-4 text-base font-bold leading-7 text-on-surface-variant">
            {result.feedback ||
              result.ai_feedback ||
              result.explanation ||
              result.message ||
              'Your answer has been submitted.'}
          </Text>

          <View
            className={`mt-5 rounded-2xl p-4 ${
              isCorrectAnswer ? 'bg-tertiary-container' : 'bg-error-container'
            }`}
          >
            <Text
              className={`text-sm font-black ${
                isCorrectAnswer
                  ? 'text-on-tertiary-container'
                  : 'text-on-error-container'
              }`}
            >
              Credits Earned:{' '}
              {result.earned_credits ?? result.credits_awarded ?? 0}
            </Text>
          </View>

          <Pressable
            onPress={goBackToGame}
            className="mt-6 h-14 items-center justify-center rounded-full bg-primary"
          >
            <Text className="font-black text-white">
              Back to Game
            </Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  )
}
