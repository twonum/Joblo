"use client";

// Import necessary dependencies
import React, { useState } from "react";
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
import { Copy, Lightbulb, Loader2, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Job } from "@prisma/client";
//import { Textarea } from "@/components/ui/textarea";
import getGenerativeAIResponse from "../../../../../../../scripts/aistudio";
import { Editor } from "../../../../../../../components/editor";
import { cn } from "../../../../../../../lib/utils";
import { Preview } from "../../../../../../../components/preview";

// Interface for props
interface JobDescriptionProps {
  initialData: Job;
  jobId: string;
}

// Form validation schema
const formSchema = z.object({
  description: z.string().min(1, { message: "Description is required" }),
});

// Main component
export const JobDescription = ({ initialData, jobId }: JobDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [aiValue, setAiValue] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [isPrompting, setIsPrompting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { description: initialData?.description || "" },
  });
  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = form;

  // Update job description
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success("Job Updated");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // AI prompt generation
  const handlePromptGeneration = async () => {
    try {
      setIsPrompting(true);
      const jobDescription = `Please draft a job description for ${roleName}, focusing on required skills such as ${requiredSkills}.`;
      const response = await getGenerativeAIResponse(jobDescription);
      const cleanedText = response.replace(/^'|'$/g, "").replace(/[\*\#]/g, "");
      setAiValue(cleanedText);
      setIsPrompting(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate AI response");
    }
  };

  const onCopy = () => {
    navigator.clipboard.writeText(aiValue);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="mt-6 bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job Description
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

      {!isEditing && (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.description && "text-neutral-500 italic"
          )}
        >
          <Preview value={initialData.description || ""} />
        </div>
      )}

      {isEditing && (
        <>
          <div className="flex items-center gap-2 my-2">
            <input
              type="text"
              placeholder="Job name"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="w-full p-2 rounded-md"
              aria-label="Job name"
            />
            <input
              type="text"
              placeholder="Required Skills"
              value={requiredSkills}
              onChange={(e) => setRequiredSkills(e.target.value)}
              className="w-full p-2 rounded-md"
              aria-label="Required Skills"
            />
            {isPrompting ? (
              <Button disabled>
                <Loader2 className="w-4 h-4 animate-spin" />
              </Button>
            ) : (
              <Button onClick={handlePromptGeneration}>
                <Lightbulb className="w-4 h-4" />
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground text-right">
            Note: Separate job name and skills with commas.
          </p>
          {aiValue && (
            <div className="relative mt-4 p-3 bg-white rounded-md text-muted-foreground overflow-y-scroll max-h-96">
              {aiValue}
              <Button
                className="absolute top-3 right-3"
                variant="outline"
                size="icon"
                onClick={onCopy}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          )}
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Editor {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Save
              </Button>
            </form>
          </Form>
        </>
      )}
    </div>
  );
};
