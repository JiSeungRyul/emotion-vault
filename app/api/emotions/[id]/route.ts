import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { EmotionType } from '@prisma/client'

// GET /api/emotions/[id] - Get a specific emotion capsule
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const capsule = await prisma.emotionCapsule.findUnique({
      where: {
        id: params.id,
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

    if (!capsule) {
      return NextResponse.json(
        { error: 'Emotion capsule not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(capsule)
  } catch (error) {
    console.error('Error fetching emotion capsule:', error)
    return NextResponse.json(
      { error: 'Failed to fetch emotion capsule' },
      { status: 500 }
    )
  }
}

// PUT /api/emotions/[id] - Update an emotion capsule
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { intensity, colorHex, emotionType, shortText, note } = body

    // Check if capsule exists
    const existingCapsule = await prisma.emotionCapsule.findUnique({
      where: { id: params.id },
    })

    if (!existingCapsule) {
      return NextResponse.json(
        { error: 'Emotion capsule not found' },
        { status: 404 }
      )
    }

    // Validation
    if (
      intensity !== undefined &&
      (typeof intensity !== 'number' || intensity < 0 || intensity > 100)
    ) {
      return NextResponse.json(
        { error: 'Intensity must be a number between 0 and 100' },
        { status: 400 }
      )
    }

    if (colorHex !== undefined && !/^#[0-9A-Fa-f]{6}$/.test(colorHex)) {
      return NextResponse.json(
        { error: 'Invalid color hex format. Use #RRGGBB' },
        { status: 400 }
      )
    }

    if (
      emotionType !== undefined &&
      !Object.values(EmotionType).includes(emotionType)
    ) {
      return NextResponse.json(
        { error: 'Invalid emotion type' },
        { status: 400 }
      )
    }

    if (
      shortText !== undefined &&
      (!shortText || shortText.trim().length === 0)
    ) {
      return NextResponse.json(
        { error: 'shortText cannot be empty' },
        { status: 400 }
      )
    }

    const updatedCapsule = await prisma.emotionCapsule.update({
      where: {
        id: params.id,
      },
      data: {
        ...(intensity !== undefined && { intensity }),
        ...(colorHex !== undefined && { colorHex }),
        ...(emotionType !== undefined && { emotionType }),
        ...(shortText !== undefined && { shortText: shortText.trim() }),
        ...(note !== undefined && { note: note?.trim() || null }),
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

    return NextResponse.json(updatedCapsule)
  } catch (error) {
    console.error('Error updating emotion capsule:', error)
    return NextResponse.json(
      { error: 'Failed to update emotion capsule' },
      { status: 500 }
    )
  }
}

// DELETE /api/emotions/[id] - Delete an emotion capsule
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existingCapsule = await prisma.emotionCapsule.findUnique({
      where: { id: params.id },
    })

    if (!existingCapsule) {
      return NextResponse.json(
        { error: 'Emotion capsule not found' },
        { status: 404 }
      )
    }

    await prisma.emotionCapsule.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ message: 'Emotion capsule deleted successfully' })
  } catch (error) {
    console.error('Error deleting emotion capsule:', error)
    return NextResponse.json(
      { error: 'Failed to delete emotion capsule' },
      { status: 500 }
    )
  }
}
