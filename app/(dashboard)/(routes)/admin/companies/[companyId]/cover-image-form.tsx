"use client";

import React, { useState } from "react";
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
import { Pencil, ImageIcon, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Company } from "@prisma/client";
import Image from "next/image";
import { ImageUpload } from "@/components/image-upload";

// Define props interface for CompanyCoverImageForm
interface CompanyCoverImageFormProps {
  initialData: Company;
  companyId: string;
}

// Define the schema for form validation using Zod
const formSchema = z.object({
  coverImage: z.string().min(1, "Image URL is required"),
});

// Main CompanyCoverImageForm component
export const CompanyCoverImageForm = ({
  initialData,
  companyId,
}: CompanyCoverImageFormProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const router = useRouter();

  const CompanyCoverImageForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      coverImage: initialData?.coverImage || "",
    },
  });

  const { isSubmitting, isValid } = CompanyCoverImageForm.formState;

  // Handle form submission
  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/companies/${companyId}`, values);
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
        Cover Image
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

      {/* Display image if not editing */}
      {!isEditMode &&
        (!initialData.coverImage ? (
          <div className="flex items-center justify-center h-60 bg-neutral-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-neutral-500" />
          </div>
        ) : (
          <div className="relative w-full h-60 aspect-video mt-2">
            <Image
              alt="coverImage"
              fill
              className="w-full h-full object-cover rounded-md"
              src={initialData.coverImage}
            />
          </div>
        ))}

      {/* Display the form when editing */}
      {isEditMode && (
        <Form {...CompanyCoverImageForm}>
          <form
            onSubmit={CompanyCoverImageForm.handleSubmit(handleFormSubmit)}
            className="space-y-4"
          >
            <FormField
              control={CompanyCoverImageForm.control}
              name="coverImage"
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
