"use client";

import SubjectFilter from "./subjects";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useSearchParams } from "next/navigation";
import BookFilter from "./books";
import ChapterFilter from "./chapters";

type FilterItem = { value: string };

export interface FilterClientProps {
  initialData?: {
    subjects?: FilterItem[];
    books?: FilterItem[];
    chapters?: FilterItem[];
  };
}

export default function FilterClient({ initialData }: FilterClientProps) {
  const searchParams = useSearchParams();
  const form = useForm({
    defaultValues: {
      subject: searchParams.get("subject") || undefined,
      book: searchParams.get("book") || undefined,
      chapter: searchParams.get("chapter") || undefined,
    },
  });

  console.log({
    subject: searchParams.get("subject") || undefined,
    book: searchParams.get("book") || undefined,
    chapter: searchParams.get("chapter") || undefined,
  });

  return (
    <Form {...form}>
      <SubjectFilter subjects={initialData?.subjects} />
      <BookFilter books={initialData?.books} />
      <ChapterFilter chapters={initialData?.chapters} />
    </Form>
  );
}
