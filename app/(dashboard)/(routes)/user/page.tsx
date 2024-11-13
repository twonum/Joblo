import Box from "../../../../components/box";
import { CustomBreadCrumb } from "../../../../components/custom-bread-crumb";
import { auth, currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import { NameForm } from "./_components/name-form";
import { db } from "../../../../lib/db";
import { EmailForm } from "./_components/email-form";
import { ContactForm } from "./_components/contact-form";
import { ResumeForm } from "./_components/resume-form";
import React from "react";

const ProfilePage = async () => {
  const { userId } = await auth();
  const user = await currentUser();

  // Redirect if no user is authenticated
  if (!userId) {
    redirect("/sign-in");
  }

  // Fetch the user profile and resumes
  const profile = await db.userProfile.findUnique({
    where: {
      userId,
    },
    include: {
      resumes: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  return (
    <div className="flex flex-col items-center p-4 sm:p-6 md:p-8 lg:p-10">
      <Box className="w-full max-w-screen-lg">
        <CustomBreadCrumb breadcrumbPage="My Profile" />
      </Box>

      <Box className="flex flex-col items-center p-6 mt-8 w-full max-w-screen-md bg-white border rounded-md shadow-lg space-y-6">
        {/* Profile Image */}
        {user && user.hasImage && (
          <div className="relative w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full shadow-md">
            <Image
              fill
              className="object-cover rounded-full"
              alt="Profile Image"
              src={user.imageUrl}
            />
          </div>
        )}

        {/* Forms Section */}
        <div className="w-full space-y-4">
          <NameForm initialData={profile} userId={userId} />
          <EmailForm initialData={profile} userId={userId} />
          <ContactForm initialData={profile} userId={userId} />
          <ResumeForm initialData={profile} userId={userId} />
        </div>
      </Box>
    </div>
  );
};

export default ProfilePage;
