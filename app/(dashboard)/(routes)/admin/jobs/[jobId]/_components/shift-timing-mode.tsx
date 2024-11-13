"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Job } from "@prisma/client";
import { cn } from "@/lib/utils"; 
import { Combobox } from "@/components/ui/combo-box";

// Define the props interface for ShiftTimingForm
interface ShiftTimingFormProps {
  initialData: Job;
  jobId: string;
}

// Define shift timing options
const shiftTimingOptions = [
  { value: "full-time", label: "Full Time" },
  { value: "part-time", label: "Part Time" },
  { value: "contract", label: "Contract" },
];

// Define schema for form validation
const formSchema = z.object({
  shiftTiming: z.string().min(1, { message: "Shift timing is required" }),
});

// Main ShiftTimingForm component
export const ShiftTimingForm = ({ initialData, jobId }: ShiftTimingFormProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const router = useRouter();

  // Initialize react-hook-form with Zod schema validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shiftTiming: initialData?.shiftTiming || "",
    },
  });

  const { handleSubmit, formState: { isSubmitting, isValid } } = form;

  // Handle form submission to update shift timing
  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success("Shift Timing Updated");
      toggleEditMode();
      router.refresh();
    } catch (error) {
      console.error("Error updating shift timing:", error);
      toast.error("Something went wrong");
    }
  };

  // Toggle editing mode
  const toggleEditMode = () => setIsEditMode((current) => !current);

  // Find the selected option label to display when not editing
  const selectedShiftTiming = shiftTimingOptions.find(option => option.value === initialData.shiftTiming);

  return (
    <div className="mt-6 bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job Shift Timing
        <Button onClick={toggleEditMode} variant={"ghost"}>
          {isEditMode ? "Cancel" : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>

      {/* Display selected shift timing if not editing */}
      {!isEditMode && (
        <p className={cn("text-sm mt-2", !initialData?.shiftTiming && "text-neutral-500 italic")}>
          {selectedShiftTiming?.label || "No shift timing added"}
        </p>
      )}

      {/* Display form when in edit mode */}
      {isEditMode && (
        <Form {...form}>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="shiftTiming"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox options={shiftTimingOptions} heading="Timings" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
              <Button onClick={toggleEditMode} variant="ghost">
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
