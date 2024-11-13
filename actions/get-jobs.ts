import { db } from "../lib/db";
import { auth } from "@clerk/nextjs/server";
import { Job } from "@prisma/client";

type GetJobs = {
  title?: string;
  categoryId?: string;
  createdAtFilter?: string;
  shiftTiming?: string;
  yearsOfExperience?: string;
  workMode?: string;
  savedJobs?: boolean;
  tags?: string; // Added tags parameter
};
export const getJobs = async ({
  title,
  categoryId,
  createdAtFilter,
  shiftTiming,
  yearsOfExperience,
  workMode,
  savedJobs,
  tags,
}: GetJobs): Promise<Job[]> => {
  const { userId } = await auth();

  try {
    // Initialize the query object with base options
    const query: any = {
      where: {
        isPublished: true,
      },
      include: {
        category: true,
        company: true,
        attachments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    };

    // Apply filters based on provided parameters
    query.where.AND = [
      title && {
        title: {
          contains: title,
          mode: "insensitive",
        },
      },
      categoryId && {
        categoryId: {
          equals: categoryId,
        },
      },
      shiftTiming && {
        shiftTiming,
      },
      yearsOfExperience && {
        yearsOfExperience,
      },
      workMode && {
        workMode,
      },
      savedJobs &&
        userId && {
          savedUsers: {
            has: userId,
          },
        },
      tags && {
        tags: {
          hasSome: tags.split(","),
        },
      },
    ].filter(Boolean);

    // Add date filter based on 'createdAtFilter' parameter
    if (createdAtFilter) {
      const currentDate = new Date();
      let startDate: Date;

      switch (createdAtFilter) {
        case "today":
          startDate = new Date(currentDate);
          break;
        case "yesterday":
          startDate = new Date(currentDate);
          startDate.setDate(startDate.getDate() - 1);
          break;
        case "thisWeek":
          startDate = new Date(currentDate);
          startDate.setDate(startDate.getDate() - (startDate.getDay() - 1));
          break;
        case "lastWeek":
          startDate = new Date(currentDate);
          startDate.setDate(startDate.getDate() - currentDate.getDay() - 6);
          break;
        case "thisMonth":
          startDate = new Date(currentDate);
          startDate.setDate(startDate.getDate() - 30);
          break;
        default:
          startDate = new Date(0);
      }

      query.where.createdAt = {
        gte: startDate,
      };
    }

    // Execute the query with constructed filters
    const jobs = await db.job.findMany(query);
    return jobs;
  } catch (error) {
    console.error(`Error in GET_JOBS: ${error}`);
    return [];
  }
};
