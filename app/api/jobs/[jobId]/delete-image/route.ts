import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { storage } from "../../../../../config/firebase.config";
import { deleteObject, ref } from "firebase/storage";

export const DELETE = async (
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
      return new NextResponse("Bad request (ID missing)", { status: 400 });
    }

    // Find the job with the specified jobId and userId
    const job = await db.job.findUnique({
      where: {
        id: jobId,
        userId,
      },
    });

    if (!job) {
      return new NextResponse("Job not found", { status: 404 });
    }

    if (job.imageUrl) {
      // Delete the image from Firebase Storage
      const storageRef = ref(storage, job.imageUrl);
      await deleteObject(storageRef);

      // Remove the imageUrl field from the job record in the database
      await db.job.update({
        where: { id: jobId },
        data: {
          imageUrl: null, // Set imageUrl to null to indicate deletion
        },
      });
    }

    return new NextResponse("Image deleted successfully", { status: 200 });
  } catch (error) {
    console.error(`JOB_DELETE_IMAGE_ERROR: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
