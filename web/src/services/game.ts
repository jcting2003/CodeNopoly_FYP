import api from '@/services/api'

export type CreatedGame = {
  id: number
  host_id: number
  game_code: string
  status: string
  started_at?: string | null
  ended_at?: string | null
  created_at?: string
  updated_at?: string
}

export type CreateGameResponse = {
  message: string
  game: CreatedGame
}

export async function createGame() {
  const response = await api.post<CreateGameResponse>('/api/games')
  return response.data
}