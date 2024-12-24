import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// GET all gramams
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const gramams = await prisma.gramam.findMany({
      orderBy: { nameEn: 'asc' }
    })
    return NextResponse.json(gramams)
  } catch (error) {
    console.error('Error fetching gramams:', error)
    return NextResponse.json({ error: 'Error fetching gramams' }, { status: 500 })
  }
}

// POST new gramam
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const json = await request.json()
    
    if (!json.nameEn || !json.nameMl) {
      return NextResponse.json(
        { error: 'Name in both languages is required' },
        { status: 400 }
      )
    }

    const gramam = await prisma.gramam.create({
      data: {
        nameEn: json.nameEn,
        nameMl: json.nameMl
      }
    })
    return NextResponse.json(gramam)
  } catch (error) {
    console.error('Error creating gramam:', error)
    return NextResponse.json({ error: 'Error creating gramam' }, { status: 500 })
  }
} 