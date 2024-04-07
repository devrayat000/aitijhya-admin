"use server";

import { eq, InferInsertModel } from "drizzle-orm";
import { post } from "@/db/schema";
import db from "@/lib/db";
import { saveIndex, deleteIndex } from "@/webhooks/saveIndex";
import { revalidatePath } from "next/cache";

type PostInput = Omit<InferInsertModel<typeof post>, "id">;

export async function createPost(params: PostInput) {
  const [data] = await db
    .insert(post)
    .values(params)
    .returning({ id: post.id });

  await saveIndex(data.id);
  revalidatePath("/admin/posts");
  return data;
}

export async function updatePost(id: string, params: Partial<PostInput>) {
  const [data] = await db
    .update(post)
    .set(params)
    .where(eq(post.id, id))
    .returning({ id: post.id });

  await saveIndex(data.id);
  revalidatePath("/admin/posts");
  revalidatePath(`/admin/posts/${id}`);
  return data;
}

export async function deletePost(id: string) {
  await db.delete(post).where(eq(post.id, id));
  await deleteIndex(id);
}
