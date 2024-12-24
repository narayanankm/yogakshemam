import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const professions = await prisma.profession.findMany({
      orderBy: {
        nameEn: "asc",
      },
    });

    return NextResponse.json(professions);
  } catch (error) {
    console.error("Error in GET /api/profession:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await request.json();

    const profession = await prisma.profession.create({
      data: {
        nameEn: data.nameEn,
        nameMl: data.nameMl,
      },
    });

    return NextResponse.json(profession);
  } catch (error) {
    console.error("Error in POST /api/profession:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
