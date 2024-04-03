"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";

export type SubjectColumn = {
  id: string;
  name: string;
  // createdAt: string;
};

export const columns: ColumnDef<SubjectColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  // {
  //   accessorKey: "createdAt",
  //   header: "Date",
  // },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
