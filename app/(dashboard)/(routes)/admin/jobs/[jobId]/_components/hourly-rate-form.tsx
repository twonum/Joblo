"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
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

// Define the props interface for HourlyRateForm
interface HourlyRateFormProps {
  initialData: Job;
  jobId: string;
}

// Define the schema for form validation using Zod
const formSchema = z.object({
  hourlyRate: z.string().min(1, { message: "Hourly Rate is required" }), // Add custom message
});

// Main component for managing hourly rates
export const HourlyRateForm = ({ initialData, jobId }: HourlyRateFormProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const router = useRouter();
  
  // Initialize the form with react-hook-form
  const hourlyRateForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hourlyRate: initialData?.hourlyRate || "",
    },
  });
  
  const { handleSubmit, formState: { isSubmitting, isValid } } = hourlyRateForm;

  // Function to handle form submission
  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // API call to update the hourly rate
      await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success("Hourly Rate Updated");
      handleToggleEditing();
      router.refresh();
    } catch (error) {
      console.error('Error updating hourly rate:', error); // Log error for debugging
      toast.error("Something went wrong");
    }
  };

  // Toggle editing mode
  const handleToggleEditing = () => setIsEditMode((current) => !current);

  return (
    <div className="mt-6 bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job Hourly Rate
        <Button onClick={handleToggleEditing} variant={"ghost"}>
          {isEditMode ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>

      {/* Display hourly rate if not editing */}
      {!isEditMode && (
        <p className="text-sm mt-2">
          {initialData.hourlyRate ? `$ ${initialData.hourlyRate}/hr` : "$0/hr"}
        </p>
      )}

      {/* On editing mode, display the form */}
      {isEditMode && (
        <Form {...hourlyRateForm}>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={hourlyRateForm.control}
              name="hourlyRate"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Type the hourly rate" disabled={isSubmitting} {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
              <Button onClick={handleToggleEditing} variant="ghost">
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
