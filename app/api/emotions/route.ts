import { NextRequest, NextResponse } from "next/server"
import { EmotionType } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import {
  isNonEmptyText,
  isValidHexColor,
  isValidIntensity,
  parseLimit,
  parseOffset,
  sanitizeNote,
  sanitizeShortText,
} from "@/lib/utils"
import { buildErrorBody, logApiError, logApiInfo } from "@/lib/logging"

const DEFAULT_LIMIT = 20

// GET /api/emotions - Get all emotion capsules
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const emotionTypeParam = searchParams.get("emotionType")
  const limit = parseLimit(searchParams.get("limit"), DEFAULT_LIMIT)
  const offset = parseOffset(searchParams.get("offset"))

  const where: Record<string, unknown> = {}
  if (emotionTypeParam && Object.values(EmotionType).includes(emotionTypeParam as EmotionType)) {
    where.emotionType = emotionTypeParam as EmotionType
  }

  try {
    const capsules = await prisma.emotionCapsule.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    })

    logApiInfo("capsules.list", "Fetched emotion capsules", {
      count: capsules.length,
      limit,
      offset,
      emotionType: where.emotionType,
    })

    return NextResponse.json(capsules)
  } catch (error) {
    logApiError("capsules.list", "Failed to fetch emotion capsules", { error })
    return NextResponse.json(buildErrorBody("LIST_FAILED", "Failed to fetch emotion capsules"), {
      status: 500,
    })
  }
}

// POST /api/emotions - Create a new emotion capsule
export async function POST(request: NextRequest) {
  const scope = "capsules.create"

  let body: unknown
  try {
    body = await request.json()
  } catch (error) {
    logApiError(scope, "Invalid JSON payload", { error })
    return NextResponse.json(buildErrorBody("INVALID_JSON", "Invalid JSON payload"), { status: 400 })
  }

  const { intensity, colorHex, emotionType, shortText, note } = body as Record<string, unknown>
  const sanitizedShortText = typeof shortText === "string" ? sanitizeShortText(shortText) : ""
  const sanitizedNote = sanitizeNote(typeof note === "string" ? note : undefined)

  if (!isValidIntensity(intensity)) {
    return NextResponse.json(
      buildErrorBody("INVALID_INTENSITY", "Intensity must be a number between 0 and 100"),
      { status: 400 }
    )
  }

  if (!isValidHexColor(colorHex)) {
    return NextResponse.json(
      buildErrorBody("INVALID_COLOR", "Invalid color hex format. Use #RRGGBB"),
      { status: 400 }
    )
  }

  if (!emotionType || !Object.values(EmotionType).includes(emotionType as EmotionType)) {
    return NextResponse.json(buildErrorBody("INVALID_TYPE", "Invalid emotion type"), { status: 400 })
  }

  if (!isNonEmptyText(sanitizedShortText)) {
    return NextResponse.json(buildErrorBody("INVALID_SHORT_TEXT", "shortText is required"), {
      status: 400,
    })
  }

  const emotionEnum = emotionType as EmotionType

  try {
    // For MVP, use a default user or get from session
    let user = await prisma.user.findFirst()
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: "default@emotionvault.local",
          name: "Default User",
        },
      })
    }

    const duplicate = await prisma.emotionCapsule.findFirst({
      where: {
        userId: user.id,
        shortText: sanitizedShortText,
        emotionType: emotionEnum,
      },
    })

    if (duplicate) {
      return NextResponse.json(
        buildErrorBody("DUPLICATE_CAPSULE", "A similar emotion capsule already exists"),
        { status: 409 }
      )
    }

    const capsule = await prisma.emotionCapsule.create({
      data: {
        userId: user.id,
        intensity: intensity as number,
        colorHex: colorHex as string,
        emotionType: emotionEnum,
        shortText: sanitizedShortText,
        note: sanitizedNote,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    logApiInfo(scope, "Created emotion capsule", { id: capsule.id, userId: user.id, emotionType: emotionEnum })
    return NextResponse.json(capsule, { status: 201 })
  } catch (error) {
    logApiError(scope, "Failed to create emotion capsule", { error })
    return NextResponse.json(buildErrorBody("CREATE_FAILED", "Failed to create emotion capsule"), {
      status: 500,
    })
  }
}
