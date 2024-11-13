"use client"
// Import necessary dependencies
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Lightbulb, Loader2, Pencil } from "lucide-react"; // Icons
import { useRouter } from "next/navigation"; // Navigation hook
import { useForm } from "react-hook-form";
import toast from "react-hot-toast"; // Toast notification
import { z } from "zod"; // Form validation schema
import { Job } from "@prisma/client"; // Job model from Prisma
import { Textarea } from "@/components/ui/textarea";
import getGenerativeAIResponse from "@/scripts/aistudio"; // AI script for job description generation

// Interface for props, accepting initial job data and job ID
interface ShortDescriptionProps {
  initialData: Job;
  jobId: string;
}

// Define the form validation schema using Zod
const formSchema = z.object({
  short_description: z.string().min(1, { message: "Category is required" }), // Short description validation
});

// Main functional component for managing the short description form
export const ShortDescription = ({ initialData, jobId }: ShortDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false); // To toggle editing mode
  const [prompt, setPrompt] = useState(""); // Stores user input for the job title prompt
  const [isPrompting, setIsPrompting] = useState(false); // Loading state for the AI generation
  const router = useRouter(); // Navigation hook

  // React Hook Form setup with validation schema and default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      short_description: initialData?.short_description || "",
    },
    mode: "onChange", // Validate on change to update button state immediately
  });

  const { handleSubmit, formState: { isSubmitting, isValid }, trigger } = form;

  // Form submission handler to update the job description
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/jobs/${jobId}`, values); // Sends the updated description to the server
      toast.success("Job Updated");
      setIsEditing(false); // Exit editing mode upon successful update
      router.refresh(); // Refresh the page
    } catch (error) {
      toast.error("Something went wrong"); // Error handling
    }
  };

  // Function to handle AI-generated job description
  const handlePromptGeneration = async () => {
    try {
      setIsPrompting(true); // Set loading state
      const job_short_description = `Could you craft a concise job description for a ${prompt} position in fewer than 400 characters?`;
      const data = await getGenerativeAIResponse(job_short_description);
      form.setValue("short_description", data); // Set generated description in the form
      await trigger("short_description"); // Trigger validation manually after setting value
      setIsPrompting(false); // Remove loading state
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="mt-6 bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job Description
        <Button onClick={() => setIsEditing((current) => !current)} variant={"ghost"}>
          {isEditing ? <>Cancel</> : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>

      {/* Display description when not editing */}
      {!isEditing && (
        <p className="text-neutral-500">{initialData?.short_description}</p>
      )}

      {/* Display the form when editing */}
      {isEditing && (
        <>
          <div className="flex items-center gap-2 my-2">
            <input
              type="text"
              placeholder="e.g. 'System Engineer'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)} // Update the prompt value
              className="w-full p-2 rounded-md"
            />
            {/* Button to trigger AI generation */}
            {isPrompting ? (
              <Button>
                <Loader2 className="w-4 h-4 animate-spin" /> {/* Loader for AI generation */}
              </Button>
            ) : (
              <Button onClick={handlePromptGeneration}>
                <Lightbulb className="w-4 h-4" /> {/* Lightbulb icon for AI prompt */}
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground text-right">
            Note: Just type the Job name to go.
          </p>

          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
              {/* Form field for job description */}
              <FormField
                control={form.control}
                name="short_description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        disabled={isSubmitting}
                        placeholder="Short description about the Job"
                        {...field} // Binds form field with Textarea
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-x-2">
                {/* Submit button for saving the form */}
                <Button disabled={!isValid || isSubmitting} type="submit">
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </>
      )}
    </div>
  );
};
