import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const id = parseInt(params.id);
    const namboodiri = await prisma.namboodiri.findUnique({
      where: { id },
      include: {
        gothram: true,
        illam: true,
        profession: true,
      },
    });

    if (!namboodiri) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(namboodiri);
  } catch (error) {
    console.error("Error in GET /api/namboodiri/[id]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const id = parseInt(params.id);
    const data = await request.json();

    const namboodiri = await prisma.namboodiri.update({
      where: { id },
      data: {
        nameEn: data.nameEn,
        nameMl: data.nameMl,
        gothramId: data.gothramId,
        illamId: data.illamId,
        professionId: data.professionId,
        phone: data.phone || null,
        email: data.email || null,
        address: data.address || null,
        district: data.district || null,
        state: data.state || null,
        pincode: data.pincode || null,
      },
      include: {
        gothram: true,
        illam: true,
        profession: true,
      },
    });

    return NextResponse.json(namboodiri);
  } catch (error) {
    console.error("Error in PUT /api/namboodiri/[id]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const id = parseInt(params.id);
    await prisma.namboodiri.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error in DELETE /api/namboodiri/[id]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
