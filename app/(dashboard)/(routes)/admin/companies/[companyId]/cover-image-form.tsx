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

interface CompanyCoverImageFormProps {
  initialData: Company;
  companyId: string;
}

const formSchema = z.object({
  coverImage: z.string().min(1, "Image URL is required"),
});

export const CompanyCoverImageForm = ({
  initialData,
  companyId,
}: CompanyCoverImageFormProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const router = useRouter();

  const CompanyCoverImageForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      coverImage: initialData?.coverImage || "",
    },
  });

  const { isSubmitting, isValid } = CompanyCoverImageForm.formState;

  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/companies/${companyId}`, values);
      toast.success("Image Updated Successfully");
      handleToggleEditing();
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleImageDelete = async () => {
    try {
      await axios.patch(`/api/companies/${companyId}/deleteCoverImage`);
      toast.success("Cover Image Deleted Successfully");
      router.refresh();
    } catch {
      toast.error("Failed to delete cover image.");
    }
  };

  const handleToggleEditing = () => setIsEditMode((current) => !current);

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validImageTypes.includes(file.type)) {
      setFileError("Only JPG, JPEG, and PNG images are allowed.");
    } else {
      setFileError(null);
    }
  };

  return (
    <div className="mt-6 bg-neutral-50 rounded-md p-6 shadow-lg">
      <div className="font-semibold text-xl text-neutral-800 flex items-center justify-between mb-4">
        Cover Image
        <div className="flex items-center gap-x-2">
          <Button
            onClick={handleToggleEditing}
            variant={"ghost"}
            className="text-neutral-600 hover:text-neutral-800"
          >
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
      </div>

      {/* Display image if not editing */}
      {!isEditMode &&
        (!initialData.coverImage ? (
          <div className="flex items-center justify-center h-60 bg-neutral-200 rounded-md">
            <ImageIcon className="h-12 w-12 text-neutral-500" />
          </div>
        ) : (
          <div className="relative w-full h-60 aspect-video mt-2 rounded-md overflow-hidden shadow-md">
            <Image
              alt="Cover Image"
              fill
              className="w-full h-full object-cover"
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
                    <ImageUpload
                      value={field.value}
                      disabled={isSubmitting}
                      onChange={(url) => {
                        field.onChange(url);
                        handleFileChange(
                          url ? new File([url], "image.jpg") : null
                        );
                      }}
                      onRemove={() => {
                        field.onChange("");
                        setFileError(null);
                      }}
                    />
                  </FormControl>
                  {fileError && <FormMessage>{fileError}</FormMessage>}
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-4 justify-end">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
                className="bg-green-500 text-white hover:bg-green-600"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
              {/* Delete button, visible only in edit mode */}
              {initialData.coverImage && (
                <Button
                  onClick={handleImageDelete}
                  variant={"ghost"}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
