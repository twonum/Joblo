"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Job } from "@prisma/client";
import { cn } from "@/lib/utils"; // Assuming you have a utility function for class names
import { Combobox } from "@/components/ui/combo-box";

// Define the props interface for WorkExperienceForm
interface WorkExperienceFormProps {
  initialData: Job;
  jobId: string;
}

let experienceOptions = [
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

// Define the schema for form validation using Zod
const formSchema = z.object({
  yearsOfExperience: z.string().min(1, { message: "Experience category is required" }),
});

// Main component for managing work experience
export const WorkExperienceForm = ({
  initialData,
  jobId,
}: WorkExperienceFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  // Initialize the form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      yearsOfExperience: initialData?.yearsOfExperience || "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = form;

  // Function to handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // API call to update the work experience category
      await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success("Experience category updated successfully");
      toggleEditing();
      router.refresh();
    } catch (error) {
      console.error("Error updating experience category:", error); // Log error for debugging
      toast.error("Failed to update experience category");
    }
  };

  // Toggle editing mode
  const toggleEditing = () => setIsEditing((current) => !current);

  // Find the selected option label for display
  const selectedExperienceOption = experienceOptions.find(
    (option) => option.value === initialData.yearsOfExperience
  );

  return (
    <div className="mt-6 bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Work Experience
        <Button onClick={toggleEditing} variant={"ghost"}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>

      {/* Display category if not editing */}
      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData?.yearsOfExperience && "text-neutral-500 italic"
          )}
        >
          {selectedExperienceOption?.label || "No experience added"}
        </p>
      )}

      {/* On editing mode, display the form */}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="yearsOfExperience"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      options={experienceOptions}
                      heading="Work Experience"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
              <Button onClick={toggleEditing} variant="ghost">
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
