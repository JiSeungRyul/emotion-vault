import { EmotionType } from '@prisma/client'

export interface EmotionCapsule {
  id: string
  userId: string
  intensity: number
  colorHex: string
  emotionType: EmotionType
  shortText: string
  note: string | null
  createdAt: Date | string
  updatedAt: Date | string
  user?: {
    id: string
    name: string | null
    email: string
  }
}

export interface CreateEmotionCapsuleInput {
  intensity: number
  colorHex: string
  emotionType: EmotionType
  shortText: string
  note?: string
}

export const EMOTION_TYPE_LABELS: Record<EmotionType, string> = {
  PASSION: '의지/열정',
  SADNESS: '슬픔/상실',
  PURE_JOY: '순수한 즐거움',
  HEALING: '회복',
  FEAR: '두려움',
  LONELINESS: '외로움',
  INSPIRATION: '영감',
  OTHER: '기타',
}

export const EMOTION_COLORS: Record<string, string> = {
  PASSION: '#FF5A5A',
  SADNESS: '#6B7FD7',
  PURE_JOY: '#FFD93D',
  HEALING: '#6BCB77',
  FEAR: '#9B6FB1',
  LONELINESS: '#4D5B7C',
  INSPIRATION: '#FF9999',
  OTHER: '#A8A8A8',
}

export const PRESET_COLORS = [
  '#FF5A5A', // Red
  '#FFD93D', // Yellow
  '#6BCB77', // Green
  '#6B7FD7', // Blue
  '#9B6FB1', // Purple
  '#FF9999', // Pink
  '#FF8C42', // Orange
  '#4D5B7C', // Dark Blue
  '#A8A8A8', // Gray
]
