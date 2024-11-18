import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

console.log("API Route Hit - saveJobtoCollection");

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

    // Find the job
    const job = await db.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return new NextResponse("Job Not found", { status: 404 });
    }

    // Ensure the user is not already in savedUsers
    const updatedData = {
      savedUsers: job.savedUsers.includes(userId)
        ? job.savedUsers
        : [...job.savedUsers, userId],
    };

    // Update job with new savedUsers list
    const updatedJob = await db.job.update({
      where: { id: jobId },
      data: updatedData,
    });

    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error(`JOB_PUBLISH_PATCH_ERROR: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
