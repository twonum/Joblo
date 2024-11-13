"use client";

import React, { useState } from "react";
import { AttachmentsUploads } from "../../../../../../../components/attachments-uploads";
import { Button } from "../../../../../../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../../../../../../components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { File, X, Loader2, PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Job, Attachments } from "@prisma/client";

interface AttachmentsFormProps {
  initialData: Job & { attachments: Attachments[] };
  jobId: string;
}

// Define form validation schema
const formSchema = z.object({
  attachments: z
    .object({
      url: z.string(),
      name: z.string(),
    })
    .array(),
});

export const AttachmentsForm = ({
  initialData,
  jobId,
}: AttachmentsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  // Prepare initial attachments
  const initialAttachments =
    initialData?.attachments?.map((attachment) => ({
      url: attachment.url,
      name: attachment.name,
    })) ?? [];

  // Configure form with validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { attachments: initialAttachments },
  });

  const { isSubmitting, isValid } = form.formState;

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/jobs/${jobId}/attachments`, values);
      toast.success("Job attachments updated successfully.");
      toggleEditing();
      router.refresh();
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to update attachments. Please try again.");
    }
  };

  // Toggle editing mode
  const toggleEditing = () => setIsEditing((prev) => !prev);

  // Handle attachment deletion
  const onDelete = async (attachment: Attachments) => {
    try {
      setDeletingId(attachment.id);
      await axios.delete(`/api/jobs/${jobId}/attachments/${attachment.id}`);
      toast.success("Attachment removed successfully.");
      router.refresh();
    } catch (error) {
      console.error("Deletion error:", error);
      toast.error("Failed to remove attachment. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  // Ensure initialData is available before rendering
  if (!initialData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4 sm:p-6 md:p-8">
      <div className="font-medium flex items-center justify-between">
        <span className="text-sm sm:text-base">Job Attachments</span>
        <Button onClick={toggleEditing} variant="ghost" className="sm:text-sm">
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <PlusCircleIcon className="w-4 h-4 mr-2" />
              Add Attachment
            </>
          )}
        </Button>
      </div>

      {/* Display attachments if not editing */}
      {!isEditing && (
        <div className="space-y-2 mt-4">
          {initialData?.attachments?.map((attachment) => (
            <div
              key={attachment.id}
              className="p-3 w-full bg-purple-100 border-purple-200 border text-purple-700 rounded-md flex items-center justify-between sm:flex-row flex-col"
            >
              <div className="flex items-center">
                <File className="w-4 h-4 mr-2" />
                <p className="text-xs sm:text-sm w-full truncate">
                  {attachment.name}
                </p>
              </div>
              {deletingId === attachment.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-1"
                  onClick={() => onDelete(attachment)}
                  type="button"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Display form when editing */}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="attachments"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AttachmentsUploads
                      value={field.value}
                      disabled={isSubmitting}
                      onChange={(attachments) => field.onChange(attachments)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
                className="w-full sm:w-auto"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
