"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
// import { ApiList } from "@/components/ui/api-list";

import { columns, ChapterColumn } from "./columns";
import Link from "next/link";

interface ChaptersClientProps {
  data: ChapterColumn[];
}

export const ChaptersClient: React.FC<ChaptersClientProps> = ({ data }) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Chapters (${data.length})`}
          description="Manage chapters for your products"
        />
        <Button asChild>
          <Link href="/admin/chapters/new">
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API Calls for Chapters" />
      <Separator />
      {/* <ApiList entityName="chapters" entityIdName="chapterId" /> */}
    </>
  );
};
