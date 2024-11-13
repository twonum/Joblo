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
import { Copy, Lightbulb, Loader2, Pencil } from "lucide-react"; // Icons
import { useRouter } from "next/navigation"; // Navigation hook
import { useForm } from "react-hook-form";
import toast from "react-hot-toast"; // Toast notification
import { z } from "zod"; // Form validation schema
import { Company } from "@prisma/client"; // Job model from Prisma
import { Textarea } from "@/components/ui/textarea";
import getGenerativeAIResponse from "@/scripts/aistudio"; // AI script for job description generation
import { Editor } from "@/components/editor";
import { cn } from "@/lib/utils";
import { Preview } from "@/components/preview";

// Interface for props, accepting initial job data and job ID
interface WhyJoinUsFormProps {
  initialData: Company;
  companyId: string;
}

// Define the form validation schema using Zod
const formSchema = z.object({
  whyJoinUs: z.string().min(1, { message: "Category is required" }), // Short whyJoinUs validation
});

// Main functional component for managing the short description form
export const WhyJoinUsForm = ({
  initialData,
  companyId,
}: WhyJoinUsFormProps) => {
  const [isEditing, setIsEditing] = useState(false); // To toggle editing mode
  const [rollname, setrollname] = useState("");
  const [aiValue, setaiValue] = useState("");
  const [isPrompting, setIsPrompting] = useState(false); // Loading state for the AI generation
  const router = useRouter(); // Navigation hook

  // React Hook Form setup with validation schema and default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      whyJoinUs: initialData?.whyJoinUs || "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = form;

  // Form submission handler to update the job description
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/companies/${companyId}`, values); // Sends the updated description to the server
      toast.success("Company Updated");
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
      const company_why_join_us = `Create a compelling "Why join us" content piece for ${rollname}. Highlight the unique opportunities, benefits, and experiences that ${rollname} offers to its users. Emphasize the platform's value proposition, such as access to a vast music library, personalized recommendations, exclusive content, community features, and career opportunities for musicians and creators. Tailor the content to attract potential users and illustrate why ${rollname} stands out among other music streaming platforms.`;
      await getGenerativeAIResponse(company_why_join_us).then((data) => {
        data = data.replace(/^'|'$/g, "");
        const cleanedText = data.replace(/[\*\#]/g, "");
        //form.setValue("description", cleanedText);
        setaiValue(cleanedText);
        setIsPrompting(false);
      });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };
  const onCopy = () => {
    navigator.clipboard.writeText(aiValue);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="mt-6 bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Why Join Us
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
      {!isEditing && (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.whyJoinUs && "text-neutral-500 italic"
          )}
        >
          {!initialData.whyJoinUs && "No description provided"}
          {initialData.whyJoinUs && <Preview value={initialData.whyJoinUs} />}
        </div>
      )}

      {/* Display the form when editing */}
      {isEditing && (
        <>
          <div className="flex items-center gap-2 my-2">
            <input
              type="text"
              placeholder="Company name"
              value={rollname}
              onChange={(e) => setrollname(e.target.value)} // Update the prompt value
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
            Note: Type the company name and click the lightbulb icon to generate
          </p>
          {aiValue && (
            <div className="w-full h-96 max-h-96 rounded-md bg-white overflow-y-scroll p-3 relative mt-4 text-muted-foreground">
              {aiValue}
              <Button
                className="absolute top-3 right-3 z-10"
                variant={"outline"}
                size={"icon"}
                onClick={onCopy}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          )}
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
              {/* Form field for job description */}
              <FormField
                control={form.control}
                name="whyJoinUs"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Editor {...field} />
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
