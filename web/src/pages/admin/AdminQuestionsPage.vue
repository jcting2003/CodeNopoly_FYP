<template>
  <div class="min-h-screen bg-background text-on-surface">
    <NavBar />

    <main class="pt-28 px-8 max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <div>
          <p class="text-sm uppercase tracking-widest text-primary font-bold">
            Admin Panel
          </p>

          <h1 class="text-5xl font-headline font-bold">
            Question Bank
          </h1>

          <p class="text-on-surface-variant mt-3">
            Add, edit, or delete MCQ and structured questions in the question bank.
          </p>
        </div>

        <div class="flex gap-3">
          <button
            type="button"
            @click="handleAddQuestion"
            class="px-5 py-3 rounded-full bg-primary text-white font-bold"
          >
            Add Question
          </button>

          <RouterLink
            to="/admin/dashboard"
            class="px-5 py-3 rounded-full bg-surface-container-low font-bold"
          >
            Back
          </RouterLink>
        </div>
      </div>

      <form
        @submit.prevent="handleSubmitQuestion"
        class="rounded-3xl bg-surface-container-low p-6 shadow mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div class="md:col-span-2 flex items-center justify-between gap-4">
          <div>
            <h2 class="text-2xl font-bold">
              {{
                formMode === 'add'
                  ? 'Add Question'
                  : selectedQuestionId
                    ? 'Edit Question'
                    : 'Select a Question to Edit'
              }}
            </h2>

            <p class="text-sm text-on-surface-variant mt-1">
              {{
                formMode === 'add'
                  ? 'Enter the new question details below.'
                  : selectedQuestionId
                    ? `Editing question ID: ${selectedQuestionId}`
                    : 'Click Edit from the table below to load a question, or click Add Question to create a new one.'
              }}
            </p>
          </div>

          <button
            v-if="canUseForm"
            type="button"
            @click="clearSelection"
            class="px-4 py-2 rounded-full bg-surface text-on-surface font-bold"
          >
            Cancel
          </button>
        </div>

        <input
          v-model="form.tile_id"
          placeholder="Tile ID"
          class="input"
          :disabled="!canUseForm"
          required
        />

        <select
          v-model="form.question_type"
          class="input"
          :disabled="!canUseForm"
        >
          <option value="mcq">MCQ</option>
          <option value="structured">Structured</option>
        </select>

        <select
          v-model="form.difficulty"
          class="input"
          :disabled="!canUseForm"
        >
          <option value="easy">Easy</option>
          <option value="intermediate">Intermediate</option>
          <option value="hard">Hard</option>
        </select>

        <input
          v-model="form.credits"
          placeholder="Credits"
          type="number"
          class="input"
          :disabled="!canUseForm"
          required
        />

        <textarea
          v-model="form.question_text"
          placeholder="Question Text"
          class="input md:col-span-2 min-h-28"
          :disabled="!canUseForm"
          required
        />

        <template v-if="form.question_type === 'mcq'">
          <input
            v-model="form.option_a"
            placeholder="Option A"
            class="input"
            :disabled="!canUseForm"
          />

          <input
            v-model="form.option_b"
            placeholder="Option B"
            class="input"
            :disabled="!canUseForm"
          />

          <input
            v-model="form.option_c"
            placeholder="Option C"
            class="input"
            :disabled="!canUseForm"
          />

          <input
            v-model="form.option_d"
            placeholder="Option D"
            class="input"
            :disabled="!canUseForm"
          />

          <input
            v-model="form.correct_answer"
            placeholder="Correct Answer, e.g. A"
            class="input md:col-span-2"
            :disabled="!canUseForm"
            required
          />
        </template>

        <template v-if="form.question_type === 'structured'">
          <textarea
            v-model="form.expected_answer"
            placeholder="Expected Answer"
            class="input md:col-span-2 min-h-24"
            :disabled="!canUseForm"
            required
          />

          <textarea
            v-model="form.rubric"
            placeholder="Rubric"
            class="input md:col-span-2 min-h-24"
            :disabled="!canUseForm"
            required
          />

          <input
            v-model="form.max_score"
            placeholder="Max Score"
            type="number"
            class="input"
            :disabled="!canUseForm"
            required
          />
        </template>


        <button
          type="submit"
          class="md:col-span-2 px-6 py-3 rounded-full bg-primary text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!canUseForm || saving"
        >
          {{
            saving
              ? 'Saving...'
              : formMode === 'add'
                ? 'Add Question'
                : selectedQuestionId
                  ? 'Update Question'
                  : 'Select a Question First'
          }}
        </button>
      </form>

      <div v-if="loading" class="text-on-surface-variant">
        Loading questions...
      </div>

      <div v-else class="rounded-3xl bg-surface-container-low shadow overflow-hidden">
        <table class="w-full text-left">
          <thead class="bg-surface-container">
            <tr>
              <th class="p-4">ID</th>
              <th class="p-4">Tile</th>
              <th class="p-4">Type</th>
              <th class="p-4">Difficulty</th>
              <th class="p-4">Question</th>
              <th class="p-4">Credits</th>
              <th class="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="question in questions"
              :key="question.id"
              class="border-t border-outline-variant"
              :class="selectedQuestionId === question.id ? 'selected-row' : ''"
            >
              <td class="p-4">{{ question.id }}</td>
              <td class="p-4">{{ question.tile_id }}</td>
              <td class="p-4 capitalize">{{ question.question_type }}</td>
              <td class="p-4 capitalize">{{ question.difficulty }}</td>
              <td class="p-4 max-w-md truncate">{{ question.question_text }}</td>
              <td class="p-4">{{ question.credits }}</td>

              <td class="p-4">
                <div class="flex gap-4">
                  <button
                    type="button"
                    @click="handleEditQuestion(question)"
                    class="text-primary font-bold"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    @click="handleDeleteQuestion(question.id)"
                    class="text-red-600 font-bold"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="questions.length === 0">
              <td colspan="7" class="p-6 text-center text-on-surface-variant">
                No questions found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="popup.visible"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4"
        @click.self="closePopup"
      >
        <div class="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-sm font-bold uppercase tracking-[0.2em]" :class="popupToneClass">
                {{ popup.type === 'confirm' ? 'Please Confirm' : popup.type }}
              </p>

              <h3 class="mt-2 text-2xl font-bold text-on-surface">
                {{ popup.title }}
              </h3>
            </div>

            <button
              type="button"
              class="rounded-full px-3 py-1 text-on-surface-variant hover:bg-surface-container"
              @click="closePopup"
            >
              Close
            </button>
          </div>

          <p class="mt-4 whitespace-pre-line text-on-surface-variant">
            {{ popup.message }}
          </p>

          <div class="mt-6 flex justify-end gap-3">
            <button
              v-if="popup.type === 'confirm'"
              type="button"
              class="rounded-full bg-surface-container px-5 py-2 font-bold text-on-surface"
              @click="closePopup"
            >
              Cancel
            </button>

            <button
              v-if="popup.type === 'confirm'"
              type="button"
              class="rounded-full bg-red-600 px-5 py-2 font-bold text-white"
              @click="confirmPopup"
            >
              Delete
            </button>

            <button
              v-else
              type="button"
              class="rounded-full bg-primary px-5 py-2 font-bold text-white"
              @click="closePopup"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import NavBar from '@/components/NavBar.vue'
