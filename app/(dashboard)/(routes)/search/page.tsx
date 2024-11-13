import { getJobs } from "../../../../actions/get-jobs";
import { SearchContainer } from "../../../../components/search-container";
import { db } from "../../../../lib/db";
import { auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { CategoriesList } from "./_components/categories-list";
import { PageContent } from "./_components/page-content";
import { AppliedFilters } from "../../_components/applied-filters";
import React from "react";

interface SearchProps {
  searchParams: {
    title?: string;
    categoryId?: string;
    createdAtFilter?: string;
    shiftTiming?: string;
    yearsOfExperience?: string;
    workMode?: string;
  };
}

const SearchPage = async ({ searchParams }: SearchProps) => {
  // Ensure headers are awaited before usage
  const headerValues = await headers();
  console.log(
    "Content-Security-Policy:",
    headerValues.get("Content-Security-Policy")
  );

  // Await authentication to get user ID
  const { userId } = await auth();

  // Avoid using Promise.resolve() – searchParams are accessed directly
  const {
    title = "",
    categoryId = "",
    createdAtFilter = "",
    shiftTiming = "",
    yearsOfExperience = "",
    workMode = "",
  } = searchParams;

  // Construct resolvedSearchParams directly without async operations
  const resolvedSearchParams = {
    title,
    categoryId,
    createdAtFilter,
    shiftTiming,
    yearsOfExperience,
    workMode,
  };

  // Retrieve jobs based on resolved search parameters
  const jobs = await getJobs(resolvedSearchParams);
  console.log(`jobs count: ${jobs.length}`);

  // Retrieve categories from the database
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <>
      <div className="px-6 pt-6 block md:hidden md:mb-0">
        <SearchContainer />
      </div>
      <div className="p-6">
        {/* Render categories */}
        <CategoriesList categories={categories} />

        {/* Render applied filters */}
        <AppliedFilters categories={categories} />

        {/* Render main page content with job data */}
        <PageContent jobs={jobs} userId={userId} />
      </div>
    </>
  );
};

export default SearchPage;
