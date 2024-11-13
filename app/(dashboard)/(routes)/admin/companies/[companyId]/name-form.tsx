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

interface CompanyNameProps {
  initialData: {
    name: string;
  };
  companyId: string;
}

// Updated validation message
const formSchema = z.object({
  name: z.string().min(1, { message: "Job name is required" }),
});

export const CompanyName = ({ initialData, companyId }: CompanyNameProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });
  const { isSubmitting, isValid } = form.formState;

  // Updated notification message
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(`/api/companies/${companyId}`, values);
      toast.success("Company name updated successfully");
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Failed to update job name");
    }
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  return (
    <div className="mt-6 bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Company name
        <Button onClick={toggleEditing} variant={"ghost"}>
          {isEditing ? <>Cancel</> : (<><Pencil className="w-4 h-4 mr-2" />Edit</>)}
        </Button>
      </div>
      {/* Display name if not editing */}
      {!isEditing && <p className="text-sm mt-2">{initialData.name}</p>}

      {/* On editing mode, display the form */}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Joblo Planet'"
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
      )}
    </div>
  );
};
