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

// Define the props interface for WorkModeForm
interface WorkModeFormProps {
  initialData: Job;
  jobId: string;
}

const workModeOptions = [
  {
    value: "remote",
    label: "Remote",
  },
  {
    value: "hybrid",
    label: "Hybrid",
  },
  {
    value: "onsite",
    label: "Onsite",
  },
];

// Define the schema for form validation using Zod
const formSchema = z.object({
  workMode: z.string().min(1, { message: "Work mode is required" }), // Add custom message
});

// Main component for managing work mode
export const WorkModeForm = ({
  initialData,
  jobId,
}: WorkModeFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  // Initialize the form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workMode: initialData?.workMode || "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = form;

  // Function to handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // API call to update the work mode
      await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success("Work mode updated successfully");
      toggleEditing();
      router.refresh();
    } catch (error) {
      console.error("Error updating work mode:", error); // Log error for debugging
      toast.error("An error occurred while updating");
    }
  };

  // Toggle editing mode
  const toggleEditing = () => setIsEditing((current) => !current);

  // Find the selected option label for display
  const selectedOption = workModeOptions.find(
    (option) => option.value === initialData.workMode
  );

  return (
    <div className="mt-6 bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Work Mode
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

      {/* Display work mode if not editing */}
      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData?.workMode && "text-neutral-500 italic"
          )}
        >
          {selectedOption?.label || "No work mode added"}
        </p>
      )}

      {/* On editing mode, display the form */}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="workMode"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      options={workModeOptions}
                      heading="Work Mode"
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
