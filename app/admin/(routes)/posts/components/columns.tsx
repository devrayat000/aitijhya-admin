"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";

export type PostColumn = {
  id: string;
  text: string;
  subject: {
    id: string;
    name: string;
  };
  book: {
    id: string;
    name: string;
  };
  chapter: {
    id: string;
    name: string;
  };
};

export const columns: ColumnDef<PostColumn>[] = [
  {
    accessorKey: "text",
    header: "Question/Text",
  },
  {
    accessorKey: "chapter.name",
    header: "Chapter",
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
