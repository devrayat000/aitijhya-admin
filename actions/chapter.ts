"use server";

import { chapter } from "@/db/schema";
import db from "@/lib/db";
import { InferSelectModel, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createChapter(params: {
  name: string;
  bookAuthorId: string;
}) {
  await db.insert(chapter).values(params);
  revalidatePath("/admin/chapters");
  redirect("/admin/chapters");
  // return data;
}

export async function updateChapter(
  id: string,
  params: Partial<{ name: string; bookAuthorId: string }>
) {
  await db.update(chapter).set(params).where(eq(chapter.id, id));
  revalidatePath("/admin/chapters");
  redirect("/admin/chapters");
  // return data;
}

export async function deleteChapter(id: string) {
  await db.delete(chapter).where(eq(chapter.id, id));
  revalidatePath("/admin/chapters");
  redirect("/admin/chapters");
}

export async function getChaptersByBooks(
  _: InferSelectModel<typeof chapter>[] | null,
  bookAuthorId: string
) {
  const books = await db
    .select()
    .from(chapter)
    .where(eq(chapter.bookAuthorId, bookAuthorId));
  return books;
}
