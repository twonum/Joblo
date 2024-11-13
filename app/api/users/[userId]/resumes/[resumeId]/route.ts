import { storage } from "@/config/firebase.config";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { deleteObject, ref } from "firebase/storage";
import { NextResponse } from "next/server";

export const DELETE = async (
  req: Request,
  { params }: { params: { resumeId: string } }
) => {
  try {
    const { userId } = await auth();
    const resumeId = await params.resumeId;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const resume = await db.resumes.findUnique({
      where: { id: resumeId },
    });

    if (!resume) {
      return new NextResponse("Resume not found", { status: 404 });
    }

    const storageRef = ref(storage, resume.url);

    // Attempt to delete from Firebase Storage
    try {
      await deleteObject(storageRef);
    } catch (firebaseError) {
      // Type assertion to Error to access the 'code' property
      if (
        (firebaseError as { code: string }).code !== "storage/object-not-found"
      ) {
        console.error(`[FIREBASE_DELETE_ERROR]: ${firebaseError}`);
        return new NextResponse("Firebase error during deletion", {
          status: 500,
        });
      }
    }

    // Delete from MongoDB regardless
    await db.resumes.delete({
      where: { id: resumeId },
    });

    return NextResponse.json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error(`[RESUME_DELETE] : ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
