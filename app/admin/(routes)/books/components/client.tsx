"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
// import { ApiList } from "@/components/ui/api-list";

import { columns, BookColumn } from "./columns";
import Link from "next/link";
import { deleteManyBooks } from "@/actions/book";

interface BooksClientProps {
  data: BookColumn[];
}

export const BooksClient: React.FC<BooksClientProps> = ({ data }) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Books (${data.length})`}
          description="Manage books for your products"
        />
        <Button asChild>
          <Link href="/admin/books/new">
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </Button>
      </div>
      <Separator />
      <DataTable
        searchKey="name"
        columns={columns}
        data={data}
        deleteAction={deleteManyBooks}
      />
      <Heading title="API" description="API Calls for Books" />
      <Separator />
      {/* <ApiList entityName="books" entityIdName="bookId" /> */}
    </>
  );
};
