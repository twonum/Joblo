// /api/companies/[companyId]/deleteCoverImage.ts
import { db } from "../../../../lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { companyId: string } }
) {
  const { companyId } = params;

  try {
    // Delete the cover image in the database (or reset the URL to null)
    await db.company.update({
      where: { id: companyId },
      data: {
        coverImage: null, // Assuming coverImage is a string storing the image URL
      },
    });

    return new Response("Cover image deleted successfully", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Failed to delete cover image", { status: 500 });
  }
}
