"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Pencil, ImageIcon, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Job } from "@prisma/client";
import Image from "next/image";
import { ImageUpload } from "@/components/image-upload";

// Define props interface for ImageForm
interface ImageFormProps {
  initialData: Job;
  jobId: string;
}

// Define the schema for form validation using Zod
const formSchema = z.object({
  imageUrl: z.string().min(1, "Image URL is required"),
});

// Main ImageForm component
export const ImageForm = ({ initialData, jobId }: ImageFormProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const router = useRouter();
  
  const imageForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: initialData?.imageUrl || "",
    },
  });
  
  const { isSubmitting, isValid } = imageForm.formState;

  // Handle form submission
  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success("Image Updated");
      handleToggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // Toggle editing mode
  const handleToggleEditing = () => setIsEditMode((current) => !current);

  return (
    <div className="mt-6 bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job Cover Image
        <Button onClick={handleToggleEditing} variant={"ghost"}>
          {isEditMode ? <>Cancel</> : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>

      {/* Display image if not editing */}
      {!isEditMode && (
        !initialData.imageUrl ? (
          <div className="flex items-center justify-center h-60 bg-neutral-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-neutral-500" />
          </div>
        ) : (
          <div className="relative w-full h-60 aspect-video mt-2">
            <Image
              alt="Cover Image"
              fill
              className="w-full h-full object-cover"
              src={initialData.imageUrl}
            />
          </div>
        )
      )}

      {/* Display the form when editing */}
      {isEditMode && (
        <Form {...imageForm}>
          <form onSubmit={imageForm.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={imageForm.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    {/* ImageUpload component to handle image uploading */}
                    <ImageUpload
                      value={field.value}
                      disabled={isSubmitting}
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange("")}
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
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
