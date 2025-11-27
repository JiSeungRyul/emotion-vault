"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { EmotionCapsule, EMOTION_TYPE_LABELS } from "@/lib/types"
import { formatDate, getRelativeTime } from "@/lib/date-utils"
import { ArrowLeft, Plus, Sparkles } from "lucide-react"

export default function TimelinePage() {
  const [capsules, setCapsules] = useState<EmotionCapsule[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCapsules()
  }, [])

  const fetchCapsules = async () => {
    try {
      const response = await fetch("/api/emotions")
      if (!response.ok) {
        throw new Error("Failed to fetch capsules")
      }
      const data = await response.json()
      setCapsules(data)
    } catch (err) {
      console.error("Error fetching capsules:", err)
      setError("감정 캡슐을 불러오는데 실패했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-500">감정 캡슐을 불러오는 중...</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchCapsules}>다시 시도</Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/">
              <Button variant="ghost" size="sm" className="mb-2">
                <ArrowLeft className="w-4 h-4 mr-2" />
                홈으로
              </Button>
            </Link>
            <h1 className="text-4xl font-bold">감정 타임라인</h1>
            <p className="text-gray-500 mt-2">
              {capsules.length}개의 감정 캡슐
            </p>
          </div>
          <Link href="/record">
            <Button size="lg">
              <Plus className="w-4 h-4 mr-2" />
              새 캡슐
            </Button>
          </Link>
        </div>

        {capsules.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <div className="p-4 bg-gray-100 rounded-full w-fit mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">
                아직 감정 캡슐이 없습니다
              </h2>
              <p className="text-gray-500 mb-6">
                첫 번째 감정 캡슐을 만들어보세요!
              </p>
              <Link href="/record">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  첫 캡슐 만들기
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {capsules.map((capsule) => (
              <Link
                key={capsule.id}
                href={`/capsule/${capsule.id}`}
                className="block"
              >
                <Card className="hover:shadow-lg transition-all cursor-pointer overflow-hidden">
                  <div
                    className="h-2"
                    style={{ backgroundColor: capsule.colorHex }}
                  />
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: capsule.colorHex }}
                          />
                          <span className="text-sm font-medium text-gray-600">
                            {EMOTION_TYPE_LABELS[capsule.emotionType]}
                          </span>
                          <span className="text-sm text-gray-400">•</span>
                          <span className="text-sm text-gray-500">
                            강도 {capsule.intensity}
                          </span>
                        </div>
                        <p className="text-lg font-medium mb-2">
                          {capsule.shortText}
                        </p>
                        {capsule.note && (
                          <p className="text-sm text-gray-500 line-clamp-2">
                            {capsule.note}
                          </p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm text-gray-500">
                          {getRelativeTime(capsule.createdAt)}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {formatDate(capsule.createdAt).split(' ').slice(1).join(' ')}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