import api from '@/services/api'

type QuestionType = 'mcq' | 'structured'
type Difficulty = 'easy' | 'intermediate' | 'hard'

type Question = {
  id: number
  tile_id: number
  question_type: QuestionType
  question_text: string
  difficulty: Difficulty
  credits: number

  option_a?: string | null
  option_b?: string | null
  option_c?: string | null
  option_d?: string | null

  correct_answer?: string | null
  expected_answer?: string | null
  rubric?: string | null
  max_score?: number | null
}

type QuestionForm = {
  tile_id: string
  question_type: QuestionType
  difficulty: Difficulty
  credits: string
  question_text: string

  option_a: string
  option_b: string
  option_c: string
  option_d: string

  correct_answer: string
  expected_answer: string
  rubric: string
  max_score: string
}

type ApiError = {
  response?: {
    status?: number
    data?: {
      message?: string
      errors?: Record<string, string[]>
    }
  }
}

type PopupType = 'success' | 'error' | 'warning' | 'confirm'

type PopupState = {
  visible: boolean
  type: PopupType
  title: string
  message: string
  onConfirm: null | (() => void | Promise<void>)
}

const loading = ref(true)
const saving = ref(false)
const questions = ref<Question[]>([])
const selectedQuestionId = ref<number | null>(null)
const formMode = ref<'none' | 'add' | 'edit'>('none')
const popup = ref<PopupState>({
  visible: false,
  type: 'success',
  title: '',
  message: '',
  onConfirm: null,
})

