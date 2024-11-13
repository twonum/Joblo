"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const formSchema = z.object({
  title: z.string().min(1, { message: "Job title is required" }),
});

const JobCreationPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });
  const { isSubmitting, isValid } = form.formState;
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/jobs", values);
      router.push(`/admin/jobs/${response.data.id}`);
      toast.success("Job Created");
    } catch (error) {
      console.log((error as Error)?.message);
      toast.error("Failed to create job. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="w-full max-w-3xl p-10 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-4">Name your Job</h1>
        <p className="text-lg text-neutral-500 text-center mb-10">
          What would you like to name your job? Don&apos;t worry, you can change
          it later.
        </p>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            {/* Form Field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-semibold">
                    Job Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="text-lg py-3 px-4"
                      disabled={isSubmitting}
                      placeholder="e.g. 'ML Engineer'"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-base text-gray-600 mt-2">
                    Role of this job
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Buttons */}
            <div className="flex justify-center gap-6 mt-10">
              <Link href="/admin/jobs">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-lg py-2 px-6"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="text-lg py-2 px-6"
              >
                Create
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default JobCreationPage;
