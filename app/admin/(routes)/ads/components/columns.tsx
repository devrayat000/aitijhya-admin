"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Check, X } from "lucide-react";

import { CellAction } from "./cell-action";
import { Checkbox } from "@/components/ui/checkbox";

export type AdColumn = {
  id: string;
  title: string;
  imageUrl: string;
  subjects: {
    id: string;
    name: string;
  }[];
};

export const columns: ColumnDef<AdColumn>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "imageUrl",
    header: "Cover Photo",
  },
  {
    accessorKey: "subjects.name",
    header: "Subjects",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
