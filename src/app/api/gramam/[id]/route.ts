import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// GET single gramam
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const gramam = await prisma.gramam.findUnique({
      where: { id }
    })

    if (!gramam) {
      return NextResponse.json({ error: 'Gramam not found' }, { status: 404 })
    }

    return NextResponse.json(gramam)
  } catch (error) {
    console.error('Error fetching gramam:', error)
    return NextResponse.json({ error: 'Error fetching gramam' }, { status: 500 })
  }
}

// PUT update gramam
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const json = await request.json()
    if (!json.nameEn || !json.nameMl) {
      return NextResponse.json(
        { error: 'Name in both languages is required' },
        { status: 400 }
      )
    }

    const gramam = await prisma.gramam.update({
      where: { id },
      data: {
        nameEn: json.nameEn,
        nameMl: json.nameMl
      }
    })

    return NextResponse.json(gramam)
  } catch (error) {
    console.error('Error updating gramam:', error)
    return NextResponse.json({ error: 'Error updating gramam' }, { status: 500 })
  }
}

// DELETE gramam
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    await prisma.gramam.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Gramam deleted successfully' })
  } catch (error) {
    console.error('Error deleting gramam:', error)
    return NextResponse.json({ error: 'Error deleting gramam' }, { status: 500 })
  }
} 