const canUseForm = computed(() => formMode.value === 'add' || !!selectedQuestionId.value)
const popupToneClass = computed(() => {
  if (popup.value.type === 'error') return 'text-red-600'
  if (popup.value.type === 'warning') return 'text-amber-600'
  if (popup.value.type === 'confirm') return 'text-red-600'

  return 'text-primary'
})

const defaultForm = (): QuestionForm => ({
  tile_id: '',
  question_type: 'mcq',
  difficulty: 'easy',
  credits: '50',
  question_text: '',

  option_a: '',
  option_b: '',
  option_c: '',
  option_d: '',

  correct_answer: '',
  expected_answer: '',
  rubric: '',
  max_score: '10',
})

const form = ref<QuestionForm>(defaultForm())

const resetForm = () => {
  form.value = defaultForm()
}

const showPopup = (
  type: PopupType,
  title: string,
  message: string,
  onConfirm: PopupState['onConfirm'] = null,
) => {
  popup.value = {
    visible: true,
    type,
    title,
    message,
    onConfirm,
  }
}

const closePopup = () => {
  popup.value.visible = false
  popup.value.onConfirm = null
}

const confirmPopup = async () => {
  const popupAction = popup.value.onConfirm

  closePopup()

  if (popupAction) {
    await popupAction()
  }
}

const clearSelection = () => {
  selectedQuestionId.value = null
  formMode.value = 'none'
  resetForm()
}

const buildQuestionPayload = () => ({
  tile_id: Number(form.value.tile_id),
  question_type: form.value.question_type,
  difficulty: form.value.difficulty,
  credits: Number(form.value.credits),
  question_text: form.value.question_text,

  option_a: form.value.question_type === 'mcq' ? form.value.option_a : null,
  option_b: form.value.question_type === 'mcq' ? form.value.option_b : null,
  option_c: form.value.question_type === 'mcq' ? form.value.option_c : null,
  option_d: form.value.question_type === 'mcq' ? form.value.option_d : null,

  correct_answer: form.value.question_type === 'mcq' ? form.value.correct_answer : null,
  expected_answer: form.value.question_type === 'structured' ? form.value.expected_answer : null,
  rubric: form.value.question_type === 'structured' ? form.value.rubric : null,
  max_score: form.value.question_type === 'structured' ? Number(form.value.max_score) : null,

})

const getApiErrorMessage = (error: unknown, fallback: string) => {
  const apiError = error as ApiError

  if (apiError.response?.status === 422 && apiError.response.data?.errors) {
    const firstError = Object.values(apiError.response.data.errors)[0]
    return firstError?.[0] || fallback
  }

  return apiError.response?.data?.message || fallback
}

