import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { thirdwebAuth } from '@/app/consts/thirdwebAuth'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const episodeId = searchParams.get('episodeId')

  if (!episodeId || parseInt(episodeId) < 1) {
    return NextResponse.json({ error: 'Invalid episodeId' }, { status: 400 })
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { episodeId: parseInt(episodeId) },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(comments)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const jwt = request.cookies.get('jwt')?.value
  if (!jwt) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const authResult = await thirdwebAuth.verifyJWT({ jwt })
    if (!authResult.valid) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    console.log('Received POST body:', body)

    const { episodeId, content } = body
    if (!episodeId || !content || parseInt(episodeId) < 1) {
      return NextResponse.json({ error: 'Missing required fields or invalid episodeId' }, { status: 400 })
    }

    const comment = await prisma.comment.create({
      data: {
        episodeId: parseInt(episodeId),
        content,
        userAddress: authResult.parsedJWT.sub,
      },
    })
    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
