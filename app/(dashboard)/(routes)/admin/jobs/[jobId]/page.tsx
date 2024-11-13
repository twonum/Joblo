import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from "../../../../../../lib/db";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";
import { JobPublishAction } from "./_components/job-publish-actions";
import { Banner } from "../../../../../../components/banner";
import { IconBadge } from "../../../../../../components/icon-badge";
import { TitleForm } from "./_components/title-form";
import { CategoryForm } from "./_components/category-form";
import { ImageForm } from "./_components/image-form";
import { ShortDescription } from "./_components/short-description";
import { ShiftTimingForm } from "./_components/shift-timing-mode";
import { HourlyRateForm } from "./_components/hourly-rate-form";
import { WorkModeForm } from "./_components/work-mode-form";
import { WorkExperienceForm } from "./_components/work-experience-form";
import { JobDescription } from "./_components/job-description";
import { TagsForm } from "./_components/tags-form";
import { CompanyForm } from "./_components/company-form";
import { AttachmentsForm } from "./_components/attatchments-form";
import React from "react";

async function fetchData(jobId: string, userId: string) {
  const job = await db.job.findUnique({
    where: {
      id: jobId,
      userId,
    },
    include: {
      attachments: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  const companies = await db.company.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return { job, categories, companies };
}

const JobDetailsPage = async ({ params }: { params: { jobId: string } }) => {
  const jobId = params.jobId;
  const validJobID = /^[0-9a-fA-F]{24}$/;
  if (!validJobID.test(jobId)) {
    return redirect("/admin/jobs");
  }

  const { userId } = await auth();
  if (!userId) {
    return redirect("/"); // Redirect if no user
  }

  const { job, categories, companies } = await fetchData(jobId, userId);

  if (!job) {
    return redirect("/admin/jobs");
  }

  const requiredFields = [
    job.title,
    job.description,
    job.imageUrl,
    job.categoryId,
  ];
  const totalFields = requiredFields.length;
  const filledFields = requiredFields.filter(Boolean).length;
  const completionText = `(${filledFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <Link href={"/admin/jobs"}>
        <div className="flex items-center gap-3 text-sm text-neutral-500">
          <ArrowLeft />
          Back
        </div>
      </Link>

      {/* Title Section */}
      <div className="flex items-center justify-between my-4 flex-wrap md:flex-nowrap">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Job Setup</h1>
          <span className="text-sm text-neutral-500">
            Complete All Fields {completionText}
          </span>
        </div>
        {/* Action buttons */}
        <JobPublishAction
          jobId={jobId}
          isPublished={job.isPublished}
          disabled={!isComplete}
        />
      </div>

      {/* Warning Banner */}
      {!job.isPublished && (
        <Banner
          variant={"warning"}
          label="This job is unpublished. It will not be displayed in Job list"
          className="text-sm md:text-base py-2 md:py-3"
        />
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Left Container */}
        <div className="space-y-6 lg:col-span-2">
          {/* Job Customization */}
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} className="w-6 h-6" />
            <h2 className="text-lg md:text-xl text-neutral-700">
              Customize your Job
            </h2>
          </div>
          <TitleForm initialData={job} jobId={job.id} className="w-full" />
          <CategoryForm
            initialData={job}
            jobId={job.id}
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
          />
          <ImageForm initialData={job} jobId={job.id} />
          <ShortDescription initialData={job} jobId={job.id} />
          <ShiftTimingForm initialData={job} jobId={job.id} />
          <HourlyRateForm initialData={job} jobId={job.id} />
          <WorkModeForm initialData={job} jobId={job.id} />
          <WorkExperienceForm initialData={job} jobId={job.id} />
        </div>

        {/* Right Container */}
        <div className="space-y-6">
          {/* Job Requirements */}
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListChecks} className="w-6 h-6" />
              <h2 className="text-lg md:text-xl text-neutral-700">
                Job Requirements
              </h2>
            </div>
            <TagsForm initialData={job} jobId={job.id} />
          </div>

          {/* Company Details */}
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Building2} className="w-6 h-6" />
              <h2 className="text-lg md:text-xl text-neutral-700">
                Company Details
              </h2>
            </div>
            <CompanyForm
              initialData={job}
              jobId={job.id}
              options={companies.map((company) => ({
                label: company.name,
                value: company.id,
              }))}
            />
          </div>

          {/* Attachments */}
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={File} className="w-6 h-6" />
              <h2 className="text-lg md:text-xl text-neutral-700">
                Job Attachments
              </h2>
            </div>
            <AttachmentsForm initialData={job} jobId={job.id} />
          </div>
        </div>

        {/* Job Description */}
        <div className="col-span-1 sm:col-span-2">
          <JobDescription initialData={job} jobId={job.id} />
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;
