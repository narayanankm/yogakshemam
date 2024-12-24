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

    const namboodiris = await prisma.namboodiri.findMany({
      include: {
        gothram: true,
        illam: true,
        profession: true,
      },
      orderBy: {
        nameEn: "asc",
      },
    });

    return NextResponse.json(namboodiris);
  } catch (error) {
    console.error("Error in GET /api/namboodiri:", error);
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

    const namboodiri = await prisma.namboodiri.create({
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
    console.error("Error in POST /api/namboodiri:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
