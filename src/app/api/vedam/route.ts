import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// GET all vedams
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const vedams = await prisma.vedam.findMany({
      orderBy: { nameEn: 'asc' }
    })
    return NextResponse.json(vedams)
  } catch (error) {
    console.error('Error fetching vedams:', error)
    return NextResponse.json({ error: 'Error fetching vedams' }, { status: 500 })
  }
}

// POST new vedam
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

    const vedam = await prisma.vedam.create({
      data: {
        nameEn: json.nameEn,
        nameMl: json.nameMl
      }
    })
    return NextResponse.json(vedam)
  } catch (error) {
    console.error('Error creating vedam:', error)
    return NextResponse.json({ error: 'Error creating vedam' }, { status: 500 })
  }
} 