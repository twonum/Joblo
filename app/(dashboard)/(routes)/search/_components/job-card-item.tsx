"use client";

import Box from "@/components/box";
import { Card, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Company, Job } from "@prisma/client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  BookmarkCheck,
  BriefcaseBusiness,
  Currency,
  Layers,
  Loader2,
  Network,
} from "lucide-react";
import { cn, formattedString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { truncate } from "lodash";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

interface JobCardItemProps {
  job: Job;
  userId: string | null;
}
const experienceData = [
  {
    value: "0",
    label: "Fresher",
  },
  {
    value: "2",
    label: "0-2 years",
  },
  {
    value: "3",
    label: "2-4 years",
  },
  {
    value: "5",
    label: "5+ years",
  },
];
export const JobCardItem = ({ job, userId }: JobCardItemProps) => {
  const typeJob = job as Job & {
    company: Company | null;
  };
  const company = typeJob.company;
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const [isSavedByUser, setIsSavedByUser] = useState<boolean>(false);
  const SavedUsersIcon = isSavedByUser ? BookmarkCheck : Bookmark;
  const router = useRouter();

  useEffect(() => {
    if (userId && job.savedUsers) {
      const saved = job.savedUsers.includes(userId);
      setIsSavedByUser(saved);
    } else {
      setIsSavedByUser(false);
    }
  }, [userId, job.savedUsers]);

  const onClickSaveJob = async () => {
    if (isBookmarkLoading) return; // Prevent multiple clicks while loading

    try {
      setIsBookmarkLoading(true);
      let apiUrl = `/api/jobs/${job.id}/saveJobtoCollection`;
      if (isSavedByUser) {
        apiUrl = `/api/jobs/${job.id}/removeJobfromCollection`;
      }

      await axios.patch(apiUrl);

      // Update the state based on API response
      setIsSavedByUser(!isSavedByUser); // Toggle the saved status based on current state

      // Notify the user
      toast.success(
        isSavedByUser ? "Job removed from saved jobs" : "Job saved successfully"
      );

      // Refresh the page or re-fetch the data if needed
      router.refresh();
    } catch {
      toast.error("Error saving job");
    } finally {
      setIsBookmarkLoading(false);
    }
  };
  const getYearsOfExperienceLabel = (years: string) => {
    const experience = experienceData.find((exp) => exp.value === years);
    return experience?.label || "N/A";
  };
  return (
    <motion.div layout>
      <Card>
        <div className="w-full p-4 h-full flex flex-col items-start justify-start gap-y-4">
          {/* save job */}
          <Box>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(job.createdAt), {
                addSuffix: true,
              })}
            </p>
            <Button
              variant={"ghost"}
              size={"icon"}
              onClick={onClickSaveJob}
              disabled={isBookmarkLoading}
            >
              {isBookmarkLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <SavedUsersIcon
                  className={cn(
                    "w-4 h-4",
                    isSavedByUser ? "text-emerald-500" : "text-muted-foreground"
                  )}
                />
              )}
            </Button>
          </Box>
          {/* company details */}
          <Box className="items-center justify-start gap-x-4">
            <div className="w-12 h-12 min-w-12 min-h-12 border p-2 rounded-md relative flex items-center justify-center overflow-hidden">
              {company?.logo && (
                <Image
                  src={company?.logo}
                  alt={company?.name}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              )}
            </div>
            <div className="w-full">
              <p className="text-stone-700 font-semibold text-base w-full truncate">
                {job.title}
              </p>
              <Link
                href={`/company/${company?.id}`}
                className="text-xs text-purple-500 w-full truncate"
              >
                {company?.name}
              </Link>
            </div>
          </Box>
          {/* job details */}
          <Box>
            {job.shiftTiming && (
              <div className="text-xs text-muted-foreground flex items-center">
                <BriefcaseBusiness className="w-3 h-3 mr-1" />
                {formattedString(job.shiftTiming)}
              </div>
            )}
            {job.workMode && (
              <div className="text-xs text-muted-foreground flex items-center">
                <Layers className="w-3 h-3 mr-1" />
                {formattedString(job.workMode)}
              </div>
            )}
            {job.hourlyRate && (
              <div className="text-xs text-muted-foreground flex items-center">
                <Currency className="w-3 h-3 mr-1" />
                {`$${formattedString(job.hourlyRate)}/hr`}
              </div>
            )}
            {job.yearsOfExperience && (
              <div className="text-xs text-muted-foreground flex items-center">
                <Network className="w-3 h-3 mr-1" />
                {getYearsOfExperienceLabel(job.yearsOfExperience)}
              </div>
            )}
          </Box>
          {job.short_description && (
            <CardDescription className="text-xs">
              {truncate(job.short_description, {
                length: 180,
                omission: "...",
              })}
            </CardDescription>
          )}
          {job.tags.length > 0 && (
            <Box className="flex-wrap justify-start gap-1">
              {job.tags.slice(0, 6).map((tag: string, i: number) => (
                <p
                  key={i}
                  className="bg-gray-100 text-xs rounded-md px-2 py-[2px] font-semibold text-neutral-500"
                >
                  {tag}
                </p>
              ))}
            </Box>
          )}
          <Box className="gap-2 mt-auto">
            <Link href={`/search/${job.id}`} className="w-full">
              <Button
                className="w-full border-purple-500 text-purple-500 hover:bg-transparent hover:text-purple-600"
                variant={"outline"}
              >
                Details
              </Button>
            </Link>
            <Button
              className="w-full bg-purple-800 text-white hover:bg-purple-900 hover:text-white"
              variant={"outline"}
              onClick={onClickSaveJob}
              disabled={isBookmarkLoading}
            >
              {isSavedByUser ? "Saved" : "Save for later"}
            </Button>
          </Box>
        </div>
      </Card>
    </motion.div>
  );
};
