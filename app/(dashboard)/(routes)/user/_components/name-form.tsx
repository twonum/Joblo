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
import { Pencil, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { UserProfile } from "@prisma/client";
import Box from "@/components/box";
import axios from "axios";

interface NameFormProps {
  initialData: UserProfile | null;
  userId: string;
}

// Validation schema
const formSchema = z.object({
  fullName: z.string().min(1, { message: "FullName is required" }),
});

export const NameForm = ({ initialData, userId }: NameFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: initialData?.fullName || "",
    },
  });
  const { isSubmitting, isValid } = form.formState;

  // Toggle edit mode
  const toggleEditing = () => setIsEditing((current) => !current);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/users/${userId}`, values);
      toast.success("Profile updated successfully");
      toggleEditing();
      router.refresh();
    } catch {
      toast.error("Failed to update Name");
    }
  };

  return (
    <Box>
      {!isEditing && (
        <div
          className={cn(
            "text-lg mt-2 flex items-center gap-2",
            !initialData?.fullName && "text-neutral-500 italic"
          )}
        >
          <UserCircle className="w-6 h-6" />
          {initialData?.fullName ? initialData.fullName : "no name"}
        </div>
      )}
      {isEditing ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-center gap-2 flex-1"
          >
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'taha saleem'"
                      {...field}
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
              <Button onClick={toggleEditing} variant="ghost">
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <Button onClick={toggleEditing} variant={"ghost"}>
          <Pencil className="w-4 h-4 mr-2" />
          Edit
        </Button>
      )}
    </Box>
  );
};
