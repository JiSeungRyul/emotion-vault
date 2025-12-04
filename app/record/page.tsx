"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { EmotionType } from "@prisma/client"
import { ArrowLeft, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { EMOTION_COLORS, EMOTION_TYPE_LABELS, PRESET_COLORS } from "@/lib/types"
import { isNonEmptyText, isValidHexColor, isValidIntensity, sanitizeShortText, sanitizeNote } from "@/lib/utils"

type FieldErrors = {
  intensity?: string
  colorHex?: string
  shortText?: string
}

export default function RecordPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [intensity, setIntensity] = useState<number>(50)
  const [colorHex, setColorHex] = useState<string>(PRESET_COLORS[0])
  const [emotionType, setEmotionType] = useState<EmotionType>(EmotionType.PASSION)
  const [shortText, setShortText] = useState<string>("")
  const [note, setNote] = useState<string>("")
  const [errors, setErrors] = useState<FieldErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = (): boolean => {
    const nextErrors: FieldErrors = {}
    if (!isValidIntensity(intensity)) {
      nextErrors.intensity = "강도는 0~100 사이여야 합니다."
    }
    if (!isValidHexColor(colorHex)) {
      nextErrors.colorHex = "색상은 올바른 HEX 코드여야 합니다 (예: #FFAA00)."
    }
    if (!isNonEmptyText(shortText)) {
      nextErrors.shortText = "짧은 메모를 입력해 주세요."
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/emotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intensity,
          colorHex,
          emotionType,
          shortText: sanitizeShortText(shortText),
          note: sanitizeNote(note) ?? undefined,
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        const message = payload?.error?.message || "Failed to create emotion capsule."
        throw new Error(message)
      }

      toast({
        title: "저장되었습니다",
        description: "감정 캡슐이 생성되었어요.",
      })

      setTimeout(() => router.push("/timeline"), 800)
    } catch (error) {
      console.error("Error creating emotion capsule:", error)
      toast({
        title: "오류",
        description: error instanceof Error ? error.message : "감정 캡슐 생성에 실패했습니다.",
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
              뒤로 가기
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">감정 캡슐 기록하기</CardTitle>
            <CardDescription>지금 느끼는 감정을 빠르게 정리해 보세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label className="text-base font-semibold">감정 유형</Label>
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
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: EMOTION_COLORS[type] }} />
                        {label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="intensity" className="text-base font-semibold">
                  감정 강도: <span className="text-primary">{intensity}</span>
                </Label>
                <div className="mt-3">
                  <Slider id="intensity" min={0} max={100} step={1} value={[intensity]} onValueChange={(value) => setIntensity(value[0])} className="w-full" />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>잔잔함 (0)</span>
                    <span>강렬함 (100)</span>
                  </div>
                  {errors.intensity && <p className="text-xs text-red-600 mt-1">{errors.intensity}</p>}
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold">색상</Label>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setColorHex(color)}
                      className={`w-10 h-10 rounded-full border-4 transition-all ${
                        colorHex === color ? "border-gray-800 scale-110" : "border-gray-200 hover:scale-105"
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`색상 선택 ${color}`}
                    />
                  ))}
                  <input
                    type="color"
                    value={colorHex}
                    onChange={(e) => setColorHex(e.target.value)}
                    className="w-10 h-10 rounded-full border-4 border-gray-200 cursor-pointer"
                    aria-label="직접 색상 선택"
                  />
                </div>
                {errors.colorHex && <p className="text-xs text-red-600 mt-1">{errors.colorHex}</p>}
              </div>

              <div>
                <Label htmlFor="shortText" className="text-base font-semibold">
                  짧은 메모 *
                </Label>
                <Input
                  id="shortText"
                  placeholder="지금 어떤 기분인가요?"
                  value={shortText}
                  onChange={(e) => setShortText(e.target.value)}
                  maxLength={200}
                  className="mt-2"
                  required
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{shortText.length}/200</span>
                  {errors.shortText && <span className="text-red-600">{errors.shortText}</span>}
                </div>
              </div>

              <div>
                <Label htmlFor="note" className="text-base font-semibold">
                  메모 (선택)
                </Label>
                <Textarea
                  id="note"
                  placeholder="더 자세히 남기고 싶은 내용이 있다면 적어주세요."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={4}
                  className="mt-2"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" size="lg" className="flex-1" disabled={isSubmitting}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? "저장 중..." : "캡슐 저장"}
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
