import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import React from "react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { columns, CompanyColumns } from "./_components/columns";
import { format } from "date-fns";

const CompaniesOverviewPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const companies = await db.company.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedCompanies: CompanyColumns[] = companies.map((company) => ({
    id: company.id,
    name: company.name,
    logo: company.logo ? company.logo : "",
    createdAt: company.createdAt
      ? format(new Date(company.createdAt), "MMMM do, yyyy") // Make sure createdAt is of the correct type
      : "N/A",
  }));

  return (
    <div className="p-6">
      {/* Button Container */}
      <div className="flex items-center justify-end mb-4">
        <Link href="/admin/companies/create">
          <Button className="flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>New Company</span>
          </Button>
        </Link>
      </div>

      {/* Data Table - Companies List */}
      <div className="mt-6 overflow-x-auto">
        {/* Ensure the table is scrollable horizontally on smaller screens */}
        <DataTable
          columns={columns}
          data={formattedCompanies}
          searchKey="name"
        />
      </div>
    </div>
  );
};

export default CompaniesOverviewPage;
