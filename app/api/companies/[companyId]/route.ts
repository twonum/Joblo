import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";

export const PATCH = async (
  req: Request,
  { params }: { params: { companyId: string } }
) => {
  try {
    const { userId } = await auth();
    const { companyId } = params; // Ensure `companyId` is destructured correctly

    const updatedValues = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!companyId) {
      return new NextResponse("ID is missing", { status: 400 });
    }

    // Update the company post
    const companyPost = await db.company.update({
      where: {
        id: companyId,
        userId, // Ensure that this is defined in your Prisma schema
      },
      data: { ...updatedValues },
    });

    return NextResponse.json(companyPost);
  } catch (error) {
    console.log(`[Company_PATCH] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
