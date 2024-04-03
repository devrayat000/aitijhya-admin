"use server";

import { bookAuthor } from "@/db/schema";
import db from "@/lib/db";
import { InferInsertModel, InferSelectModel, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createBook(params: InferInsertModel<typeof bookAuthor>) {
  const [data] = await db
    .insert(bookAuthor)
    .values(params)
    .returning({ id: bookAuthor.id });
  revalidatePath("/admin/books");
  return data;
}

export async function updateBook(
  id: string,
  params: Partial<InferInsertModel<typeof bookAuthor>>
) {
  const [data] = await db
    .update(bookAuthor)
    .set(params)
    .where(eq(bookAuthor.id, id))
    .returning({ id: bookAuthor.id });
  revalidatePath("/admin/books");
  return data;
}

export async function deleteBook(id: string) {
  await db.delete(bookAuthor).where(eq(bookAuthor.id, id));
}

export async function getBooksBySubject(
  _: InferSelectModel<typeof bookAuthor>[] | null,
  subjectId: string
) {
  const books = await db
    .select()
    .from(bookAuthor)
    .where(eq(bookAuthor.subjectId, subjectId));
  return books;
}
