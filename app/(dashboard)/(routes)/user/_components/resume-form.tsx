"use client";

import React, { useState } from "react";
import { AttachmentsUploads } from "@/components/attachments-uploads";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import {
  File,
  X,
  Loader2,
  PlusCircleIcon,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { UserProfile, Resumes } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";

// Define form validation schema using zod
const formSchema = z.object({
  resumes: z.array(z.object({ url: z.string(), name: z.string() })).nonempty(),
});

interface ResumeFormProps {
  initialData: (UserProfile & { resumes: Resumes[] }) | null;
  userId: string;
}

export const ResumeForm = ({ initialData, userId }: ResumeFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isActiveResumeId, setIsActiveResumeId] = useState<string | null>(null);
  const router = useRouter();

  // Prepare initial resumes data
  const initialResumes =
    initialData?.resumes.map((resume) => ({
      url: resume.url,
      name: resume.name,
    })) || [];

  // Configure the form using react-hook-form and Zod
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { resumes: initialResumes },
    mode: "onChange",
  });

  const { isSubmitting, isValid } = form.formState;

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/users/${userId}/resumes`, values);
      toast.success("Resume updated successfully.");
      toggleEditing();
      router.refresh();
    } catch (error) {
      console.error("Error updating resume:", error);
      toast.error("Failed to update resume. Please try again.");
    }
  };

  // Handle resume activation
  const activateResumeId = async (resumeId: string) => {
    setIsActiveResumeId(resumeId);
    try {
      await axios.patch(`/api/users/${userId}`, { activeResumeId: resumeId });
      toast.success("Resume activated.");
      router.refresh();
    } catch (error) {
      console.error("Error activating resume:", error);
      toast.error("Failed to activate resume. Please try again.");
    } finally {
      setIsActiveResumeId(null);
    }
  };

  // Toggle the editing state
  const toggleEditing = () => setIsEditing((prev) => !prev);

  // Handle resume deletion
  const onDelete = async (resume: Resumes) => {
    if (initialData?.activeResumeId === resume.id) {
      toast.error("Cannot delete the active resume.");
      return; // Do not delete the active resume
    }

    try {
      setDeletingId(resume.id);
      await axios.delete(`/api/users/${userId}/resumes/${resume.id}`);
      toast.success("Resume removed successfully.");
      router.refresh(); // Refresh to reflect the changes
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        toast.error("File not found.");
      } else {
        toast.error("Error occurred while deleting the resume.");
      }
      console.error("Error deleting resume:", error);
    } finally {
      setDeletingId(null); // Reset deleting state
    }
  };

  if (!initialData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="mt-6 border flex-1 w-full rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Your Resumes
        <Button onClick={toggleEditing} variant="ghost" size="sm">
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <PlusCircleIcon className="w-4 h-4 mr-2" /> Add Resume
            </>
          )}
        </Button>
      </div>

      {/* Display resumes if not in editing mode */}
      {!isEditing && (
        <div className="space-y-4">
          {initialData.resumes.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
              <div className="p-3 w-full bg-purple-100 border-purple-200 border text-purple-700 rounded-md flex items-center col-span-12 sm:col-span-10">
                <File className="w-4 h-4 mr-2" />
                <p className="text-xs sm:text-sm w-full truncate">
                  {item.name}
                </p>
                {deletingId === item.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="p-1 sm:p-2"
                    onClick={() => onDelete(item)}
                    type="button"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="col-span-12 sm:col-span-2 flex justify-center sm:justify-start">
                {isActiveResumeId === item.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Button
                    variant="ghost"
                    size="sm" // Ensure smaller size
                    className={cn(
                      "flex items-center justify-center",
                      initialData.activeResumeId === item.id
                        ? "text-emerald-500"
                        : "text-red-500",
                      "sm:px-3 sm:py-2 px-2 py-1 text-xs sm:text-sm"
                    )}
                    onClick={() => activateResumeId(item.id)}
                  >
                    <p>
                      {initialData.activeResumeId === item.id
                        ? "Active"
                        : "Activate"}
                    </p>
                    {initialData.activeResumeId === item.id ? (
                      <ShieldCheck className="w-4 h-4 ml-2" />
                    ) : (
                      <ShieldX className="w-4 h-4 ml-2" />
                    )}
                  </Button>
                )}
              </div>
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
              name="resumes"
              render={({ field }) => (
                <FormItem>
                  <AttachmentsUploads
                    disabled={isSubmitting}
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting && (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              )}
              Save
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};
