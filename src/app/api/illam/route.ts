import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// GET all illams
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const illams = await prisma.illam.findMany({
      orderBy: { nameEn: 'asc' },
      include: {
        gothram: true,
        gramam: true,
        vedam: true
      }
    })
    return NextResponse.json(illams)
  } catch (error) {
    console.error('Error fetching illams:', error)
    return NextResponse.json({ error: 'Error fetching illams' }, { status: 500 })
  }
}

// POST new illam
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const json = await request.json()
    console.log('Received data:', json) // Debug log
    
    if (!json.nameEn || !json.nameMl || !json.gothramId || !json.gramamId || !json.vedamId) {
      const missingFields = []
      if (!json.nameEn) missingFields.push('nameEn')
      if (!json.nameMl) missingFields.push('nameMl')
      if (!json.gothramId) missingFields.push('gothramId')
      if (!json.gramamId) missingFields.push('gramamId')
      if (!json.vedamId) missingFields.push('vedamId')
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

    // Validate gothramId exists
    const gothram = await prisma.gothram.findUnique({
      where: { id: parseInt(json.gothramId) }
    })
    if (!gothram) {
      return NextResponse.json(
        { error: 'Invalid gothram selected' },
        { status: 400 }
      )
    }

    // Validate gramamId exists
    const gramam = await prisma.gramam.findUnique({
      where: { id: parseInt(json.gramamId) }
    })
    if (!gramam) {
      return NextResponse.json(
        { error: 'Invalid gramam selected' },
        { status: 400 }
      )
    }

    // Validate vedamId exists
    const vedam = await prisma.vedam.findUnique({
      where: { id: parseInt(json.vedamId) }
    })
    if (!vedam) {
      return NextResponse.json(
        { error: 'Invalid vedam selected' },
        { status: 400 }
      )
    }

    const illam = await prisma.illam.create({
      data: {
        nameEn: json.nameEn.trim(),
        nameMl: json.nameMl.trim(),
        gothramId: parseInt(json.gothramId),
        gramamId: parseInt(json.gramamId),
        vedamId: parseInt(json.vedamId),
        phone: json.phone?.trim() || null,
        address: json.address?.trim() || null,
        district: json.district?.trim() || null,
        state: json.state?.trim() || null,
        pincode: json.pincode?.trim() || null,
        mapsUrl: json.mapsUrl?.trim() || null
      },
      include: {
        gothram: true,
        gramam: true,
        vedam: true
      }
    })
    console.log('Created illam:', illam) // Debug log
    return NextResponse.json(illam)
  } catch (error) {
    console.error('Error creating illam:', error)
    // Check for unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'An illam with this name already exists' },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { error: 'Error creating illam', details: error.message },
      { status: 500 }
    )
  }
} 