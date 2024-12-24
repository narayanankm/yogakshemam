import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// GET single gothram
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

    const gothram = await prisma.gothram.findUnique({
      where: { id }
    })

    if (!gothram) {
      return NextResponse.json({ error: 'Gothram not found' }, { status: 404 })
    }

    return NextResponse.json(gothram)
  } catch (error) {
    console.error('Error fetching gothram:', error)
    return NextResponse.json({ error: 'Error fetching gothram' }, { status: 500 })
  }
}

// PUT update gothram
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

    const gothram = await prisma.gothram.update({
      where: { id },
      data: {
        nameEn: json.nameEn,
        nameMl: json.nameMl
      }
    })

    return NextResponse.json(gothram)
  } catch (error) {
    console.error('Error updating gothram:', error)
    return NextResponse.json({ error: 'Error updating gothram' }, { status: 500 })
  }
}

// DELETE gothram
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

    // Check if gothram is being used by any illam
    const illamsUsingGothram = await prisma.illam.count({
      where: { gothramId: id }
    })

    if (illamsUsingGothram > 0) {
      return NextResponse.json(
        { error: 'Cannot delete gothram as it is being used by illams' },
        { status: 400 }
      )
    }

    await prisma.gothram.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Gothram deleted successfully' })
  } catch (error) {
    console.error('Error deleting gothram:', error)
    return NextResponse.json({ error: 'Error deleting gothram' }, { status: 500 })
  }
} 