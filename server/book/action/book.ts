"use server";

import { InferInsertModel, InferSelectModel, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { bookAuthor } from "@/db/schema";
import db from "@/lib/db";
import { getFilteredBooks } from "../service/get-filtered-books";

export async function createBook(params: InferInsertModel<typeof bookAuthor>) {
  const [data] = await db
    .insert(bookAuthor)
    .values(params)
    .returning({ id: bookAuthor.id });
  revalidatePath("/admin/books");
  // redirect("/admin/books");
  return data;
}

export async function updateBook(
  id: string,
  params: Partial<InferInsertModel<typeof bookAuthor>>
) {
  await db.update(bookAuthor).set(params).where(eq(bookAuthor.id, id));
  revalidatePath("/admin/books");
  // redirect("/admin/books");
  // return data;
}

export async function deleteBook(id: string) {
  await db.delete(bookAuthor).where(eq(bookAuthor.id, id));
  revalidatePath("/admin/books");
  // redirect("/admin/books");
}

export async function getBooksBySubject(
  _: Pick<InferSelectModel<typeof bookAuthor>, "id" | "name">[] | null,
  subjectId: string
) {
  const books = await getFilteredBooks({
    subjects: [subjectId],
    fields: {
      id: bookAuthor.id,
      name: bookAuthor.name,
    },
  });
  return books;
}

export async function deleteManyBooks(_: void, ids: string[]) {
  await db.delete(bookAuthor).where(inArray(bookAuthor.id, ids));
  revalidatePath("/admin/books");
  // redirect(`/admin/books`);
}