const fetchQuestions = async () => {
  loading.value = true

  try {
    const response = await api.get('/api/admin/questions')
    questions.value = response.data.questions || []
  } catch (error) {
    console.error('Failed to load questions:', error)
    showPopup('error', 'Unable to Load Questions', 'Failed to load questions.')
  } finally {
    loading.value = false
  }
}

const handleEditQuestion = (question: Question) => {
  formMode.value = 'edit'
  selectedQuestionId.value = question.id

  form.value = {
    tile_id: String(question.tile_id),
    question_type: question.question_type,
    difficulty: question.difficulty,
    credits: String(question.credits),
    question_text: question.question_text || '',

    option_a: question.option_a || '',
    option_b: question.option_b || '',
    option_c: question.option_c || '',
    option_d: question.option_d || '',

    correct_answer: question.correct_answer || '',
    expected_answer: question.expected_answer || '',
    rubric: question.rubric || '',
    max_score: String(question.max_score || 10),
  }

  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

const handleAddQuestion = async () => {
  try {
    const response = await api.get('/api/admin/questions/limit-status')

    if (!response.data.can_add_question) {
      showPopup(
        'warning',
        'Question Limit Reached',
        `Question limit reached. Current total: ${response.data.current_total}/${response.data.maximum_allowed}`
      )
      return
    }

    selectedQuestionId.value = null
    formMode.value = 'add'
    resetForm()

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  } catch (error) {
    console.error('Failed to check question limit:', error)
    showPopup(
      'error',
      'Unable to Check Question Limit',
      getApiErrorMessage(error, 'Failed to check question limit.'),
    )
  }
}

const handleSubmitQuestion = async () => {
  if (formMode.value === 'add') {
    await handleCreateQuestion()
    return
  }

  await handleUpdateQuestion()
}

const handleCreateQuestion = async () => {
  saving.value = true

  try {
    await api.post('/api/admin/questions', buildQuestionPayload())

    showPopup('success', 'Question Added', 'Question added successfully.')
    clearSelection()
    await fetchQuestions()
  } catch (error) {
    console.error('Failed to add question:', error)
    showPopup(
      'error',
      'Unable to Add Question',
      getApiErrorMessage(error, 'Failed to add question. Please check the form values.'),
    )
  } finally {
    saving.value = false
  }
}

const handleUpdateQuestion = async () => {
  if (!selectedQuestionId.value) {
    showPopup('warning', 'No Question Selected', 'Please select a question to edit first.')
    return
  }

  saving.value = true

  try {
    await api.put(`/api/admin/questions/${selectedQuestionId.value}`, buildQuestionPayload())

    showPopup('success', 'Question Updated', 'Question updated successfully.')
    clearSelection()
    await fetchQuestions()
  } catch (error) {
    console.error('Failed to update question:', error)
    showPopup(
      'error',
      'Unable to Update Question',
      getApiErrorMessage(error, 'Failed to update question. Please check the form values.'),
    )
  } finally {
    saving.value = false
  }
}

const handleDeleteQuestion = async (id: number) => {
  showPopup('confirm', 'Delete Question?', 'This action will permanently remove the question.', async () => {
    try {
      await api.delete(`/api/admin/questions/${id}`)

      if (selectedQuestionId.value === id) {
        clearSelection()
      }

      showPopup('success', 'Question Deleted', 'The question was deleted successfully.')
      await fetchQuestions()
    } catch (error) {
      console.error('Failed to delete question:', error)
      showPopup(
        'error',
        'Unable to Delete Question',
        getApiErrorMessage(error, 'Failed to delete question.'),
      )
    }
  })
}

onMounted(fetchQuestions)
</script>

<style scoped>
.input {
  width: 100%;
  border-radius: 0.75rem;
  border: 1px solid #d1d5db;
  background: white;
  padding: 0.75rem 1rem;
  outline: none;
}

.input:focus {
  border-color: #6366f1;
}

.input:disabled {
  background: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}

.selected-row {
  background: rgba(37, 99, 235, 0.08);
}
</style>
