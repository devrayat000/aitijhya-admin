"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
// import { ApiList } from "@/components/ui/api-list";

import { columns } from "./columns";
import Link from "next/link";
import { deleteManyAds } from "@/server/ad/action/ad";
import { useServerTableStore } from "@/providers/server-table-provider";

interface AdsClientProps {}

export const AdsClient: React.FC<AdsClientProps> = () => {
  const { count } = useServerTableStore();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Ads (${count})`}
          description="Manage ads for your products"
        />
        <Button asChild>
          <Link href="/admin/ads/new">
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </Button>
      </div>
      <Separator />
      <DataTable
        searchKey="title"
        columns={columns}
        deleteAction={deleteManyAds}
      />
      <Heading title="API" description="API Calls for Ads" />
      <Separator />
      {/* <ApiList entityName="ads" entityIdName="adId" /> */}
    </>
  );
};
