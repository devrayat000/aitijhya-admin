"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";

export type BookColumn = {
  id: string;
  name: string;
  subject: {
    id: string;
    name: string;
  };
};

export const columns: ColumnDef<BookColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "subject.name",
    header: "Subject",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
