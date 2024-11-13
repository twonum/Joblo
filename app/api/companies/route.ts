import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const POST = async (req: Request) => {
  try {
    const { userId } = await auth();
    const { name } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!name) {
      return new NextResponse("Name is missing", { status: 400 });
    }

    // Save the company data
    const company = await db.company.create({
      data: {
        name,
        userId,
      },
    });

    return NextResponse.json(company);
  } catch (error) {
    console.log(`[Company_POST] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
