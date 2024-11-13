"use client";
// Import necessary dependencies
import React, { useState } from "react";
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
import { Divide, Lightbulb, Loader2, Pencil, X } from "lucide-react"; // Icons
import { useRouter } from "next/navigation"; // Navigation hook
import { useForm } from "react-hook-form";
import toast from "react-hot-toast"; // Toast notification
import { z } from "zod"; // Form validation schema
import { Job } from "@prisma/client"; // Job model from Prisma
import { Textarea } from "@/components/ui/textarea";
import getGenerativeAIResponse from "@/scripts/aistudio"; // AI script for job description generation

// Interface for props, accepting initial job data and job ID
interface TagsFormProps {
  initialData: Job;
  jobId: string;
}

// Define the form validation schema using Zod
const formSchema = z.object({
  tags: z.array(z.string()).min(1),
});

// Main functional component for managing the short description form
export const TagsForm = ({ initialData, jobId }: TagsFormProps) => {
  const [isEditing, setIsEditing] = useState(false); // To toggle editing mode
  const [prompt, setPrompt] = useState(""); // Stores user input for the job title prompt
  const [isPrompting, setIsPrompting] = useState(false); // Loading state for the AI generation
  const [jobTags, setjobTags] = useState<string[]>(initialData.tags);
  const router = useRouter(); // Navigation hook

  // React Hook Form setup with validation schema and default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = form;

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
      const job_tags = `Generate an array of top 10 keywords related to the job profession "${prompt}". These keywords should encompass various aspects of the profession, including skills, responsibilities, tools, and technologies commonly associated with it. Aim for a diverse set of keywords that accurately represent the breadth of the profession. Your output should be a list/array of keywords. Just return me the array alone.`;
      await getGenerativeAIResponse(job_tags).then((data) => {
        if (Array.isArray(JSON.parse(data))) {
          //console.log(JSON.parse(data));
          setjobTags((prevTags) => [...prevTags, ...JSON.parse(data)]);
        }
        form.setValue("tags", data); // Set generated description in the form
        setIsPrompting(false); // Remove loading state
      });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };
  const handleTagRemove = (index: number) => {
    const updatedTags = [...jobTags];
    updatedTags.splice(index, 1);
    setjobTags(updatedTags);
  };
  return (
    <div className="mt-6 bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job Tags
        <Button
          onClick={() => setIsEditing((current) => !current)}
          variant={"ghost"}
        >
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

      {/* Display description when not editing */}
      {!isEditing && <div className="flex items-center flex-wrap gap-2">
          {initialData.tags.length > 0 ? (initialData.tags.map((tag, index) => (<div className="text-xs flex items-center gap-1 whitespace-nowrap py-1 px-2 rounded-md bg-purple-100" key={index}>
            {tag}
          </div>))) : (<p>No Tags</p>)}
        </div>}

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
                <Loader2 className="w-4 h-4 animate-spin" />{" "}
                {/* Loader for AI generation */}
              </Button>
            ) : (
              <Button onClick={handlePromptGeneration}>
                <Lightbulb className="w-4 h-4" />{" "}
                {/* Lightbulb icon for AI prompt */}
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground text-right">
            Note: Job name is enough to generate tags.
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {jobTags.length > 0 ? (
              jobTags.map((tag, index) => (
                <div
                  key={index}
                  className="flex text-sm items-center gap-1 whitespace-nowrap py-1 px-2 rounded-md bg-purple-100"
                >
                  {tag}{" "}
                  {isEditing && (
                    <Button
                      variant={"ghost"}
                      className="p-0 h-auto"
                      onClick={() => handleTagRemove(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <p>No Tags</p>
            )}
          </div>
          <div className="flex items-center gap-2 justify-end mt-4">
            <Button type="button" variant={"outline"} onClick={() => {
              setjobTags([]); onSubmit({tags : []});
            }} disabled={isSubmitting}>Clear All</Button>
            <Button type="submit" disabled={isSubmitting} onClick={() => onSubmit({
              tags: jobTags,
            })} >Save</Button>
          </div>
        </>
      )}
    </div>
  );
};
