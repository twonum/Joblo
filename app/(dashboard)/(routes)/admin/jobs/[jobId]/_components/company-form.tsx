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
import { Combobox } from "@/components/ui/combo-box";

// Define the props interface for CompanyForm
interface CompanyFormProps {
  initialData: Job;
  jobId: string;
  options: { label: string; value: string }[];
}

// Define the schema for form validation using Zod
const formSchema = z.object({
  companyId: z.string().min(1, { message: "Category is required" }), // Add custom message
});

// Main component for managing category titles
export const CompanyForm = ({ initialData, jobId, options }: CompanyFormProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const router = useRouter();
  
  // Initialize the form with react-hook-form
  const CompanyForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyId: initialData?.companyId || "",
    },
  });
  
  const { handleSubmit, formState: { isSubmitting, isValid } } = CompanyForm;

  // Function to handle form submission
  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // API call to update the category
      await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success("Category Updated");
      handleToggleEditing();
      router.refresh();
    } catch (error) {
      console.error('Error updating category:', error); // Log error for debugging
      toast.error("Something went wrong");
    }
  };

  // Toggle editing mode
  const handleToggleEditing = () => setIsEditMode((current) => !current);

  // Find the selected option label for display
  const selectedCategoryOption = options.find(option => option.value === initialData.companyId);

  return (
    <div className="mt-6 bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job created by
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

      {/* Display category if not editing */}
      {!isEditMode && (
        <p className={cn("text-sm mt-2", !initialData?.companyId && "text-neutral-500 italic")}>
          {selectedCategoryOption?.label || "No Company"}
        </p>
      )}

      {/* On editing mode, display the form */}
      {isEditMode && (
        <Form {...CompanyForm}>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={CompanyForm.control}
              name="companyId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox options={options} heading="Companies" {...field}
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
