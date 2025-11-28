import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { buildErrorBody, logApiError, logApiInfo } from "@/lib/logging"

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const capsuleId = params?.id
  if (!capsuleId) {
    return NextResponse.json(buildErrorBody("INVALID_ID", "Capsule id is required"), { status: 400 })
  }

  try {
    const capsule = await prisma.emotionCapsule.findUnique({
      where: { id: capsuleId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    if (!capsule) {
      logApiInfo("capsules.detail", "Capsule not found", { capsuleId })
      return NextResponse.json(buildErrorBody("NOT_FOUND", "Capsule not found"), { status: 404 })
    }

    logApiInfo("capsules.detail", "Fetched emotion capsule", { capsuleId })
    return NextResponse.json(capsule)
  } catch (error) {
    logApiError("capsules.detail", "Failed to fetch emotion capsule", { capsuleId, error })
    return NextResponse.json(buildErrorBody("DETAIL_FAILED", "Failed to fetch emotion capsule"), { status: 500 })
  }
}
