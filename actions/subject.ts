"use server";

import { subject } from "@/db/schema";
import db from "@/lib/db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createSubject(params: { name: string }) {
  const [data] = await db
    .insert(subject)
    .values(params)
    .returning({ id: subject.id });
  revalidatePath("/admin/subjects");
  return data;
}

export async function updateSubject(
  id: string,
  params: Partial<{ name: string }>
) {
  const [data] = await db
    .update(subject)
    .set(params)
    .where(eq(subject.id, id))
    .returning({ id: subject.id });
  revalidatePath("/admin/subjects");
  return data;
}

export async function deleteSubject(id: string) {
  await db.delete(subject).where(eq(subject.id, id));
}
