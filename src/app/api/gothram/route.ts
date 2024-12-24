import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// GET all gothrams
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const gothrams = await prisma.gothram.findMany({
      orderBy: { nameEn: 'asc' }
    })
    return NextResponse.json(gothrams)
  } catch (error) {
    console.error('Error fetching gothrams:', error)
    return NextResponse.json({ error: 'Error fetching gothrams' }, { status: 500 })
  }
}

// POST new gothram
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const json = await request.json()
    console.log('Received data:', json) // Debug log
    
    if (!json.nameEn || !json.nameMl) {
      const missingFields = []
      if (!json.nameEn) missingFields.push('nameEn')
      if (!json.nameMl) missingFields.push('nameMl')
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate string lengths
    if (json.nameEn.length > 200 || json.nameMl.length > 200) {
      return NextResponse.json(
        { error: 'Name length cannot exceed 200 characters' },
        { status: 400 }
      )
    }

    const gothram = await prisma.gothram.create({
      data: {
        nameEn: json.nameEn.trim(),
        nameMl: json.nameMl.trim()
      }
    })
    console.log('Created gothram:', gothram) // Debug log
    return NextResponse.json(gothram)
  } catch (error) {
    console.error('Error creating gothram:', error)
    // Check for unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A gothram with this name already exists' },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { error: 'Error creating gothram', details: error.message },
      { status: 500 }
    )
  }
} 