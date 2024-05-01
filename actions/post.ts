"use server";

import { eq, inArray, InferInsertModel } from "drizzle-orm";
import { post } from "@/db/schema";
import db from "@/lib/db";
import {
  saveIndex,
  deleteIndex,
  deleteManyIndices,
  saveManyIndices,
  saveManyIndicesByIds,
} from "@/webhooks/saveIndex";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type PostInput = Omit<InferInsertModel<typeof post>, "id">;

export async function createPost(params: PostInput): Promise<{ id: string }>;
export async function createPost(
  params: PostInput[]
): Promise<{ id: string }[]>;
export async function createPost(params: PostInput[] | PostInput) {
  const results = await db
    .insert(post)
    .values(Array.isArray(params) ? params : [params])
    .returning({ id: post.id });

  if (Array.isArray(params)) {
    await saveManyIndicesByIds(results.map((r) => r.id));
    revalidatePath("/admin/posts");
    return results;
  } else {
    await saveIndex(results[0].id);
    revalidatePath("/admin/posts");
    return results[0];
  }
}

export async function updatePost(id: string, params: Partial<PostInput>) {
  const [data] = await db
    .update(post)
    .set(params)
    .where(eq(post.id, id))
    .returning({ id: post.id });

  await saveIndex(data.id);
  revalidatePath("/admin/posts");
  // redirect(`/admin/posts`);
  // return data;
}

export async function deletePost(id: string) {
  await db.delete(post).where(eq(post.id, id));
  await deleteIndex(id);
  revalidatePath("/admin/posts");
  // redirect(`/admin/posts`);
}

export async function deleteManyPosts(_: void, ids: string[]) {
  await db.delete(post).where(inArray(post.id, ids));
  await deleteManyIndices(ids);
  revalidatePath("/admin/posts");
  // redirect(`/admin/posts`);
}
