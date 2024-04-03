"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";

export type ChapterColumn = {
  id: string;
  name: string;
  subject: {
    id: string;
    name: string;
  };
  book: {
    id: string;
    name: string;
  };
};

export const columns: ColumnDef<ChapterColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "book.name",
    header: "Book/Author",
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
