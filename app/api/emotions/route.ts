import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { EmotionType } from '@prisma/client'

// GET /api/emotions - Get all emotion capsules
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const emotionType = searchParams.get('emotionType') as EmotionType | null
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')

    const where: any = {}
    
    if (emotionType && Object.values(EmotionType).includes(emotionType)) {
      where.emotionType = emotionType
    }

    const capsules = await prisma.emotionCapsule.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit ? parseInt(limit) : undefined,
      skip: offset ? parseInt(offset) : undefined,
    })

    return NextResponse.json(capsules)
  } catch (error) {
    console.error('Error fetching emotion capsules:', error)
    return NextResponse.json(
      { error: 'Failed to fetch emotion capsules' },
      { status: 500 }
    )
  }
}

// POST /api/emotions - Create a new emotion capsule
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { intensity, colorHex, emotionType, shortText, note } = body

    // Validation
    if (
      typeof intensity !== 'number' ||
      intensity < 0 ||
      intensity > 100
    ) {
      return NextResponse.json(
        { error: 'Intensity must be a number between 0 and 100' },
        { status: 400 }
      )
    }

    if (!colorHex || !/^#[0-9A-Fa-f]{6}$/.test(colorHex)) {
      return NextResponse.json(
        { error: 'Invalid color hex format. Use #RRGGBB' },
        { status: 400 }
      )
    }

    if (!emotionType || !Object.values(EmotionType).includes(emotionType)) {
      return NextResponse.json(
        { error: 'Invalid emotion type' },
        { status: 400 }
      )
    }

    if (!shortText || shortText.trim().length === 0) {
      return NextResponse.json(
        { error: 'shortText is required' },
        { status: 400 }
      )
    }

    // For MVP, use a default user or get from session
    // This is where you'd integrate NextAuth session
    let user = await prisma.user.findFirst()
    
    if (!user) {
      // Create a default user if none exists (MVP only)
      user = await prisma.user.create({
        data: {
          email: 'default@emotionvault.local',
          name: 'Default User',
        },
      })
    }

    const capsule = await prisma.emotionCapsule.create({
      data: {
        userId: user.id,
        intensity,
        colorHex,
        emotionType,
        shortText: shortText.trim(),
        note: note?.trim() || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(capsule, { status: 201 })
  } catch (error) {
    console.error('Error creating emotion capsule:', error)
    return NextResponse.json(
      { error: 'Failed to create emotion capsule' },
      { status: 500 }
    )
  }
}
