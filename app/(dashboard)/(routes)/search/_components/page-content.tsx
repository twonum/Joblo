"use client";

import { Job } from "@prisma/client";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { JobCardItem } from "./job-card-item";
import { fadeInOut } from "@/animations";

interface PageContentProps {
  jobs: Job[];
  userId: string | null;
}

export const PageContent = ({ jobs, userId }: PageContentProps) => {
  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-[50vh] px-4 text-center">
        <div className="relative w-full h-60 sm:h-72 md:h-80 lg:h-96">
          <Image
            fill
            alt="No jobs found"
            src="/img/404.svg"
            className="object-contain"
          />
        </div>
        <h2 className="mt-6 text-2xl font-semibold text-muted-foreground sm:text-3xl md:text-4xl">
          No jobs found
        </h2>
      </div>
    );
  }

  return (
    <div className="pt-6 px-4 sm:px-6 lg:px-8">
      <AnimatePresence>
        <motion.div
          {...fadeInOut}
          layout
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6"
        >
          {jobs.map((job) => (
            <JobCardItem key={job.id} job={job} userId={userId} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
