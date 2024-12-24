import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// GET single vedam
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

    const vedam = await prisma.vedam.findUnique({
      where: { id }
    })

    if (!vedam) {
      return NextResponse.json({ error: 'Vedam not found' }, { status: 404 })
    }

    return NextResponse.json(vedam)
  } catch (error) {
    console.error('Error fetching vedam:', error)
    return NextResponse.json({ error: 'Error fetching vedam' }, { status: 500 })
  }
}

// PUT update vedam
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

    const vedam = await prisma.vedam.update({
      where: { id },
      data: {
        nameEn: json.nameEn,
        nameMl: json.nameMl
      }
    })

    return NextResponse.json(vedam)
  } catch (error) {
    console.error('Error updating vedam:', error)
    return NextResponse.json({ error: 'Error updating vedam' }, { status: 500 })
  }
}

// DELETE vedam
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

    await prisma.vedam.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Vedam deleted successfully' })
  } catch (error) {
    console.error('Error deleting vedam:', error)
    return NextResponse.json({ error: 'Error deleting vedam' }, { status: 500 })
  }
} 