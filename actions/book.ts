"use server";

import { InferInsertModel, InferSelectModel, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { bookAuthor } from "@/db/schema";
import db from "@/lib/db";

export async function createBook(params: InferInsertModel<typeof bookAuthor>) {
  await db.insert(bookAuthor).values(params);
  revalidatePath("/admin/books");
  redirect("/admin/books");
  // return data;
}

export async function updateBook(
  id: string,
  params: Partial<InferInsertModel<typeof bookAuthor>>
) {
  await db.update(bookAuthor).set(params).where(eq(bookAuthor.id, id));
  revalidatePath("/admin/books");
  redirect("/admin/books");
  // return data;
}

export async function deleteBook(id: string) {
  await db.delete(bookAuthor).where(eq(bookAuthor.id, id));
  revalidatePath("/admin/books");
  redirect("/admin/books");
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

export async function deleteManyBooks(_: void, ids: string[]) {
  await db.delete(bookAuthor).where(inArray(bookAuthor.id, ids));
  revalidatePath("/admin/books");
  redirect(`/admin/books`);
}
