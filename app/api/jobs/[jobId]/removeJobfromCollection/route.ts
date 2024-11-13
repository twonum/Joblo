import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { jobId: string } }
) => {
  try {
    const { userId } = await auth();
    const { jobId } = params;
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!jobId) {
      return new NextResponse("Bad request (Id missing)", { status: 400 });
    }

    const job = await db.job.findUnique({
      where: { id: jobId, userId },
    });

    if (!job) {
      return new NextResponse("Job Not found", { status: 404 });
    }
    let updatedJob;
    const userIndex = job.savedUsers.indexOf(userId);
    if (userIndex !== -1) {
      updatedJob = await db.job.update({
        where: { id: jobId, userId },
        data: {
          savedUsers: { set: job.savedUsers.filter((id) => id !== userId) },
        },
      });
    }
    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error(`JOB_PUBLISH_PATCH_ERROR: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
