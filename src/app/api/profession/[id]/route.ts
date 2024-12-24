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
    const profession = await prisma.profession.findUnique({
      where: { id },
    });

    if (!profession) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(profession);
  } catch (error) {
    console.error("Error in GET /api/profession/[id]:", error);
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

    const profession = await prisma.profession.update({
      where: { id },
      data: {
        nameEn: data.nameEn,
        nameMl: data.nameMl,
      },
    });

    return NextResponse.json(profession);
  } catch (error) {
    console.error("Error in PUT /api/profession/[id]:", error);
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
    await prisma.profession.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error in DELETE /api/profession/[id]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
