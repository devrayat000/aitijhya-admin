import db from "@/lib/db";
import { BookForm } from "./components/book-form";
import { eq } from "drizzle-orm";
import { bookAuthor, subject } from "@/db/schema";
import { getBookById } from "@/services/book";
import { getSubjects } from "@/services/subject";
import { Suspense } from "react";

const SizePage = async ({ params }: { params: { bookId: string } }) => {
  let initialData: any = {
    subjects: (await getSubjects()).subjects,
  };

  if (params.bookId !== "new") {
    initialData = {
      ...initialData,
      book: await getBookById(params.bookId),
    };
  } else {
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Suspense>
          <BookForm initialData={initialData} />
        </Suspense>
      </div>
    </div>
  );
};

export default SizePage;
