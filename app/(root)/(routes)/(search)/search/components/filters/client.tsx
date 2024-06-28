"use client";

import SubjectFilter from "./subjects";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useSearchParams } from "next/navigation";
import BookFilter from "./books";
import ChapterFilter from "./chapters";

type FilterItem = { value: string; count: number };

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
      subjects:
        initialData?.subjects?.filter((s) =>
          searchParams.getAll("subjects").includes(s.value)
        ) || [],
      books:
        initialData?.books?.filter((s) =>
          searchParams.getAll("books").includes(s.value)
        ) || [],
      chapters:
        initialData?.chapters?.filter((s) =>
          searchParams.getAll("chapters").includes(s.value)
        ) || [],
    },
  });

  return (
    <Form {...form}>
      <SubjectFilter subjects={initialData?.subjects} />
      <BookFilter
        books={initialData?.books}
        query={searchParams.get("query")!}
      />
      <ChapterFilter
        chapters={initialData?.chapters}
        query={searchParams.get("query")!}
      />
    </Form>
  );
}
