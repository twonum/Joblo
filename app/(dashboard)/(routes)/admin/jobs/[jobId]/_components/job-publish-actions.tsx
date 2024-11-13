"use client";

import { Button } from "../../../../../../../components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useState } from "react";
import toast from "react-hot-toast";

interface JobPublishActionProps {
  disabled: boolean;
  jobId: string;
  isPublished: boolean;
}

export const JobPublishAction = ({
  disabled,
  jobId,
  isPublished,
}: JobPublishActionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Handle publishing or unpublishing the job
  const onClick = async () => {
    try {
      setIsLoading(true);
      if (isPublished) {
        // Unpublish the job
        await axios.patch(`/api/jobs/${jobId}/unpublish`);
        toast.success("Job unpublished successfully");
      } else {
        // Publish the job
        await axios.patch(`/api/jobs/${jobId}/publish`);
        toast.success("Job published successfully");
      }
      router.refresh();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("Failed to toggle publish status");
        console.log(error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle job deletion
  const handleDeleteJob = async () => {
    // Logic for deleting the job (e.g., API call)
    try {
      setIsLoading(true);
      await axios.delete(`/api/jobs/${jobId}`);
      toast.success("Job deleted successfully");
      router.refresh(); // Refresh to reflect deletion
      return router.push("/admin/jobs");
    } catch (error) {
      toast.error("Failed to delete the job");
      console.error("Delete error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-3">
      <Button
        variant="outline"
        onClick={onClick}
        disabled={disabled || isLoading}
        size="sm"
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <Button
        variant="destructive"
        size="icon"
        disabled={isLoading}
        onClick={handleDeleteJob}
      >
        <Trash className="w-4 h-4" />
      </Button>
    </div>
  );
};
