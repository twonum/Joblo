import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import Link from "next/link";
import { columns, JobsColumns } from "./_components/columns";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { format } from "date-fns"; // Importing the date formatting function from date-fns

const JobsPageOverview = async () => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const jobs = await db.job.findMany({
    where: {
      userId,
    },
    include: {
      category: true,
      company: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedJobs: JobsColumns[] = jobs.map((job) => ({
    id: job.id,
    title: job.title,
    company: job.company ? job.company?.name : "",
    category: job.category ? job.category?.name : "N/A",
    isPublished: job.isPublished,
    createdAt: job.createdAt
      ? format(new Date(job.createdAt), "MMMM do, yyyy")
      : "N/A",
  }));

  return (
    <div className="p-6">
      <div className="flex items-end justify-between sm:justify-end mb-4">
        <Link href="/admin/jobs/create">
          <Button className="w-full sm:w-auto">
            <Plus className="w-5 h-5 mr-2" />
            Create Job
          </Button>
        </Link>
      </div>
      {/* DataTable - list of jobs */}
      <div className="mt-6">
        <DataTable
          columns={columns}
          data={formattedJobs}
          searchKey="title"
          className="w-full overflow-x-auto"
        />
      </div>
    </div>
  );
};

export default JobsPageOverview;
