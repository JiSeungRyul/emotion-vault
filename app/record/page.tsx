"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/components/ui/use-toast"
import { EmotionType } from "@prisma/client"
import { EMOTION_TYPE_LABELS, EMOTION_COLORS, PRESET_COLORS } from "@/lib/types"
import { ArrowLeft, Save } from "lucide-react"

export default function RecordPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [intensity, setIntensity] = useState<number>(50)
  const [colorHex, setColorHex] = useState<string>(PRESET_COLORS[0])
  const [emotionType, setEmotionType] = useState<EmotionType>(EmotionType.PASSION)
  const [shortText, setShortText] = useState<string>("")
  const [note, setNote] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!shortText.trim()) {
      toast({
        title: "오류",
        description: "짧은 감정 문장을 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/emotions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intensity,
          colorHex,
          emotionType,
          shortText: shortText.trim(),
          note: note.trim() || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create emotion capsule")
      }

      toast({
        title: "저장 완료!",
        description: "감정 캡슐이 성공적으로 저장되었습니다.",
      })

      setTimeout(() => {
        router.push("/timeline")
      }, 1000)
    } catch (error) {
      console.error("Error creating emotion capsule:", error)
      toast({
        title: "오류",
        description: "감정 캡슐 저장에 실패했습니다.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              홈으로
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">감정 캡슐 만들기</CardTitle>
            <CardDescription>
              지금 느끼는 감정을 캡슐로 저장하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Emotion Type */}
              <div>
                <Label className="text-base font-semibold">감정 타입</Label>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {Object.entries(EMOTION_TYPE_LABELS).map(([type, label]) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setEmotionType(type as EmotionType)}
                      className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        emotionType === type
                          ? "border-primary bg-primary/10"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: EMOTION_COLORS[type] }}
                        />
                        {label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Intensity Slider */}
              <div>
                <Label htmlFor="intensity" className="text-base font-semibold">
                  감정 강도: <span className="text-primary">{intensity}</span>
                </Label>
                <div className="mt-3">
                  <Slider
                    id="intensity"
                    min={0}
                    max={100}
                    step={1}
                    value={[intensity]}
                    onValueChange={(value) => setIntensity(value[0])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>약함 (0)</span>
                    <span>강함 (100)</span>
                  </div>
                </div>
              </div>

              {/* Color Picker */}
              <div>
                <Label className="text-base font-semibold">감정 색상</Label>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setColorHex(color)}
                      className={`w-10 h-10 rounded-full border-4 transition-all ${
                        colorHex === color
                          ? "border-gray-800 scale-110"
                          : "border-gray-200 hover:scale-105"
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                  <input
                    type="color"
                    value={colorHex}
                    onChange={(e) => setColorHex(e.target.value)}
                    className="w-10 h-10 rounded-full border-4 border-gray-200 cursor-pointer"
                  />
                </div>
              </div>

              {/* Short Text */}
              <div>
                <Label htmlFor="shortText" className="text-base font-semibold">
                  짧은 감정 문장 *
                </Label>
                <Input
                  id="shortText"
                  placeholder="예: 오늘은 정말 의미있는 하루였다"
                  value={shortText}
                  onChange={(e) => setShortText(e.target.value)}
                  maxLength={200}
                  className="mt-2"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {shortText.length}/200
                </p>
              </div>

              {/* Note */}
              <div>
                <Label htmlFor="note" className="text-base font-semibold">
                  추가 메모 (선택)
                </Label>
                <Textarea
                  id="note"
                  placeholder="더 자세한 내용을 기록하고 싶다면..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={4}
                  className="mt-2"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  size="lg"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? "저장 중..." : "감정 캡슐 저장"}
                </Button>
                <Link href="/timeline">
                  <Button type="button" variant="outline" size="lg">
                    취소
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
