"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { EmotionCapsule, EMOTION_TYPE_LABELS } from "@/lib/types"
import { formatDate } from "@/lib/date-utils"
import { ArrowLeft, Calendar, Gauge } from "lucide-react"

export default function CapsulePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [capsule, setCapsule] = useState<EmotionCapsule | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      fetchCapsule()
    }
  }, [id])

  const fetchCapsule = async () => {
    try {
      const response = await fetch(`/api/emotions/${id}`)
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("감정 캡슐을 찾을 수 없습니다.")
        }
        throw new Error("Failed to fetch capsule")
      }
      const data = await response.json()
      setCapsule(data)
    } catch (err: any) {
      console.error("Error fetching capsule:", err)
      setError(err.message || "감정 캡슐을 불러오는데 실패했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">감정 캡슐을 열고 있습니다...</p>
        </div>
      </main>
    )
  }

  if (error || !capsule) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="text-center text-white">
          <p className="text-xl mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => router.back()} variant="secondary">
              뒤로 가기
            </Button>
            <Link href="/timeline">
              <Button>타임라인으로</Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  // Create gradient based on emotion color
  const lighterColor = adjustColorBrightness(capsule.colorHex, 40)
  const darkerColor = adjustColorBrightness(capsule.colorHex, -30)

  return (
    <main
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${capsule.colorHex} 0%, ${darkerColor} 50%, ${lighterColor} 100%)`,
      }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: capsule.colorHex }}
        />
        <div
          className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: lighterColor }}
        />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/timeline">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                타임라인으로
              </Button>
            </Link>
          </div>

          {/* Main Content */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
            <div className="p-8 md:p-12">
              {/* Emotion Type Badge */}
              <div className="flex items-center gap-2 mb-6">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: capsule.colorHex }}
                />
                <span className="text-lg font-semibold text-gray-700">
                  {EMOTION_TYPE_LABELS[capsule.emotionType]}
                </span>
              </div>

              {/* Short Text - Main Message */}
              <h1 className="text-3xl md:text-4xl font-bold mb-8 leading-relaxed">
                {capsule.shortText}
              </h1>

              {/* Intensity Gauge */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <Gauge className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-700">
                    감정 강도
                  </span>
                </div>
                <div className="relative">
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${capsule.intensity}%`,
                        backgroundColor: capsule.colorHex,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>0</span>
                    <span className="font-semibold" style={{ color: capsule.colorHex }}>
                      {capsule.intensity}
                    </span>
                    <span>100</span>
                  </div>
                </div>
              </div>

              {/* Note */}
              {capsule.note && (
                <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                  <h2 className="font-semibold text-gray-700 mb-3">추가 메모</h2>
                  <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                    {capsule.note}
                  </p>
                </div>
              )}

              {/* Date */}
              <div className="flex items-center gap-2 text-gray-500 border-t pt-6">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(capsule.createdAt)}</span>
              </div>
            </div>
          </Card>

          {/* Color Info */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-white">
              <div
                className="w-6 h-6 rounded-full border-2 border-white"
                style={{ backgroundColor: capsule.colorHex }}
              />
              <span className="font-mono text-sm">{capsule.colorHex}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

// Helper function to adjust color brightness
function adjustColorBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) + amt
  const G = ((num >> 8) & 0x00ff) + amt
  const B = (num & 0x0000ff) + amt

  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  )
}
