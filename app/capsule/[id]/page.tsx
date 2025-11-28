"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EmotionCapsule, EMOTION_TYPE_LABELS } from "@/lib/types"
import { formatDate, getRelativeTime } from "@/lib/date-utils"

type LoadState = "idle" | "loading" | "error" | "not_found" | "success"

export default function CapsuleDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [capsule, setCapsule] = useState<EmotionCapsule | null>(null)
  const [state, setState] = useState<LoadState>("idle")

  useEffect(() => {
    const load = async () => {
      setState("loading")
      try {
        const response = await fetch(`/api/emotions/${params.id}`)
        if (response.status === 404) {
          setState("not_found")
          return
        }
        if (!response.ok) throw new Error("Failed to fetch capsule")
        const data = await response.json()
        setCapsule(data)
        setState("success")
      } catch (error) {
        console.error("Failed to load capsule:", error)
        setState("error")
      }
    }

    if (params?.id) {
      load()
    }
  }, [params?.id])

  const headerActions = (
    <div className="flex items-center gap-3">
      <Button variant="ghost" size="sm" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      <Link href="/timeline">
        <Button variant="outline" size="sm">Timeline</Button>
      </Link>
    </div>
  )

  if (state === "loading") {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Loading capsule...</CardTitle>
                <CardDescription>Fetching details</CardDescription>
              </div>
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            </CardHeader>
          </Card>
        </div>
      </main>
    )
  }

  if (state === "not_found") {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Capsule not found</CardTitle>
                <CardDescription>The requested capsule does not exist.</CardDescription>
              </div>
              {headerActions}
            </CardHeader>
          </Card>
        </div>
      </main>
    )
  }

  if (state === "error" || !capsule) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Something went wrong</CardTitle>
                <CardDescription>We couldn&apos;t load this capsule.</CardDescription>
              </div>
              {headerActions}
            </CardHeader>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Card className="overflow-hidden">
          <div className="h-3" style={{ backgroundColor: capsule.colorHex }} />
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-3xl mb-1">{capsule.shortText}</CardTitle>
              <CardDescription className="space-x-2 text-base">
                <span className="font-medium">{EMOTION_TYPE_LABELS[capsule.emotionType]}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">Intensity {capsule.intensity}</span>
              </CardDescription>
            </div>
            {headerActions}
          </CardHeader>
          <CardContent className="space-y-4">
            {capsule.note && (
              <div>
                <p className="text-sm text-gray-500">Memo</p>
                <p className="mt-1 text-base leading-relaxed">{capsule.note}</p>
              </div>
            )}
            <div className="text-sm text-gray-500 space-y-1">
              <div>Created: {formatDate(capsule.createdAt)}</div>
              <div>Updated: {formatDate(capsule.updatedAt)}</div>
              <div>{getRelativeTime(capsule.createdAt)}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
