import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { storage } from "../../../../config/firebase.config";
import { deleteObject, ref } from "firebase/storage";
import { Attachments } from "@prisma/client";

export const PATCH = async (
  req: Request,
  { params }: { params: { jobId: string } }
) => {
  try {
    const { userId } = await auth();
    const { jobId } = params;

    const updatedValues = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!jobId) {
      return new NextResponse("ID is missing", { status: 400 });
    }

    const jobPost = await db.job.update({
      where: {
        id: jobId,
        userId: userId,
      },
      data: { ...updatedValues },
    });

    return NextResponse.json(jobPost);
  } catch (error) {
    console.log(`[JOB_PATCH] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

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
      return new NextResponse("Bad request (Id missing)", { status: 400 });
    }

    const jobToDelete = await db.job.findUnique({
      where: { id: jobId, userId },
      include: {
        attachments: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!jobToDelete) {
      return new NextResponse("Job Not found", { status: 404 });
    }

    if (jobToDelete.imageUrl) {
      const storageRef = ref(storage, jobToDelete.imageUrl);
      await deleteObject(storageRef);
    }

    if (
      Array.isArray(jobToDelete.attachments) &&
      jobToDelete.attachments.length > 0
    ) {
      await Promise.all(
        jobToDelete.attachments.map(async (attachment: Attachments) => {
          const attachmentStorageRef = ref(storage, attachment.url);
          await deleteObject(attachmentStorageRef);
        })
      );
    }
    // delete the job attachment records from mongodb
    await db.attachments.deleteMany({
      where: {
        jobId,
      },
    });

    const deleteJobResponse = await db.job.delete({
      where: { id: jobId },
    });
    return NextResponse.json(deleteJobResponse);
  } catch (error) {
    console.error(`JOB_DELETE_ERROR: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
