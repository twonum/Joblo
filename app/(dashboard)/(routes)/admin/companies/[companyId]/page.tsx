import { IconBadge } from "../../../../../../components/icon-badge";
import { db } from "../../../../../../lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, LayoutDashboard, Network } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CompanyName } from "./name-form";
import { CompanyLogoForm } from "./logo-form";
import { CompanyDescriptionForm } from "./description-form";
import { CompanySocialContactsForm } from "./social-contacts-form";
import { CompanyCoverImageForm } from "./cover-image-form";
import { CompanyOverviewForm } from "./company-overview";
import { WhyJoinUsForm } from "./why-join-us-form";
import React from "react";

const CompanyEditPage = async ({
  params,
}: {
  params: { companyId: string };
}) => {
  const validcompanyID = /^[0-9a-fA-F]{24}$/;
  params = await params;
  const { companyId } = params; // Ensure `params` is awaited

  if (!validcompanyID.test(companyId)) {
    return redirect("/admin/companies");
  }

  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const company = await db.company.findUnique({
    where: {
      id: companyId,
      userId,
    },
  });

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  if (!company) {
    return redirect("/admin/companies");
  }

  const requiredFields = [
    company.name,
    company.description,
    company.logo,
    company.coverImage,
    company.mail,
    company.website,
    company.linkedIn,
    company.address_lin_1,
    company.city,
    company.state,
    company.overview,
    company.whyJoinUs,
  ];
  const totalFields = requiredFields.length;
  const filledFields = requiredFields.filter(Boolean).length;
  const completionText = `(${filledFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-12">
      <Link
        href="/admin/companies"
        className="flex items-center gap-3 text-sm text-neutral-500 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </Link>

      {/* Title */}
      <div className="flex flex-col gap-y-2 items-start sm:items-center sm:flex-row sm:justify-between my-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Company Setup
          </h1>
          <span className="text-sm text-neutral-500">
            Complete All Fields {completionText}
          </span>
        </div>
      </div>

      {/* Container Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Left Container */}
        <div className="space-y-6">
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl font-medium text-neutral-700">
              Customize your Company
            </h2>
          </div>
          <CompanyName initialData={company} companyId={company.id} />
          <CompanyDescriptionForm
            initialData={company}
            companyId={company.id}
          />
          <CompanyLogoForm initialData={company} companyId={company.id} />
        </div>

        {/* Right Container */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Network} />
              <h2 className="text-xl font-medium text-neutral-700">
                Company Social Contacts
              </h2>
            </div>
            <CompanySocialContactsForm
              initialData={company}
              companyId={company.id}
            />
            <CompanyCoverImageForm
              initialData={company}
              companyId={company.id}
            />
          </div>
        </div>

        {/* Full-Width Forms */}
        <div className="space-y-6 lg:col-span-2">
          <CompanyOverviewForm initialData={company} companyId={company.id} />
          <WhyJoinUsForm initialData={company} companyId={company.id} />
        </div>
      </div>
    </div>
  );
};

export default CompanyEditPage;
