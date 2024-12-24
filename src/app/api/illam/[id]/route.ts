import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// PUT update illam
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
    const json = await request.json()

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

    const illam = await prisma.illam.update({
      where: { id },
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

    return NextResponse.json(illam)
  } catch (error) {
    console.error('Error updating illam:', error)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'An illam with this name already exists' },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { error: 'Error updating illam' },
      { status: 500 }
    )
  }
}

// DELETE illam
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

    // Check if illam is referenced by any namboodiri
    const namboodiriCount = await prisma.namboodiri.count({
      where: { illamId: id }
    })

    if (namboodiriCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete illam as it is associated with namboodiris' },
        { status: 400 }
      )
    }

    await prisma.illam.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting illam:', error)
    return NextResponse.json(
      { error: 'Error deleting illam' },
      { status: 500 }
    )
  }
} 