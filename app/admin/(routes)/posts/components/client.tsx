"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
// import { ApiList } from "@/components/ui/api-list";

import { columns, PostColumn } from "./columns";
import Link from "next/link";
import { deleteManyPosts } from "@/actions/post";
import { useServerTableStore } from "@/hooks/use-server-table-data";

export const PostsClient: React.FC = () => {
  const count = useServerTableStore((state) => state.count);

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Posts (${count})`}
          description="Manage posts for your products"
        />
        <Button asChild>
          <Link href="/admin/posts/new">
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </Button>
      </div>
      <Separator />
      <DataTable
        searchKey="text"
        columns={columns}
        deleteAction={deleteManyPosts}
      />
      {/* <Heading title="API" description="API Calls for Posts" />
      <Separator /> */}
      {/* <ApiList entityName="posts" entityIdName="postId" /> */}
    </>
  );
};
